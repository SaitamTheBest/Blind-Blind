using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.DTOs.General;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.General;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Blind_Blind_Backend.Services.DataUsers.Methods
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IGeneralService _generalService;
        private readonly JwtOptionsDTO _jwtOptions;

        public AuthService(IAuthRepository authRepository, IOptions<JwtOptionsDTO> options,  IConfiguration config, IGeneralService generalService)
        {
            _authRepository = authRepository;
            _config = config;
            _generalService = generalService;
            _jwtOptions = options.Value;
        }

        public async Task<AuthDTO?> LoginAsync(LoginDTO login)
        {
            var connection = await _authRepository.GetAuthByEmailAsync(login.Email);

            if (connection == null)
                return null;

            if (!_generalService.VerifyPassword(connection.Password, login.Password))
                return null;

            var token = GenerateJwtToken(connection);

            return new AuthDTO
            {
                Token = token
            };
        }

        private string GenerateJwtToken(Entities.DataUsers.ConnectionBlindBlind user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id_User),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.User.Roles.Role_Name)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtOptions.Key)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

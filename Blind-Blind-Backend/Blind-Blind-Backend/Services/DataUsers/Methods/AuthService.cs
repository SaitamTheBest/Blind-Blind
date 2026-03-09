using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
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

        public AuthService(IAuthRepository authRepository, IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
        }

        public async Task<AuthDTO?> LoginAsync(ConnectionBlindBlindDTO login)
        {
            var connection = await _authRepository.GetByEmailAsync(login.Email);

            if (connection == null)
                return null;

            if (connection.Password != login.Password)
                return null;

            var token = GenerateJwtToken(connection);

            return new AuthDTO
            {
                Token = token,
                User = login
            };
        }

        private string GenerateJwtToken(Entities.DataUsers.ConnectionBlindBlind user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id_User),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

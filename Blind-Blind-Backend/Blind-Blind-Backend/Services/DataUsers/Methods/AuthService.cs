using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.DTOs.General;
using Blind_Blind_Backend.Entities.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.General;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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
            var user = await _authRepository.GetAuthByEmailAsync(login.Email);

            if (user == null)
                return null;

            if (!_generalService.VerifyPassword(user.Password, login.Password))
                return null;

            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            var expiration = login.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : DateTime.UtcNow.AddDays(1);

            var hashedToken = HashRefreshToken(refreshToken);

            await _authRepository.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = hashedToken,
                Id_User = user.Id_User,
                ExpirationDate = expiration,
                CreatedAt = DateTime.UtcNow
            });

            return new AuthDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthDTO?> RefreshTokenAsync(string refreshToken)
        {
            var hashedToken = HashRefreshToken(refreshToken);

            var storedToken = await _authRepository.GetRefreshTokenAsync(hashedToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpirationDate < DateTime.UtcNow)
                return null;

            var user = await _authRepository.GetUserByIdAsync(storedToken.Id_User);

            storedToken.IsRevoked = true;
            await _authRepository.UpdateRefreshTokenAsync(storedToken);

            var newRefreshToken = GenerateRefreshToken();
            var hashedNewToken = HashRefreshToken(newRefreshToken);
            var newExpiration = DateTime.UtcNow.AddDays(30);

            await _authRepository.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = hashedNewToken,
                Id_User = user.Id_User,
                ExpirationDate = newExpiration,
                CreatedAt = DateTime.UtcNow
            });

            var newAccessToken = GenerateAccessToken(user);

            return new AuthDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var hashedToken = HashRefreshToken(refreshToken);

            var token = await _authRepository.GetRefreshTokenAsync(hashedToken);

            if (token != null)
            {
                token.IsRevoked = true;
                await _authRepository.UpdateRefreshTokenAsync(token);
            }
        }

        private string GenerateAccessToken(ConnectionBlindBlind user)
        {
            var claims = new[]
            {
                new Claim("Id_User", user.Id_User),
                new Claim("Email", user.Email),
                new Claim("Role", user.User.Roles.Role_Name),
                new Claim("Name", user.User.Username),
                new Claim("Avatar", user.User.Avatar.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtOptions.Key)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }

        private string HashRefreshToken(string token)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(bytes);
        }
    }
}

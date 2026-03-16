using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Services.DataUsers
{
    public interface IAuthService
    {
        Task<AuthDTO?> LoginAsync(LoginDTO login);
        Task<AuthDTO?> RefreshTokenAsync(string refreshToken);
        Task RevokeRefreshTokenAsync(string refreshToken);
    }
}

using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Repositories.DataUsers
{
    public interface IAuthRepository
    {
        Task<ConnectionBlindBlind?> GetAuthByEmailAsync(string email);
        Task SaveRefreshTokenAsync(RefreshToken refreshToken);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task UpdateRefreshTokenAsync(RefreshToken refreshToken);
        Task<ConnectionBlindBlind?> GetUserByIdAsync(string userId);
    }
}

using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Repositories.DataUsers
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(string id);
        Task<IReadOnlyList<User>> GetAllAsync();
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        Task AddConnectionBlindBlindAsync(ConnectionBlindBlind connectionBlindBlind);
        Task UpdateConnectionBlindBlindAsync(ConnectionBlindBlind connectionBlindBlind);
        Task DeleteConnectionBlindBlindAsync(string id);
        Task<int> GetTotalUsersAsync();
        Task<int> GetTotalRanksAsync();
        Task<int> GetTotalRolesAsync();
        Task<int> GetTotalConnectionsAsync();
    }
}

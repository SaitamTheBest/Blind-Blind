using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Repositories.DataUsers
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(string id);
        Task<IReadOnlyList<User>> GetAllAsync();
        Task AddUserAsync(User user);
    }
}

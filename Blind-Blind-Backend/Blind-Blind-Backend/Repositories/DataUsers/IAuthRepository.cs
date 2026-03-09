using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Repositories.DataUsers
{
    public interface IAuthRepository
    {
        Task<ConnectionBlindBlind?> GetByEmailAsync(string email);
    }
}

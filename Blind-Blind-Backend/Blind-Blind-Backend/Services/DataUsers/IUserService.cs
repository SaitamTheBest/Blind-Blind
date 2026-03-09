using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Services.DataUsers
{
    public interface IUserService
    {
        Task<UserDTO> GetByIdAsync(string id);
        Task CreateUserAsync(UserDTO userDTO);
        Task CreateConnectionBlindBlind(ConnectionBlindBlindDTO connectionBlindDTO);
    }

}

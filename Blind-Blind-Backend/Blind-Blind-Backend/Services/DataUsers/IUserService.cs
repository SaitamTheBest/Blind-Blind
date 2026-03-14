using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;

namespace Blind_Blind_Backend.Services.DataUsers
{
    public interface IUserService
    {
        Task<UserDTO> GetByIdAsync(string id);
        Task<User> CreateUserAsync(UserCreateDTO userDTO);
        Task UpdateUserAsync(UserUpdateDTO user);
        Task DeleteUserAsync(string id);
        Task CreateConnectionBlindBlind(ConnectionBlindBlindCreateDTO connectionBlindDTO);
        Task UpdateConnectionBlindBlind(ConnectionBlindBlindCreateDTO connectionBlindBlind);
        Task DeleteConnectionBlindBlind(string id);        
    }

}

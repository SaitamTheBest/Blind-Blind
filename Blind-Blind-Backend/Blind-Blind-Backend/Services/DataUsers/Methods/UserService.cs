using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDTO?> GetByIdAsync(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        return new UserDTO
        {
            Id_User = user.Id_User,
            Username = user.Username,
        };
    }

    public async Task CreateAsync(UserDTO userDTO)
    {
        var newUser = new User
        {
            Username = userDTO.Username,
        };

        await _userRepository.AddUserAsync(newUser);
    }
}

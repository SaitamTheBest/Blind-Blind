using Blind_Blind_Backend.DTOs.DataUsers;
using Blind_Blind_Backend.Entities.DataUsers;
using Blind_Blind_Backend.Repositories.DataUsers;
using Blind_Blind_Backend.Services.DataUsers;
using Blind_Blind_Backend.Services.General;
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IGeneralService _generalService;

    public UserService(IUserRepository userRepository, IGeneralService generalService)
    {
        _userRepository = userRepository;
        _generalService = generalService;
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

    public async Task CreateUserAsync(UserDTO userDTO)
    {
        byte[]? avatarBytes = await _generalService.ConvertImageToBytes(userDTO.Avatar);

        var newUser = new User
        {
            Id_User = Guid.NewGuid().ToString(),
            Username = userDTO.Username,
            Elo = 0,
            Id_Rank = 1,
            Id_Roles = 1,
            Avatar = avatarBytes
        };

        await _userRepository.AddUserAsync(newUser);
    }

    public async Task CreateConnectionBlindBlind(ConnectionBlindBlindDTO connectionBlindDTO)
    {
        string hashedPassword = _generalService.HashPassword(connectionBlindDTO.Password);

        var newConnection = new ConnectionBlindBlind
        {
            Id_User = connectionBlindDTO.Id_User,
            Email = connectionBlindDTO.Email,
            Password = hashedPassword,
        };

        await _userRepository.AddConnectionBlindBlindAsync(newConnection);
    }
}

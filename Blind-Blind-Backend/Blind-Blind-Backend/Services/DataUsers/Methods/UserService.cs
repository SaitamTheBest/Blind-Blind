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
            Avatar = user.Avatar != null ? Convert.ToBase64String(user.Avatar) : null,
            Elo = user.Elo,
            Rank = user.Rank != null ? new RankDTO
            {
                Id_Rank = user.Rank.Id_Rank,
                Rank_Name = user.Rank.Rank_Name,
            } : null,
            Roles = user.Roles != null ? new RolesDTO
            {
                Id_Roles = user.Roles.Id_Roles,
                Role_Name = user.Roles.Role_Name,
            } : null
        };
    }

    public async Task<User> CreateUserAsync(UserCreateDTO userDTO)
    {
        var newUser = new User
        {
            Id_User = Guid.NewGuid().ToString(),
            Username = userDTO.Username,
            Elo = 0,
            Id_Rank = 1,
            Id_Roles = 1,
            Created_At = DateTime.UtcNow
        };

        if (!string.IsNullOrEmpty(userDTO.Avatar))
        {
            try
            {
                newUser.Avatar = Convert.FromBase64String(userDTO.Avatar);
            }
            catch
            {
                throw new ArgumentException("Avatar n'est pas un Base64 valide.");
            }
        }

        await _userRepository.AddUserAsync(newUser);

        return newUser;
    }

    public async Task UpdateUserAsync(UserUpdateDTO user)
    {
        if (user.Id_User == null)
        {
            throw new ArgumentException("L'ID de l'utilisateur est requis pour la mise à jour.");
        }

        var existingUser = await _userRepository.GetByIdAsync(user.Id_User);
        if (existingUser == null)
        {
            throw new ArgumentException("L'utilisateur n'existe pas.");
        }

        existingUser.Username = user.Username;
        existingUser.Avatar = !string.IsNullOrEmpty(user.Avatar) ? Convert.FromBase64String(user.Avatar) : null;
        existingUser.Id_Rank = user.Id_Rank;
        existingUser.Id_Roles = user.Id_Role;
        existingUser.Updated_At = DateTime.UtcNow;

        await _userRepository.UpdateUserAsync(existingUser);
    }

    public async Task DeleteUserAsync(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            throw new ArgumentException("L'ID de l'utilisateur est requis pour la suppression.");
        }

        await DeleteConnectionBlindBlind(id);
        await _userRepository.DeleteUserAsync(id);
    }

    public async Task CreateConnectionBlindBlind(ConnectionBlindBlindCreateDTO connectionBlindDTO)
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

    public Task UpdateConnectionBlindBlind(ConnectionBlindBlindCreateDTO connectionBlindBlind)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteConnectionBlindBlind(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            throw new ArgumentException("L'ID de l'utilisateur est requis pour la suppression.");
        }

        await _userRepository.DeleteConnectionBlindBlindAsync(id);
    }
}

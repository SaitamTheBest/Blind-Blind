using System.ComponentModel.DataAnnotations;

namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class UserDTO
    {
        public string? Id_User { get; set; }
        public string Username { get; set; }
        public string? Avatar { get; set; }
        public int Elo { get; set; }
        public RankDTO? Rank { get; set; }
        public RolesDTO? Roles { get; set; }
        public DateTime Created_At { get; set; }
        public DateTime? Updated_At { get; set; }
        public DateTime? Last_Login { get; set; }
    }

    public class UserCreateDTO
    {
        public string? Id_User { get; set; }

        [Required(ErrorMessage = "Le nom d'utilisateur est requis.")]
        public string Username { get; set; }
        public string? Avatar { get; set; }
    }

    public class UserUpdateDTO
    {
        public string? Id_User { get; set; }
        public string Username { get; set; }
        public string? Avatar { get; set; }
        public int Id_Rank { get; set; } = 1;
        public int Id_Role { get; set; } = 1;
        public int Elo { get; set; } = 0;
    }
}

using System.ComponentModel.DataAnnotations;

namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class ConnectionBlindBlindCreateDTO
    {
        public string? Id_User { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "L'adresse mail est requis.")]
        public string Email { get; set; }

        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$", ErrorMessage = "Le mot de passe de respecte pas les conditions.")]
        [Required(ErrorMessage = "Le mot de passe est requis.")]
        public string Password { get; set; }
        public UserCreateDTO User { get; set; }
    }
}

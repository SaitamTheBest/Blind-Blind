using System.ComponentModel.DataAnnotations;

namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class AuthDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class LoginDTO
    {
        [EmailAddress]
        [Required(ErrorMessage = "L'adresse mail est requis.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        public string Password { get; set; }
        public bool RememberMe { get; set; } = false;
    }

    public class RefreshTokenDTO
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}

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

    public class ForgotPasswordDTO
    {
        [EmailAddress(ErrorMessage = "Veuillez fournir une adresse email valide.")]
        [Required(ErrorMessage = "L'adresse email est requise.")]
        public string Email { get; set; }
    }

    public class ResetPasswordDTO
    {
        [Required(ErrorMessage = "Le token est requis.")]
        public string Token { get; set; }

        [Required(ErrorMessage = "Le nouveau mot de passe est requis.")]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        public string NewPassword { get; set; }
    }
}

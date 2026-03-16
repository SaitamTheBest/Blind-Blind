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
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; } = false;
    }

    public class RefreshTokenDTO
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}

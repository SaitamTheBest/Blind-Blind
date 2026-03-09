namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class AuthDTO
    {
        public string Token { get; set; }
    }

    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

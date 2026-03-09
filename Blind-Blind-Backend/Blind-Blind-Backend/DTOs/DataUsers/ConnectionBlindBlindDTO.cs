namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class ConnectionBlindBlindCreateDTO
    {
        public string? Id_User { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserCreateDTO User { get; set; }
    }
}

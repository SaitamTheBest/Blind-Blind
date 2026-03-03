namespace Blind_Blind_Backend.DTOs.DataUsers
{
    public class UserDTO
    {
        public string Id_User { get; set; }
        public string Username { get; set; }
        public int Elo { get; set; }
        public RankDTO Rank { get; set; }
        public RolesDTO Roles { get; set; }
    }
}

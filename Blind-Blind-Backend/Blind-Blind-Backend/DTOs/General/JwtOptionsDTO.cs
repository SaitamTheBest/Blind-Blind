namespace Blind_Blind_Backend.DTOs.General
{
    public class JwtOptionsDTO
    {
        public string Key { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
    }
}

namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class MusicSuggestionCreateDTO
    {
        public string Title { get; set; } = null!;
        public string Artist_Name { get; set; } = null!;
        public string? Album_Name { get; set; }
        public string? Message { get; set; }
    }

    public class MusicSuggestionDTO
    {
        public int Id_Suggestion { get; set; }
        public string Title { get; set; } = null!;
        public string Artist_Name { get; set; } = null!;
        public string? Album_Name { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = null!;
        public DateTime Created_At { get; set; }
    }

    public class MusicSuggestionAdminDTO
    {
        public int Id_Suggestion { get; set; }
        public string Title { get; set; } = null!;
        public string Artist_Name { get; set; } = null!;
        public string? Album_Name { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = null!;
        public DateTime Created_At { get; set; }
        public string ProposedBy { get; set; } = null!;
    }
}
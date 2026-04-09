namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class LyricsDTO
    {
        public string Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public string Id_Tracks { get; set; }
    }

    public class LyricsCreateDTO
    {
        public string Lyric { get; set; }
        public string Id_Tracks { get; set; }
    }

    public class LyricsUpdateDTO
    {
        public string Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public string Id_Tracks { get; set; }
    }

    public class LyricsCrudDTO
    {
        public string? Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public string Id_Tracks { get; set; }
    }
}

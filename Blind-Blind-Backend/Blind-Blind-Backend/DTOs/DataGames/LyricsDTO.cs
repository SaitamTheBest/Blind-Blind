namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class LyricsDTO
    {
        public Guid Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public Guid Id_Tracks { get; set; }
    }

    public class LyricsCreateDTO
    {
        public string Lyric { get; set; }
        public Guid Id_Tracks { get; set; }
    }

    public class LyricsUpdateDTO
    {
        public Guid Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public Guid Id_Tracks { get; set; }
    }

    public class LyricsCrudDTO
    {
        public Guid? Id_Lyrics { get; set; }
        public string Lyric { get; set; }
        public Guid Id_Tracks { get; set; }
    }
}

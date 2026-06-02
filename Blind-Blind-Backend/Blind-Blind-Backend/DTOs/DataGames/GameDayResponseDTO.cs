namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class GameDayResponseDTO
    {
        public int Id_Games_Day { get; set; }
        public GameResponseDTO Game { get; set; }

        public TrackResponseDTO Track { get; set; }

        public ArtistResponseDTO Artist { get; set; }

        public AlbumResponseDTO Album { get; set; }

        public LyricsResponseDTO Lyrics { get; set; }

        public int Found { get; set; }
    }
}

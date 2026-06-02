namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class TrackResponseDTO
    {
        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public bool Feat { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public GenreDTO Genre { get; set; }

        public AlbumResponseDTO Album { get; set; }

        public ArtistResponseDTO Artist { get; set; }
    }
}

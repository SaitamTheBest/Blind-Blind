namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class AlbumDTO
    {
        public string Id_Album { get; set; }

        public ArtistDTO Artist { get; set; }

        public List<TrackDTO> Tracks { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Nb_Stream { get; set; }

        public string Image_Album { get; set; }

        public bool Is_Single { get; set; }
    }
}
using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class TrackDTO
    {
        public string Id_Track { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public bool Feat { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public GenreDTO Genre { get; set; }

        public AlbumDTO Album { get; set; }

        public ArtistDTO Artist { get; set; }

        public List<ArtistDTO> Featurings { get; set; }
    }

    public class TrackCreateDTO
    {
        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public int Id_Genre { get; set; }

        public string Id_Album { get; set; }

        public string? Id_Artists { get; set; }

        public List<string>? List_Id_Featurings { get; set; }
    }

    public class TrackUpdateDTO
    {
        public string Id_Tracks { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public int Id_Genre { get; set; }

        public string Id_Album { get; set; }

        public string? Id_Artists { get; set; }

        public List<string>? List_Id_Featurings { get; set; }
    }

    public class TrackCrudDTO
    {
        public string? Id_Tracks { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public int Id_Genre { get; set; }

        public string Id_Album { get; set; }

        public string? Id_Artists { get; set; }

        public List<string>? List_Id_Featurings { get; set; }
    }
}

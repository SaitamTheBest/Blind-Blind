using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class TrackDTO
    {
        public Guid Id_Track { get; set; }

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

        public Guid Id_Album { get; set; }

        public Guid? Id_Artists { get; set; }

        public List<Guid>? List_Id_Featurings { get; set; }
    }

    public class TrackUpdateDTO
    {
        public Guid Id_Tracks { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public int Id_Genre { get; set; }

        public Guid Id_Album { get; set; }

        public Guid? Id_Artists { get; set; }

        public List<Guid>? List_Id_Featurings { get; set; }
    }

    public class TrackCrudDTO
    {
        public Guid? Id_Tracks { get; set; }

        public string Name { get; set; }

        public int Release_Year { get; set; }

        public int Popularity { get; set; }

        public string? Time { get; set; }

        public string Url_Source { get; set; }

        public int Id_Genre { get; set; }

        public Guid Id_Album { get; set; }

        public Guid? Id_Artists { get; set; }

        public List<Guid>? List_Id_Featurings { get; set; }
    }
}

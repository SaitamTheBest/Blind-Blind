using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class ArtistDTO
    {
        public string Id_Artists { get; set; }

        public string Name { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime Last_Release { get; set; }

        public Type_ArtistsDTO Type_Artists { get; set; }

        public string Nationality { get; set; }

        public int Nb_Followers { get; set; }

        public string Image_Artists { get; set; }
    }

    public class ArtistCreateDTO
    {
        public string Name { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime Last_Release { get; set; }

        public int Id_Type_Artists { get; set; }

        public string Nationality { get; set; }

        public int Nb_Followers { get; set; }

        public string Image_Artists { get; set; }
    }

    public class ArtistUpdateDTO
    {
        public string Id_Artists { get; set; }

        public string Name { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime Last_Release { get; set; }

        public int Id_Type_Artists { get; set; }

        public string Nationality { get; set; }

        public int Nb_Followers { get; set; }

        public string Image_Artists { get; set; }
    }

    public class ArtistCrudDTO
    {
        public string? Id_Artists { get; set; }

        public string Name { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime Last_Release { get; set; }

        public int Id_Type_Artists { get; set; }

        public string Nationality { get; set; }

        public int Nb_Followers { get; set; }

        public string Image_Artists { get; set; }
    }
}
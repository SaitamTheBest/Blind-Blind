namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class ArtistResponseDTO
    {
        public string Name { get; set; }

        public DateTime Start_Date { get; set; }

        public DateTime Last_Release { get; set; }

        public Type_ArtistsDTO Type_Artists { get; set; }

        public string Nationality { get; set; }

        public int Nb_Followers { get; set; }

        public string Image_Artists { get; set; }
    }
}

namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class GameDTO
    {
        public int Id_Game { get; set; }

        public string Name { get; set; }

        public string Image_Game { get; set; }

        public string Description { get; set; }
    }
    public class GameCreateDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile? Image_Game { get; set; }
    }

    public class GameUpdateDTO
    {
        public string Id_Game { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile? Image_Game { get; set; }
    }
}

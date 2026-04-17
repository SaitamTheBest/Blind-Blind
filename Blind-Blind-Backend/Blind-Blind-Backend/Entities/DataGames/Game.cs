using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("game", Schema = "blindblindv1_dataGames")]
    public class Game
    {
        [Key]
        [Column("id_game")]
        public int Id_Game { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("image_game")]
        public string Image_Game { get; set; }

        [Column("description")] 
        public string Description { get; set; }
    }
}

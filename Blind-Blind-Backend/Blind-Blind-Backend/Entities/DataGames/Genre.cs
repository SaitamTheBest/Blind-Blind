using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("genre", Schema = "blindblindv1_datagames")]
    public class Genre
    {
        [Key]
        [Column("id_genre")] 
        public int Id_Genre { get; set; } 

        [Column("genre")]
        public string Libelle { get; set; }
    }
}

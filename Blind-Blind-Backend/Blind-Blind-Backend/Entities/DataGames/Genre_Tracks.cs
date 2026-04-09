using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("genre_tracks", Schema = "blindblindv1_datagames")]
    public class Genre_Tracks
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_genre_tracks")] 
        public int Id_Genre_Tracks { get; set; } 

        [Column("genre")]
        public string Libelle { get; set; }
    }
}

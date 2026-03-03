using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("album", Schema = "blindblindv1_datagames")]
    public class Album
    {
        [Key]
        [Column("id_album")] 
        public string Id_Album { get; set; }

        [Column("id_artist")]
        public string Id_Artist { get; set; }

        [ForeignKey(nameof(Id_Artist))]
        public Artists Artists { get; set; }

        [Column("name")] 
        public string Name { get; set; } 

        [Column("release_year")] 
        public int Release_Year { get; set; } 
        
        [Column("nb_stream")] 
        public int Nb_Stream { get; set; } 

        [Column("image_album")] 
        public string Image_Album { get; set; }

        [Column("is_single")]
        public bool Is_Single { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("album", Schema = "blindblindv1_dataGames")]
    public class Album
    {
        [Key]
        [Column("id_album")] 
        public Guid Id_Album { get; set; }

        [Column("id_artists")]
        public Guid Id_Artists { get; set; }

        [Column("name")] 
        public string Name { get; set; } 

        [Column("release_year")] 
        public int Release_Year { get; set; } 
        
        [Column("nb_stream")] 
        public int Nb_Stream { get; set; } 

        [Column("image_album")] 
        public byte[]? Image_Album { get; set; }

        [Column("is_single")]
        public bool Is_Single { get; set; }

        [ForeignKey(nameof(Id_Artists))]
        public virtual Artists Artists { get; set; }
    }
}

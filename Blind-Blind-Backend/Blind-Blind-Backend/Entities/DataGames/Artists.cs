using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("artists", Schema = "blindblindv1_datagames")]
    public class Artists
    {
        [Key]
        [Column("id_artist")]
        public string Id_Artist { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("start_date")]
        public DateTime Start_Date { get; set; }

        [Column("last_release")]
        public DateTime Last_Release { get; set; }

        [ForeignKey("id_type_artists")]
        public Type_Artists Type_Artists { get; set; }

        [Column("nationality")]
        public string Nationality { get; set; }

        [Column("nb_followers")]
        public int Nb_Followers { get; set; }

        [Column("image_artists")]
        public string Image_Artists { get; set; }
    }
}

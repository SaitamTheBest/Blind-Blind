using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("artists", Schema = "blindblindv1_dataGames")]
    public class Artists
    {
        [Key]
        [Column("id_artists")]
        public string Id_Artists { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("start_date")]
        public DateTime Start_Date { get; set; }

        [Column("last_release")]
        public DateTime Last_Release { get; set; }

        [Column("nationality")]
        public string Nationality { get; set; }

        [Column("nb_followers")]
        public int Nb_Followers { get; set; }

        [Column("image_artists")]
        public byte[]? Image_Artists { get; set; }

        [Column("id_type_artists")]
        public int Id_Type_Artists { get; set; }

        [ForeignKey(nameof(Id_Type_Artists))]
        public virtual Type_Artists Type_Artists { get; set; }

        public virtual ICollection<Featurings> Featurings { get; set; } = new List<Featurings>();
    }
}

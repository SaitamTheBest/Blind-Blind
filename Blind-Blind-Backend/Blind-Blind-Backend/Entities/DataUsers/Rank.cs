using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("rank", Schema = "blindblindv1_datausers")]
    public class Rank
    {
        [Key]
        [Column("id_rank")]
        public int Id_Rank { get; set; }

        [Column("start_elo")]
        public int Start_Elo { get; set; }

        [Column("end_elo")]
        public int End_Elo { get; set; }

        [Column("rank_name")]
        public string Rank_Name { get; set; }

        [Column("image_rank")]
        public string Image_Rank { get; set; }
    }
}

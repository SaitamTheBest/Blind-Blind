using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataAdmin
{
    [Table("announcement_type", Schema = "blindblindv1_dataAdmin")]
    public class Announcement_Type
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_announcement_type")]
        public int Id_Announcement_Type { get; set; }

        [Column("label")]
        [Required]
        public string Label { get; set; }

        [Column("is_important")]
        public bool Is_Important { get; set; } = false;
    }
}

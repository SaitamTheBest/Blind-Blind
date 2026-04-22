using Blind_Blind_Backend.Entities.DataUsers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataAdmin
{
    [Table("announcement", Schema = "blindblindv1_dataAdmin")]
    public class Announcement
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_announcement")]
        public int Id_Announcement { get; set; }

        [Column("title")]
        [Required]
        public string Title { get; set; }

        [Column("short_description")]
        public string Short_Description { get; set; }

        [Column("cover_image")]
        public byte[]? Cover_Image { get; set; }

        [Column("content")]
        [Required]
        public string Content { get; set; }

        [Column("publication_date")]
        public DateTime? Publication_Date { get; set; }

        [Column("created_at")]
        [Required]
        public DateTime Created_At { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? Updated_At { get; set; }

        [Column("id_announcement_type")]
        [Required]
        public int Id_Announcement_Type { get; set; }

        [Column("id_author")]
        [Required]
        public string Id_Author { get; set; }

        [Column("is_published")]
        public bool Is_Published { get; set; } = false;

        [Column("slug")]
        public string Slug { get; set; }

        [ForeignKey(nameof(Id_Announcement_Type))]
        public virtual Announcement_Type Announcement_Type { get; set; }

        [ForeignKey(nameof(Id_Author))]
        public virtual User Author { get; set; }
    }
}

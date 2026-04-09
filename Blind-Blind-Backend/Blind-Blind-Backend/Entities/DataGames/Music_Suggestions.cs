using Blind_Blind_Backend.Entities.DataUsers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("music_suggestions", Schema = "blindblindv1_datagames")]
    public class Music_Suggestions
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_suggestion")]
        public int Id_Suggestion { get; set; }

        [Required]
        [Column("id_user")]
        public string Id_User { get; set; } = null!;

        [Required]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Required]
        [Column("artist_name")]
        public string Artist_Name { get; set; } = null!;

        [Column("album_name")]
        public string? Album_Name { get; set; }

        [Column("release_date", TypeName = "timestamp without time zone")]
        public DateTime? Release_Date { get; set; }

        [Column("message")]
        public string? Message { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; } = null!;

        [Column("admin_comment")]
        public string? Admin_Comment { get; set; }

        [Column("reviewed_by")]
        public string? Reviewed_By { get; set; }

        [Column("reviewed_at", TypeName = "timestamp without time zone")]
        public DateTime? Reviewed_At { get; set; }

        [Column("created_track_id")]
        public string? Created_Track_Id { get; set; }

        [Column("created_at", TypeName = "timestamp without time zone")]
        public DateTime Created_At { get; set; }

        [Column("updated_at", TypeName = "timestamp without time zone")]
        public DateTime Updated_At { get; set; }

        [ForeignKey(nameof(Id_User))]
        public User User { get; set; } = null!;

        [ForeignKey(nameof(Reviewed_By))]
        public User? Admin { get; set; }

        [ForeignKey(nameof(Created_Track_Id))]
        public Tracks? Created_Track { get; set; }
    }
}
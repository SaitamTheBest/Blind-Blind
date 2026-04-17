using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("refresh_tokens", Schema = "blindblindv1_dataUsers")]
    public class RefreshToken
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("token")]
        public string Token { get; set; }

        [Column("id_user")]
        public string Id_User { get; set; }

        [Column("expiration_date")]
        public DateTimeOffset ExpirationDate { get; set; }

        [Column("is_revoked")]
        public bool IsRevoked { get; set; } = false;

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [ForeignKey(nameof(Id_User))]
        public virtual User User { get; set; }
    }
}

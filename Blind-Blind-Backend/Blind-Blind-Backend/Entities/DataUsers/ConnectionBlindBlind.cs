using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("connection_blind_blind", Schema = "blindblindv1_dataUsers")]
    public class ConnectionBlindBlind
    {
        [Key]
        [Column("id_user")]
        public string Id_User { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [ForeignKey(nameof(Id_User))]
        public virtual User User { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("users", Schema = "blindblindv1_datausers")]
    public class User
    {
        [Key]
        [Column("id_user")]
        public string Id_User { get; set; }

        [Column("user_name")]
        public string Username { get; set; } = null!;

        [Column("id_roles")]
        public int Id_Roles { get; set; } = 1;

        [Column("avatar")]
        public byte[]? Avatar { get; set; }

        [Column("elo")]
        public int Elo { get; set; } = 0;

        [Column("id_rank")]
        public int Id_Rank { get; set; } = 1;

        [ForeignKey(nameof(Id_Roles))]
        public virtual Roles Roles { get; set; }

        [ForeignKey(nameof(Id_Rank))]
        public virtual Rank Rank { get; set; }
    }

}

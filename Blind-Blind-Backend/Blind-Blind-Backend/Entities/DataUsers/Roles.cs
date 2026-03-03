using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("roles", Schema = "blindblindv1_datausers")]
    public class Roles
    {
        [Key]
        [Column("id_role")]
        public int Id_Role { get; set; }

        [Column("role_name")]
        public string Role_Name { get; set; }
    }
}

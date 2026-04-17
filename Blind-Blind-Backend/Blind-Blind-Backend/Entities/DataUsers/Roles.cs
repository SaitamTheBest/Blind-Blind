using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataUsers
{
    [Table("roles", Schema = "blindblindv1_dataUsers")]
    public class Roles
    {
        [Key]
        [Column("id_roles")]
        public int Id_Roles { get; set; }

        [Column("role_name")]
        public string Role_Name { get; set; }
    }
}

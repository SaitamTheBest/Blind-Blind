using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("type_artists", Schema = "blindblindv1_datagames")]
    public class Type_Artists
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_type_artists")]
        public int Id_Type_Artists { get; set; }

        [Column("type")]
        public string Type { get; set; }
    }
}

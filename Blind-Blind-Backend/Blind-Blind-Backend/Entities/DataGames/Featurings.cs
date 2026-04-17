using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("featurings", Schema = "blindblindv1_dataGames")]
    public class Featurings
    {
        [Column("id_tracks")]
        public string Id_Tracks { get; set; }

        [Column("id_artists")]
        public string Id_Artists { get; set; }

        [ForeignKey(nameof(Id_Tracks))]
        public virtual Tracks Tracks { get; set; }

        [ForeignKey(nameof(Id_Artists))]
        public virtual Artists Artists { get; set; }
    }
}

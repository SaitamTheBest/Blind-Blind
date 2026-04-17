using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("tracks", Schema = "blindblindv1_dataGames")]
    public class Tracks
    {
        [Key]
        [Column("id_tracks")] 
        public string Id_Tracks { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("id_album")]
        public string Id_Album { get; set; }

        [Column("release_year")] 
        public int Release_Year { get; set; }

        [Column("popularity")] 
        public int Popularity { get; set; }

        [Column("feat")]
        public bool Feat { get; set; }

        [Column("time")]
        public DateTime Time { get; set; }

        [Column("url_source")]
        public string Url_Source { get; set; }

        [Column("id_genre")]
        public int Id_Genre { get; set; }

        [ForeignKey(nameof(Id_Genre))]
        public virtual Genre_Tracks Genre { get; set; }

        [ForeignKey(nameof(Id_Album))]
        public virtual Album Album { get; set; }

        public virtual ICollection<Featurings> Featurings { get; set; } = new List<Featurings>();
    }
}

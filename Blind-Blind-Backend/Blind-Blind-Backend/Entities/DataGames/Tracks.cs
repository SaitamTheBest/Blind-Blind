using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("tracks", Schema = "blindblindv1_datagames")]
    public class Tracks
    {
        [Key]
        [Column("id_tracks")] 
        public string Id_Tracks { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("id_album")]
        public string Id_Album { get; set; }

        [ForeignKey(nameof(Id_Album))] 
        public Album Album { get; set; }

        [Column("release_year")] 
        public int Release_Year { get; set; }
        
        [Column("nb_stream")] 
        public int Nb_Stream { get; set; }

        [Column("feat")]
        public bool Feat { get; set; }

        [Column("time")]
        public DateTime Time { get; set; }

        [Column("url_source")]
        public string Url_Source { get; set; }

        [Column("id_genre")]
        public int Id_Genre { get; set; }

        [ForeignKey(nameof(Id_Genre))]
        public Genre Genre { get; set; }
    }
}

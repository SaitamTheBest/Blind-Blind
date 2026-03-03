using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames
{
    [Table("lyrics", Schema = "blindblindv1_datagames")]
    public class Lyrics
    {
        [Key]
        [Column("id_lyrics")] 
        public string Id_Lyrics { get; set; }

        [Column("lyrics")] 
        public string Lyric { get; set; }

        [Column("id_tracks")]
        public string Id_Tracks { get; set; }

        [ForeignKey(nameof(Id_Tracks))] 
        public Tracks Tracks { get; set; }
    }
}

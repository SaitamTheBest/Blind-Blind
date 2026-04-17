using Blind_Blind_Backend.Entities.DataGames;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Blind_Blind_Backend.Entities.DataGames {
    [Table("games_day", Schema = "blindblindv1_dataGames")]
    public class Games_Day
    {
        [Key]
        [Column("id_games_day")]
        public string Id_Games_Day { get; set; }

        [Column("id_tracks")]
        public string Id_Tracks { get; set; }

        [Column("id_lyrics")]
        public string Id_Lyrics { get; set; }

        [Column("id_album")]
        public string Id_Album { get; set; }

        [Column("id_artist")]
        public string Id_Artists { get; set; }

        [Column("date_games")]
        public DateTime Date_Games { get; set; }

        [Column("found")]
        public int Found { get; set; }

        [ForeignKey(nameof(Id_Tracks))]
        public virtual Tracks Tracks { get; set; }

        [ForeignKey(nameof(Id_Lyrics))]
        public virtual Lyrics Lyrics { get; set; }

        [ForeignKey(nameof(Id_Album))]
        public virtual Album Album { get; set; }

        [ForeignKey(nameof(Id_Artists))]
        public virtual Artists Artist { get; set; }
    }
}
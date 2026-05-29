namespace Blind_Blind_Backend.DTOs.DataGames
{
    public class VerificationResultDTO
    {
        public bool IsCorrect { get; set; }
        public string Status { get; set; } // "correct", "incorrect", "partial"
    }

    public class TrackVerificationDTO
    {
        public VerificationResultDTO Name { get; set; }
        public VerificationResultDTO Artists { get; set; }
        public VerificationResultDTO Nationality { get; set; }
        public VerificationResultDTO Genres { get; set; }
        public VerificationResultDTO Album { get; set; }
        public VerificationResultDTO Followers { get; set; }
        public VerificationResultDTO Popularity { get; set; }
        public VerificationResultDTO Release_Date { get; set; }
    }

    public class ArtistVerificationDTO
    {
        public VerificationResultDTO Name { get; set; }
        public VerificationResultDTO Nationality { get; set; }
        public VerificationResultDTO Followers { get; set; }
        public VerificationResultDTO Start_Date { get; set; }
        public VerificationResultDTO Last_Release { get; set; }
    }

    public class AlbumVerificationDTO
    {
        public VerificationResultDTO Name { get; set; }
        public VerificationResultDTO Artist { get; set; }
        public VerificationResultDTO Release_Year { get; set; }
        public VerificationResultDTO Nb_Stream { get; set; }
    }

    public class LyricsVerificationDTO
    {
        public VerificationResultDTO Lyric { get; set; }
        public VerificationResultDTO Track { get; set; }
    }
}

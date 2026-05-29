using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IGamesService
    {
        Task<List<TrackDTO>> GetAllTracks();
        Task<List<ArtistDTO>> GetAllArtists();
        Task<List<AlbumDTO>> GetAllAlbums();
        Task<TrackDTO?> GetTrackById(string id);
        Task<ArtistDTO?> GetArtistById(string id);
        Task<AlbumDTO?> GetAlbumById(string id);
        Task<List<GameDTO>> GetAllGames();
        Task<GameDTO?> GetGameById(int id);
        Task<TrackVerificationDTO> VerifyTrack(string trackId, TrackDTO submittedTrack);
        Task<ArtistVerificationDTO> VerifyArtist(string artistId, ArtistDTO submittedArtist);
        Task<AlbumVerificationDTO> VerifyAlbum(string albumId, AlbumDTO submittedAlbum);
        Task<LyricsVerificationDTO> VerifyLyrics(string lyricsId, LyricsDTO submittedLyrics);
        Task<bool> IncrementGameDayFoundAsync(int gameDayId);
    }
}

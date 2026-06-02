using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IGamesService
    {
        Task<List<TrackDTO>> GetAllTracks();
        Task<List<ArtistDTO>> GetAllArtists();
        Task<List<AlbumDTO>> GetAllAlbums();
        Task<TrackDTO?> GetTrackById(Guid id);
        Task<ArtistDTO?> GetArtistById(Guid id);
        Task<AlbumDTO?> GetAlbumById(Guid id);
        Task<List<GameDTO>> GetAllGames();
        Task<GameDTO?> GetGameById(int id);
        Task<TrackResponseDTO?> GetTrackResponseById(Guid id);
        Task<ArtistResponseDTO?> GetArtistResponseById(Guid id);
        Task<AlbumResponseDTO?> GetAlbumResponseById(Guid id);
        Task<GameResponseDTO?> GetGameResponseById(int id);
        Task<GameDayResponseDTO?> GetGameDayResponseById(int gameDayId);
        Task<GameDayResponseDTO?> GetGameDayResponseByGameId(int gameId);
        Task<TrackVerificationDTO> VerifyTrack(Guid trackId, TrackDTO submittedTrack);
        Task<ArtistVerificationDTO> VerifyArtist(Guid artistId, ArtistDTO submittedArtist);
        Task<AlbumVerificationDTO> VerifyAlbum(Guid albumId, AlbumDTO submittedAlbum);
        Task<LyricsVerificationDTO> VerifyLyrics(Guid lyricsId, LyricsDTO submittedLyrics);
        Task<bool> IncrementGameDayFoundAsync(int gameDayId);
    }
}

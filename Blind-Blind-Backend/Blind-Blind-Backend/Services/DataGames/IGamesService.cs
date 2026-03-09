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
    }
}

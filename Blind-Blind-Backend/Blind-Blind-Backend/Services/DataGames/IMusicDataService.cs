using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IMusicDataService
    {
        #region CREATE
        Task CreateTrack(TrackCrudDTO trackCrudDTO);
        Task CreateAlbum(AlbumCrudDTO albumCrudDTO);
        Task CreateArtist(ArtistCrudDTO artistCrudDTO);
        Task AddFeaturingsToTrack(string trackId, List<string> artistIds);
        #endregion

        #region UPDATE
        Task UpdateTrack(TrackCrudDTO trackCrudDTO);
        Task UpdateAlbum(AlbumCrudDTO albumCrudDTO);
        Task UpdateArtist(ArtistCrudDTO artistCrudDTO);
        Task UpdateFeaturingsForTrack(string trackId, List<string> artistIds);
        #endregion

        #region DELETE
        Task DeleteTrack(string id);
        Task DeleteAlbum(string id);
        Task DeleteArtist(string id);
        #endregion
    }
}

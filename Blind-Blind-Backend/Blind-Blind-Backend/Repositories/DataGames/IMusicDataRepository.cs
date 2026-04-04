using Blind_Blind_Backend.Entities.DataGames;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IMusicDataRepository
    {
        #region CREATE
        Task CreateTrack(Tracks track);
        Task CreateAlbum(Album album);
        Task CreateArtist(Artists artist);
        Task AddFeaturings(IEnumerable<Featurings> featurings);
        #endregion
    
        #region UPDATE
        Task UpdateTrack(Tracks track);
        Task UpdateAlbum(Album album);
        Task UpdateArtist(Artists artist);
        #endregion
    
        #region DELETE
        Task DeleteTrack(string id);
        Task DeleteAlbum(string id);
        Task DeleteArtist(string id);
        Task DeleteFeaturingsByTrackAsync(string id_track);
        #endregion
    }
}

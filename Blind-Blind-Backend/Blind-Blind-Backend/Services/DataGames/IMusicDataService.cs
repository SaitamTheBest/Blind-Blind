using Blind_Blind_Backend.DTOs.DataGames;

namespace Blind_Blind_Backend.Services.DataGames
{
    public interface IMusicDataService
    {
        #region CREATE
        Task CreateTrack(TrackDTO trackDTO);
        Task CreateAlbum(AlbumDTO albumDTO);
        Task CreateArtist(ArtistDTO artistDTO);
        #endregion

        #region UPDATE
        Task UpdateTrack(TrackDTO trackDTO);
        Task UpdateAlbum(AlbumDTO albumDTO);
        Task UpdateArtist(ArtistDTO artistDTO);
        #endregion

        #region DELETE
        Task DeleteTrack(string id);
        Task DeleteAlbum(string id);
        Task DeleteArtist(string id);
        #endregion
    }
}

using Blind_Blind_Backend.Entities.DataGames;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IGamesRepository
    {
        Task<List<Tracks>> GetAllTracks();
        Task<List<Artists>> GetAllArtists();
        Task<List<Album>> GetAllAlbum();

        Task<Tracks?> GetTrackById(string id);
        Task<Artists?> GetArtistById(string id);
        Task<Album?> GetAlbumById(string id);

        #region Game of the day

        Task<Games_Day> GetGameDay(DateTime date, string id_game);

        #endregion

    }
}

using Blind_Blind_Backend.Entities.DataGames;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Blind_Blind_Backend.Repositories.DataGames
{
    public interface IGamesRepository
    {
        Task<List<Tracks>> GetAllTracks();
        Task<List<Artists>> GetAllArtists();
        Task<List<Album>> GetAllAlbum();

        Task<Tracks?> GetTrackById(Guid id);
        Task<Artists?> GetArtistById(Guid id);
        Task<Album?> GetAlbumById(Guid id);
        Task<Lyrics?> GetLyricsById(Guid id);

        #region Game of the day

        Task<Games_Day> GetGameDayByIdGame(DateTime date, int id_game);
        Task<Games_Day?> GetLatestGameDayByGameId(int id_game);
        Task<List<Game>> GetAllGames();
        Task<Game?> GetGameById(int id);
        Task<Games_Day?> GetGameDayById(int gameDayId);
        Task<bool> UpdateGameDayFoundAsync(int gameDayId, int increment);

        #endregion

    }
}

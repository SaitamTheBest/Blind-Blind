using Blind_Blind_Backend.DTOs.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;

namespace Blind_Blind_Backend.Services.DataGames.Method
{
    public class StatsService : IStatsService
    {
        private readonly IStatsRepository _repository;

        public StatsService(IStatsRepository repository)
        {
            _repository = repository;
        }

        public async Task<MusicDataStatsDTO> GetStatsAsync()
        {
            var totalAlbums = await _repository.GetTotalAlbumsAsync();
            var totalArtists = await _repository.GetTotalArtistsAsync();
            var totalTracks = await _repository.GetTotalTracksAsync();
            var totalGamesDay = await _repository.GetTotalGamesDayAsync();

            return new MusicDataStatsDTO
            {
                Total_Albums = totalAlbums,
                Total_Artists = totalArtists,
                Total_Tracks = totalTracks,
                Total_Games_Day = totalGamesDay,
                Generated_At = DateTime.UtcNow
            };
        }
    }
}

using Blind_Blind_Backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataGames.Methods
{
    public class StatsRepository : IStatsRepository
    {
        private readonly BlindBlindContext _context;

        public StatsRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalAlbumsAsync()
        {
            return await _context.Album.CountAsync();
        }

        public async Task<int> GetTotalArtistsAsync()
        {
            return await _context.Artists.CountAsync();
        }

        public async Task<int> GetTotalTracksAsync()
        {
            return await _context.Tracks.CountAsync();
        }

        public async Task<int> GetTotalGamesDayAsync()
        {
            return await _context.Games_Day.CountAsync();
        }
    }
}

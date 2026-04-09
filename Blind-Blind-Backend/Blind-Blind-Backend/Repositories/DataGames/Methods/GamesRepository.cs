using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataGames;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataGames.Methods
{
    public class GamesRepository : IGamesRepository
    {
        private readonly BlindBlindContext _context;

        public GamesRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<Album?> GetAlbumById(string id)
        {
            return await _context.Album
                .Include(a => a.Artists)
                    .ThenInclude(a => a.Type_Artists)
                .FirstOrDefaultAsync(album => album.Id_Album == id);
        }

        public Task<List<Album>> GetAllAlbum()
        {
            return _context.Album
                .Include(a => a.Artists)
                    .ThenInclude(a => a.Type_Artists)
                .ToListAsync();
        }

        public Task<List<Artists>> GetAllArtists()
        {
            return _context.Artists
                .Include(a => a.Type_Artists)
                .ToListAsync();
        }

        public Task<List<Tracks>> GetAllTracks()
        {
            return _context.Tracks
                .Include(t => t.Genre)
                .Include(t => t.Album)
                    .ThenInclude(a => a.Artists)
                        .ThenInclude(a => a.Type_Artists)
                .ToListAsync();
        }

        public async Task<Artists?> GetArtistById(string id)
        {
            return await _context.Artists
                .Include(a => a.Type_Artists)
                .FirstOrDefaultAsync(artists => artists.Id_Artists == id);
        }

        public async Task<Games_Day> GetGameDay(DateTime date, string id_game)
        {
            if (string.IsNullOrEmpty(id_game))
            {
                throw new ArgumentNullException("Id_Game cannot be null.");
            }

            return await _context.Games_Day
                .FirstOrDefaultAsync(game_day => game_day.Date_Games == date && game_day.Id_Games_Day == id_game);
        }

        public async Task<Tracks?> GetTrackById(string id)
        {
            return await _context.Tracks
                .Include(t => t.Genre)
                .Include(t => t.Album)
                    .ThenInclude(a => a.Artists)
                        .ThenInclude(a => a.Type_Artists)
                .FirstOrDefaultAsync(tracks => tracks.Id_Tracks == id);
        }
    }
}

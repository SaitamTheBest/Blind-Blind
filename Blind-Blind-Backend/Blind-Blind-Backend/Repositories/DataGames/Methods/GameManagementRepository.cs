using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Repositories.DataGames;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories
{
    public class GameManagementRepository : IGameManagementRepository
    {
        private readonly BlindBlindContext _context;

        public GameManagementRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<List<Game>> GetAllAsync()
        {
            return await _context.Game
                .OrderBy(g => g.Id_Game)
                .ToListAsync();
        }

        public async Task<Game?> GetByIdAsync(int id)
        {
            return await _context.Game
                .FirstOrDefaultAsync(g => g.Id_Game == id);
        }

        public async Task<Game> CreateAsync(Game game)
        {
            _context.Game.Add(game);

            await _context.SaveChangesAsync();

            return game;
        }

        public async Task<Game?> UpdateAsync(Game game)
        {
            var existing = await _context.Game
                .FirstOrDefaultAsync(g => g.Id_Game == game.Id_Game);

            if (existing == null)
                return null;

            existing.Name = game.Name;
            existing.Image_Game = game.Image_Game;
            existing.Description = game.Description;

            await _context.SaveChangesAsync();

            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var game = await _context.Game
                .FirstOrDefaultAsync(g => g.Id_Game == id);

            if (game == null)
                return false;

            _context.Game.Remove(game);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataGames;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataGames.Methods
{
    public class MusicSuggestionsRepository : IMusicSuggestionsRepository
    {
        private readonly BlindBlindContext _context;

        public MusicSuggestionsRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<Music_Suggestions> CreateAsync(Music_Suggestions suggestion)
        {
            await _context.Music_Suggestions.AddAsync(suggestion);
            await _context.SaveChangesAsync();
            return suggestion;
        }

        public async Task<IEnumerable<Music_Suggestions>> GetAllAsync()
        {
            return await _context.Music_Suggestions
                .Include(s => s.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Music_Suggestions?> GetByIdAsync(int id)
        {
            return await _context.Music_Suggestions
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id_Suggestion == id);
        }

        public async Task UpdateAsync(Music_Suggestions suggestion)
        {
            var entry = _context.Entry(suggestion);
            if (entry.State == EntityState.Detached)
            {
                _context.Music_Suggestions.Attach(suggestion);
            }
            _context.Music_Suggestions.Update(suggestion);
            await _context.SaveChangesAsync();
        }
    }
}

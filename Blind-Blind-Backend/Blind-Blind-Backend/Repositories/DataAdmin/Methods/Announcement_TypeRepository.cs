using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataAdmin;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataAdmin
{
    public class Announcement_TypeRepository : IAnnouncement_TypeRepository
    {
        private readonly BlindBlindContext _context;

        public Announcement_TypeRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Announcement_Type>> GetAllAsync()
        {
            return await _context.Announcement_Type
                .AsNoTracking()
                .OrderBy(at => at.Label)
                .ToListAsync();
        }

        public async Task<Announcement_Type?> GetByIdAsync(int id)
        {
            return await _context.Announcement_Type
                .FirstOrDefaultAsync(at => at.Id_Announcement_Type == id);
        }

        public async Task AddAsync(Announcement_Type announcementType)
        {
            await _context.Announcement_Type.AddAsync(announcementType);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Announcement_Type announcementType)
        {
            _context.Announcement_Type.Update(announcementType);
            await _context.SaveChangesAsync();
        }
    }
}

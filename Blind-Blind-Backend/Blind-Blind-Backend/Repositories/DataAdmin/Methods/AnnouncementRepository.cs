using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataAdmin;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataAdmin
{
    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly BlindBlindContext _context;

        public AnnouncementRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Announcement>> GetAllAsync()
        {
            return await _context.Announcement
                .Include(a => a.Announcement_Type)
                .Include(a => a.Author)
                .AsNoTracking()
                .OrderByDescending(a => a.Created_At)
                .ToListAsync();
        }

        public async Task<Announcement?> GetByIdAsync(int id)
        {
            return await _context.Announcement
                .Include(a => a.Announcement_Type)
                .Include(a => a.Author)
                .FirstOrDefaultAsync(a => a.Id_Announcement == id);
        }

        public async Task AddAsync(Announcement announcement)
        {
            await _context.Announcement.AddAsync(announcement);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Announcement announcement)
        {
            announcement.Updated_At = DateTime.UtcNow;
            _context.Announcement.Update(announcement);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var announcement = await _context.Announcement.FindAsync(id);
            if (announcement != null)
            {
                _context.Announcement.Remove(announcement);
                await _context.SaveChangesAsync();
            }
        }
    }
}

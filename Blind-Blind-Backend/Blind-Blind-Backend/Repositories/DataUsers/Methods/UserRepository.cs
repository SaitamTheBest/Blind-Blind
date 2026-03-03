using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataUsers;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataUsers
{
    public class UserRepository : IUserRepository
    {
        private readonly BlindBlindContext _context;

        public UserRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id_User == id);
        }

        public async Task<IReadOnlyList<User>> GetAllAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}

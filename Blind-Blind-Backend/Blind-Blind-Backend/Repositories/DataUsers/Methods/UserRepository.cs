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
            return await _context.User
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id_User == id);
        }

        public async Task<IReadOnlyList<User>> GetAllAsync()
        {
            return await _context.User
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await _context.User.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task AddConnectionBlindBlindAsync(ConnectionBlindBlind connectionBlindBlind)
        {
            await _context.ConnectionBlindBlind.AddAsync(connectionBlindBlind);
            await _context.SaveChangesAsync();
        }
    }
}

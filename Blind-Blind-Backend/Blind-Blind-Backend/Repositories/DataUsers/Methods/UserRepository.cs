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
                .Include(u => u.Rank)
                .Include(u => u.Roles)
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

        public async Task UpdateUserAsync(User user)
        {
            _context.User.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(string id)
        {
            var user = await _context.User.FindAsync(id);
            if (user != null)
            {
                _context.User.Remove(user);
                await _context.SaveChangesAsync();
            }

        }
        public async Task AddConnectionBlindBlindAsync(ConnectionBlindBlind connectionBlindBlind)
        {
            await _context.ConnectionBlindBlind.AddAsync(connectionBlindBlind);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConnectionBlindBlindAsync(ConnectionBlindBlind connectionBlindBlind)
        {
            _context.ConnectionBlindBlind.Update(connectionBlindBlind);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConnectionBlindBlindAsync(string id)
        {
            var connection = await _context.ConnectionBlindBlind.FindAsync(id);
            if (connection != null)
            {
                _context.ConnectionBlindBlind.Remove(connection);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.User.CountAsync();
        }

        public async Task<int> GetTotalRanksAsync()
        {
            return await _context.Rank.CountAsync();
        }

        public async Task<int> GetTotalRolesAsync()
        {
            return await _context.Roles.CountAsync();
        }

        public async Task<int> GetTotalConnectionsAsync()
        {
            return await _context.ConnectionBlindBlind.CountAsync();
        }
    }
}

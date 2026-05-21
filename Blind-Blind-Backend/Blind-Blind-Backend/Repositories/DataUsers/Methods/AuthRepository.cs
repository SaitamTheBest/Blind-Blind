using Blind_Blind_Backend.Domain;
using Blind_Blind_Backend.Entities.DataUsers;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Repositories.DataUsers.Methods
{
    public class AuthRepository : IAuthRepository
    {
        private readonly BlindBlindContext _context;

        public AuthRepository(BlindBlindContext context)
        {
            _context = context;
        }

        public async Task<ConnectionBlindBlind?> GetAuthByEmailAsync(string email)
        {
            return await _context.Set<ConnectionBlindBlind>()
                .Include(c => c.User)
                .ThenInclude(u => u.Roles)
                .FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task SaveRefreshTokenAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task UpdateRefreshTokenAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<ConnectionBlindBlind?> GetUserByIdAsync(string userId)
        {
            return await _context.ConnectionBlindBlind
                .Include(c => c.User)
                .ThenInclude(u => u.Roles)
                .FirstOrDefaultAsync(c => c.Id_User == userId);
        }

        public async Task<User?> GetUserByResetTokenAsync(string token)
        {
            return await _context.User
                .FirstOrDefaultAsync(x => x.ResetToken == token);
        }
    }
}

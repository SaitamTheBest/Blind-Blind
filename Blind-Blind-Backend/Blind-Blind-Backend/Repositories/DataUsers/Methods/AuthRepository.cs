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
    }
}

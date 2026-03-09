using Microsoft.AspNetCore.Identity;

namespace Blind_Blind_Backend.Services.General.Methods
{
    public class GeneralService : IGeneralService
    {
        private readonly PasswordHasher<object> _passwordHasher;

        public GeneralService()
        {
            _passwordHasher = new PasswordHasher<object>();
        }

        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, providedPassword);

            return result == PasswordVerificationResult.Success
                || result == PasswordVerificationResult.SuccessRehashNeeded;
        }

        public async Task<byte[]?> ConvertImageToBytes(IFormFile? image)
        {
            if (image == null || image.Length == 0)
                return null;

            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);

            return memoryStream.ToArray();
        }
    }
}

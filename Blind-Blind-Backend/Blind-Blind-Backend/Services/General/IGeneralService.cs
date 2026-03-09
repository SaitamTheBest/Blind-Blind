namespace Blind_Blind_Backend.Services.General
{
    public interface IGeneralService
    {
        string HashPassword(string password);
        bool VerifyPassword(string hashedPassword, string providedPassword);
        Task<byte[]?> ConvertImageToBytes(IFormFile? image);
    }
}

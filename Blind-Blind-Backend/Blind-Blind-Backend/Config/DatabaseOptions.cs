namespace Blind_Blind_Backend.Config
{
    public class DatabaseOptions
    {
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public string Database { get; set; } = null!;
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;

        public string GetConnectionString()
        {
            return $"Host={Host};Port={Port};Database={Database};Username={User};Password={Password}";
        }
    }
}

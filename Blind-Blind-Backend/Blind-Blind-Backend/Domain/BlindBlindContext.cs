using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Entities.Logs;
using Blind_Blind_Backend.Entities.DataUsers;
using Microsoft.EntityFrameworkCore;

namespace Blind_Blind_Backend.Domain
{
    public class BlindBlindContext : DbContext
    {
        public BlindBlindContext(DbContextOptions<BlindBlindContext> options)
            : base(options)
        {
        }

        #region blindblindv1_datagames

        public DbSet<Album> Album => Set<Album>();
        public DbSet<Artists> Artists => Set<Artists>();
        public DbSet<Featurings> Featurings => Set<Featurings>();
        public DbSet<Games_Day> Games_Day => Set<Games_Day>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Lyrics> Lyrics => Set<Lyrics>();
        public DbSet<Tracks> Tracks => Set<Tracks>();
        public DbSet<Type_Artists> Type_Artists => Set<Type_Artists>();

        #endregion

        #region blindblindv1_datausers

        public DbSet<User> Users => Set<User>();

        #endregion

        #region blindblindv1_datalogs

        public DbSet<HttpLog> HttpLog => Set<HttpLog>();
        
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Featurings>()
                .HasNoKey();
        }
    }
}

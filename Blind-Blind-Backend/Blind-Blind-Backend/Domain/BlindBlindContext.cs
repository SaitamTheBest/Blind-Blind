using Blind_Blind_Backend.Entities.DataGames;
using Blind_Blind_Backend.Entities.DataUsers;
using Blind_Blind_Backend.Entities.Logs;
using Microsoft.EntityFrameworkCore;
using System.Xml;

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
        public DbSet<Genre_Tracks> Genres => Set<Genre_Tracks>();
        public DbSet<Lyrics> Lyrics => Set<Lyrics>();
        public DbSet<Tracks> Tracks => Set<Tracks>();
        public DbSet<Type_Artists> Type_Artists => Set<Type_Artists>();
        public DbSet<Music_Suggestions> Music_Suggestions => Set<Music_Suggestions>();

        #endregion

        #region blindblindv1_datausers

        public DbSet<ConnectionBlindBlind> ConnectionBlindBlind => Set<ConnectionBlindBlind>();
        public DbSet<Rank> Rank => Set<Rank>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Roles> Roles => Set<Roles>();
        public DbSet<User> User => Set<User>();

        #endregion

        #region blindblindv1_datalogs

        public DbSet<HttpLog> HttpLog => Set<HttpLog>();
        
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .Property(e => e.Created_At)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                );

            modelBuilder.Entity<Featurings>()
                .HasKey(f => new { f.Id_Tracks, f.Id_Artists });

            modelBuilder.Entity<Featurings>()
                .HasOne(f => f.Tracks)
                .WithMany(t => t.Featurings)
                .HasForeignKey(f => f.Id_Tracks)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Featurings>()
                .HasOne(f => f.Artists)
                .WithMany(a => a.Featurings)
                .HasForeignKey(f => f.Id_Artists)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

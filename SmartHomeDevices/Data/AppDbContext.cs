using Microsoft.EntityFrameworkCore;
using SmartHomeDevices.Models;

namespace SmartHomeDevices.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration des relations
            modelBuilder.Entity<Device>()
                .HasOne<User>()
                .WithMany(u => u.Devices)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index unique sur l'email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
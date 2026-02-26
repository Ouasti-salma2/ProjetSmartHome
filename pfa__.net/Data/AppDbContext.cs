using Microsoft.EntityFrameworkCore;
using pfa__.net.Models;

namespace pfa__.net.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Piece> Pieces { get; set; }
        public DbSet<Equipement> Equipements { get; set; }
        public DbSet<Regle> Regles { get; set; }
        public DbSet<ConditionHistorique> ConditionHistoriques { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Piece>()
                .HasMany(p => p.Equipements)
                .WithOne(e => e.Piece)
                .HasForeignKey(e => e.Id_Piece)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Regle>(entity =>
            {
                entity.ToTable("regle");
                entity.HasKey(r => r.IdRegle);
                entity.Property(r => r.IdRegle).HasColumnName("id_regle");
                entity.Property(r => r.DateRegle).HasColumnName("dateRegle");
                entity.Property(r => r.ChaqueJour).HasColumnName("chaque_jour");
                entity.Property(r => r.IdEquipement).HasColumnName("id_equipement");

                // ✅ Forcer TIME → string
                entity.Property(r => r.HeureDebut)
                      .HasColumnName("heureDebut")
                      .HasColumnType("varchar(10)");

                entity.Property(r => r.HeureFin)
                      .HasColumnName("heureFin")
                      .HasColumnType("varchar(10)");

                entity.HasOne(r => r.Equipement)
                      .WithMany(e => e.Regles)
                      .HasForeignKey(r => r.IdEquipement)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ConditionHistorique>(entity =>
            {
                entity.ToTable("condition_historique");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasColumnName("id");
                entity.Property(c => c.IdEquipement).HasColumnName("id_equipement");
                entity.Property(c => c.Valeur).HasColumnName("valeur");
                entity.Property(c => c.DateHeure).HasColumnName("date_heure");

                entity.HasOne(c => c.Equipement)
                      .WithMany(e => e.ConditionHistoriques)
                      .HasForeignKey(c => c.IdEquipement);
            });
        }
    }
}
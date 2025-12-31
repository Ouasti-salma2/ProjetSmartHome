using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHomeDevices.Models
{
    [Table("devices")]
    public class Device
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("type")]
        [MaxLength(100)]
        public string Type { get; set; } = string.Empty;

        [Column("is_active")]
        public bool IsActive { get; set; } = false;

        [Column("status")]
        [MaxLength(50)]
        public string Status { get; set; } = "OFF";

        [Column("temperature")]
        public double? Temperature { get; set; }

        [Column("location")]
        [MaxLength(255)]
        public string? Location { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
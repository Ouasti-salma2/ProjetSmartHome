using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHomeDevices.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [Column("email")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("password")]
        [MaxLength(255)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Column("name")]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relation avec les devices
        public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    }
}
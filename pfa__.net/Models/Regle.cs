using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pfa__.net.Models
{
    [Table("regle")]
    public class Regle
    {
        [Key]
        public int IdRegle { get; set; }
        public DateTime? DateRegle { get; set; } // ✅ nullable
        public string HeureDebut { get; set; } = string.Empty;
        public string HeureFin { get; set; } = string.Empty;
        public int IdEquipement { get; set; }
        public bool ChaqueJour { get; set; } = false;

        [ForeignKey("IdEquipement")]
        public Equipement Equipement { get; set; }
    }
}
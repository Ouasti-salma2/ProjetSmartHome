using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pfa__.net.Models
{
    [Table("condition_historique")]
    public class ConditionHistorique
    {
        [Key]
        public int Id { get; set; }
        public int IdEquipement { get; set; }
        public string Valeur { get; set; } = string.Empty;
        public DateTime DateHeure { get; set; }

        [ForeignKey("IdEquipement")]
        public Equipement Equipement { get; set; }
    }
}
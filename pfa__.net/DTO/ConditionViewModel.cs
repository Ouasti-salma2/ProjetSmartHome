namespace pfa__.net.DTO
{
    public class ConditionViewModel
    {
        public int Id { get; set; }
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string TypeEquipement { get; set; } = string.Empty;
        public string Valeur { get; set; } = string.Empty;
        public DateTime DateHeure { get; set; }
    }

    public class ConditionCreateViewModel
    {
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string Valeur { get; set; } = string.Empty;
        public DateTime DateHeure { get; set; } = DateTime.Now;
    }
}
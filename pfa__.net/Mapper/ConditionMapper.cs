using pfa__.net.Models;
using pfa__.net.DTO;

namespace pfa__.net.Mapper
{
    public static class ConditionMapper
    {
        public static ConditionViewModel ToViewModel(ConditionHistorique condition)
        {
            return new ConditionViewModel
            {
                Id = condition.Id,
                IdEquipement = condition.IdEquipement,
                NomEquipement = condition.Equipement?.Nom ?? string.Empty,
                TypeEquipement = condition.Equipement?.Etat ?? string.Empty,
                Valeur = condition.Valeur,
                DateHeure = condition.DateHeure
            };
        }

        public static ConditionHistorique ToModel(ConditionCreateViewModel vm)
        {
            return new ConditionHistorique
            {
                IdEquipement = vm.IdEquipement,
                Valeur = vm.Valeur,
                DateHeure = DateTime.Now
            };
        }

        public static List<ConditionViewModel> ToViewModelList(IEnumerable<ConditionHistorique> conditions)
        {
            return conditions.Select(ToViewModel).ToList();
        }
    }
}
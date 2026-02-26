using pfa__.net.Models;
using pfa__.net.DTO;

namespace pfa__.net.Mapper
{
    public static class RegleMapper
    {
        public static RegleViewModel ToViewModel(Regle regle)
        {
            return new RegleViewModel
            {
                IdRegle        = regle.IdRegle,
                DateRegle      = regle.DateRegle,
                HeureDebut     = regle.HeureDebut,
                HeureFin       = regle.HeureFin,
                IdEquipement   = regle.IdEquipement,
                NomEquipement  = regle.Equipement?.Nom ?? string.Empty,
                TypeEquipement = regle.Equipement?.Etat ?? string.Empty,
                ChaqueJour     = regle.ChaqueJour
            };
        }

        public static Regle ToModel(RegleCreateViewModel vm)
        {
            return new Regle
            {
                DateRegle    = vm.ChaqueJour ? null : vm.DateRegle, // ✅ null si chaqueJour
                HeureDebut   = vm.HeureDebut,
                HeureFin     = vm.HeureFin,
                IdEquipement = vm.IdEquipement,
                ChaqueJour   = vm.ChaqueJour
            };
        }

        public static List<RegleViewModel> ToViewModelList(IEnumerable<Regle> regles)
        {
            return regles.Select(ToViewModel).ToList();
        }
    }
}
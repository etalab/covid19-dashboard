export const indicatorsList = {
  tauxIncidence: {
    label: 'Taux d’incidence',
    min: 1,
    max: 10
  },
  tauxReproductionEffectif: {
    label: 'Taux de reproduction effectif',
    min: 0,
    max: 1.5
  },
  tauxOccupationRea: {
    label: 'Taux d’occupation des lits en réanimation',
    details: 'Taux d’occupation des lits en réa/SI/SC par des patients COVID par rapport à la capacité initiale en réa',
    min: 40,
    max: 60
  },
  tauxPositiviteTests: {
    label: 'Taux de positivité des tests RT-PCR',
    min: 5,
    max: 10
  }
}

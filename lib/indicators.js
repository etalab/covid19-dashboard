export const indicatorsList = {
  tauxIncidence: {
    label: 'Activité épidémique',
    details: 'nombre de patients ayant un test RT-PCR positif pour 100 000 habitants par semaine (cumul sur 7 jours glissants, données SI-DEP)',
    min: 1,
    max: 10
  },
  tauxReproductionEffectif: {
    label: 'Nombre de reproduction effectif',
    details: 'nombre moyen de personnes contaminées par chaque personne atteinte du COVID-19 (basé sur les données Oscour : passages aux urgences pour suspicion COVID-19)',
    min: 0,
    max: 1.5
  },
  tauxOccupationRea: {
    label: 'Taux d’occupation des lits en réa',
    details: 'taux d’occupation des lits en réanimation par des patients atteints du COVID-19 par rapport à la capacité initiale en réanimation, par région',
    min: 40,
    max: 60
  },
  tauxPositiviteTests: {
    label: 'Taux de positivité des tests RT-PCR',
    details: '% de personnes testées positives parmi toutes les personnes testées (cumul sur 7 jours glissants, données SI-DEP)',
    min: 5,
    max: 10
  }
}

export const indicatorsList = {
  tauxIncidence: {
    label: 'Taux d’incidence',
    details: 'Activité épidémique : nombre de patients ayant un test RT-PCR positif pour 100 000 habitants par semaine (cumul sur 7 jours glissants, données SI-DEP)',
    min: 10,
    max: 50
  },
  tauxReproductionEffectif: {
    label: 'R - Nombre de reproduction effectif',
    details: 'Nombre moyen de personnes contaminées par chaque personne atteinte du COVID-19 (basé sur les données Oscour : passages aux urgences pour suspicion COVID-19)',
    min: 1,
    max: 1.5
  },
  tauxOccupationRea: {
    label: 'Taux d’occupation des lits en réanimation',
    details: 'Taux d’occupation des lits en réanimation par des patients atteints du COVID-19 par rapport à la capacité initiale en réanimation, par région',
    min: 30,
    max: 60
  },
  tauxPositiviteTests: {
    label: 'Taux de positivité des tests RT-PCR',
    details: '% de personnes testées positives parmi toutes les personnes testées (cumul sur 7 jours glissants, données SI-DEP)',
    min: 5,
    max: 10
  }
}

export const indicatorsList = {
  tauxOccupationRea: {
    label: 'Taux d’occupation des lits en réanimation',
    details: 'Nombre de patients atteints de COVID-19 actuellement en réanimation, en soins intensifs, ou en unité de surveillance continue rapportée au total des lits de réanimation en capacité initiale, c’est-à-dire avant la crise.',
    min: 30,
    max: 60
  },
  tauxIncidence: {
    label: 'Taux d’incidence',
    details: 'Nombre de personnes, sur une semaine glissante, testées positives (RT-PCR et test antigénique) pour la première fois depuis plus de 60 jours rapporté à la taille de la population.<br /> Il est exprimé pour 100 000 habitants et permet de comparer des zones géographiques entre elles. Le taux d’incidence peut fluctuer en fonction des activités de dépistage et de délais de rendu de résultat.',
    min: 10,
    max: 50
  },
  tauxReproductionEffectif: {
    label: 'R - Nombre de reproduction effectif',
    details: 'Nombre moyen de personnes qu’un malade peut contaminer.<br /> Le R effectif peut fluctuer en fonction des activités de dépistage, de délais de rendu de résultat.',
    min: 1,
    max: 1.5
  },
  tauxPositiviteTests: {
    label: 'Taux de positivité des tests RT-PCR',
    details: 'Nombre de nouvelles personnes testées positives rapporté au nombre total de personnes testées pour la première fois positives ou négatives sur une période donnée.<br /> Le taux de positivité est à analyser à la lumière des activités de dépistage et des politiques de priorisation des tests.',
    min: 5,
    max: 10
  }
}

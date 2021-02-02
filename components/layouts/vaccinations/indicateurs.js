const indicateurs = [
  {
    name: 'cumulPremieresInjections',
    label: 'premières doses injectées (au total)',
    details: 'Nombre total de premières doses de vaccin injectées (données à J-1 ou J-2)',
    color: 'greenSoft',
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'totalPrisesRendezVousSemaine',
    label: 'rendez-vous prévus cette semaine',
    details: 'Nombre de rendez-vous prévus cette semaine dans les centres de vaccination',
    color: 'darkGrey',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'prisesRendezVousSemaineRang1',
    label: 'rendez-vous prévus cette semaine pour une première injection',
    details: 'Nombre de rendez-vous prévus cette semaine dans les centres de vaccination pour l’injection d’une première dose',
    color: 'blueSoft',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'prisesRendezVousSemaineRang2',
    label: 'rendez-vous prévus cette semaine pour une seconde injection',
    details: 'Nombre de rendez-vous prévus cette semaine dans les centres de vaccination pour l’injection d’une seconde dose',
    color: 'purple',
    radiusBounds: [0, 10, 300, 70]
  }
]

export default indicateurs

const indicateurs = [
  {
    name: 'stockNombreTotalDoses',
    label: 'doses en stock dans les établissements de santé pivots du flux B',
    details: 'Nombre de doses en stock destinées aux centres de vaccination, à quelques EPHAD, aux foyers d’accueil médicalisé et aux maison d’accueil spécialisés',
    color: 'darkGrey',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockNombreDosesPfizer',
    label: 'doses en stock Pfizer dans les établissements de santé pivots du flux B',
    details: 'Nombre de doses en stock Pfizer destinées aux centres de vaccination, à quelques EPHAD, aux foyers d’accueil médicalisé et aux maison d’accueil spécialisés',
    color: 'darkBlue',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockNombreDosesModerna',
    label: 'doses en stock Moderna dans les établissements de santé pivots du flux B',
    details: 'Nombre de doses en stock Moderna destinées aux centres de vaccination, à quelques EPHAD, aux foyers d’accueil médicalisé et aux maison d’accueil spécialisés',
    color: 'darkRed',
    radiusBounds: [0, 10, 300, 70]
  },

  {
    name: 'stockEhpadNombreDosesPfizer',
    label: 'doses Pfizer en stock pour les EHPAD du flux A',
    details: 'Nombre de doses Pfizer destinées à la grande majorité des résidents en EHPAD ou en USLD',
    color: 'darkBlue',
    radiusBounds: [0, 10, 300, 70]
  },

  {
    name: 'livraisonsCumulNombreTotalDoses',
    label: 'doses livrées',
    details: 'Nombre total de doses livrées (sont également décomptées les doses injectées)',
    color: 'darkGrey',
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'livraisonsCumulNombreDosesPfizer',
    label: 'doses Pfizer livrées',
    details: 'Nombre de doses Pfizer livrées (sont également décomptées les doses injectées)',
    color: 'darkBlue',
    radiusBounds: [0, 10, 800, 70]
  },
  {
    name: 'livraisonsCumulNombreDosesModerna',
    label: 'doses Moderna livrées',
    details: 'Nombre de doses Moderna livrées (sont également décomptées les doses injectées)',
    color: 'darkRed',
    radiusBounds: [0, 10, 800, 70]
  }
]

export default indicateurs

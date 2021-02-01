const indicateurs = [
  {
    name: 'stockNombreTotalDoses',
    label: 'doses en stock dans les établissements de santé pivots',
    details: 'Nombre total de doses en stock destinées notamment aux centres de vaccination',
    color: 'darkGrey',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockNombreDosesPfizer',
    label: 'doses Pfizer en stock dans les établissements de santé pivots',
    details: 'Nombre de doses Pfizer en stock destinées notamment aux centres de vaccination',
    color: 'darkBlue',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockNombreDosesModerna',
    label: 'doses Moderna en stock dans les établissements de santé pivots',
    details: 'nombre de doses Moderna en stock destinées notamment aux centres de vaccination',
    color: 'darkRed',
    radiusBounds: [0, 10, 300, 70]
  },

  {
    name: 'stockEhpadNombreTotalDoses',
    label: 'doses en stock pour les EHPAD du flux A',
    details: 'Nombre de doses de vaccins réservées aux personnes âgées résidant en établissement',
    color: 'darkGrey',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockEhpadNombreDosesPfizer',
    label: 'doses Pfizer en stock pour les EHPAD du flux A',
    details: 'Nombre de doses Pfizer réservées aux personnes âgées résidant en établissement',
    color: 'darkBlue',
    radiusBounds: [0, 10, 300, 70]
  },
  {
    name: 'stockEhpadNombreDosesModerna',
    label: 'doses Moderna en stock pour les EHPAD du flux A',
    details: 'Nombre de doses Moderna réservées aux personnes âgées résidant en établissement',
    color: 'darkRed',
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

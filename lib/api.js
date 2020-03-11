import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import

export async function fetchJson(url) {
  const response = await fetch(url)
  if (response && response.ok) {
    return response.json()
  }

  return {
    date: '2020-03-04T00:00:00.000Z',
    donneesNationales: {casConfirmes: 285, deces: 4},
    donneesRegionales: [
      {nom: 'Auvergne-Rhône-Alpes', code: '84', casConfirmes: 49},
      {
        nom: 'Bourgogne-Franche-Comté',
        code: '27',
        casConfirmes: 16
      },
      {nom: 'Bretagne', code: '53', casConfirmes: 23},
      {nom: 'Centre-Val de Loire', code: '24', casConfirmes: 0},
      {nom: 'Corse', code: '94', casConfirmes: 0},
      {nom: 'Grand Est', code: '44', casConfirmes: 38},
      {nom: 'Hauts-de-France', code: '32', casConfirmes: 65},
      {nom: 'Ile-de-France', code: '11', casConfirmes: 55},
      {nom: 'Normandie', code: '28', casConfirmes: 2},
      {nom: 'Nouvelle-Aquitaine', code: '75', casConfirmes: 5},
      {nom: 'Occitanie', code: '76', casConfirmes: 9},
      {nom: 'Pays de la Loire', code: '52', casConfirmes: 7},
      {
        nom: 'Provence-Alpes-Côte d’Azur',
        code: '93',
        casConfirmes: 13
      },
      {nom: 'Guadeloupe', code: '01', casConfirmes: 3},
      {nom: 'Guyane', code: '03', casConfirmes: 0},
      {nom: 'Martinique', code: '02', casConfirmes: 0},
      {nom: 'Mayotte', code: '06', casConfirmes: 0},
      {nom: 'La Réunion', code: '04', casConfirmes: 0}
    ],
    donneesMondiales: {paysTouches: 77, casConfirmes: 93076, deces: 3202}
  }
}

export const getData = async () => {
  return fetchJson('http://localhost:3000/toto')
}

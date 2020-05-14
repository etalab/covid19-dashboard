import React from 'react'

export const AIDES_ENTREPRISES_URL = 'https://aides-entreprises.data.gouv.fr/?nomapscroll=true'

const Entreprises = () => {
  return (
    <iframe title='Aides aux entreprises : fonds de solidarité' width='100%' height='100%' src={AIDES_ENTREPRISES_URL} />
  )
}

export default Entreprises

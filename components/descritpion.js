import React from 'react'

const Description = React.memo(() => (
  <div className='description'>
    <p>
      L‘information officielle sur la progression de l’épidémie en France est très fragmentée.
    </p>
    <p>
      <a href='https://www.santepubliquefrance.fr'>Santé publique France</a> propose un point épidémiologique quotidien, qui comprend les chiffres-clés nationaux, et le nombre de cas confirmés par région.
    </p>
    <p>
      Les agences régionales de santé et les préfectures publient de leur côté des informations au niveau départemental, ainsi que le nombre de personnes décédées ou en réanimation.
    </p>
    <p>
      Cet outil contributif tente de proposer une <a href='https://www.data.gouv.fr/fr/datasets/chiffres-cles-concernant-lepidemie-de-covid19-en-france/'>vision consolidée</a> des données officielles disponibles.
    </p>

    <style jsx>{`
      .description {
        padding: 1em;
      }

      .description p {
        font-size: 0.85em;
      }
    `}</style>
  </div>
))

export default Description

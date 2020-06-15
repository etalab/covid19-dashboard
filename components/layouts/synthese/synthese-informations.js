import React, {useContext} from 'react'

import {AppContext} from '../../../pages'

import colors from '../../../styles/colors'

const SyntheseInformations = () => {
  const {date} = useContext(AppContext)

  return (
    <div className='informations'>
      <h3>Informations</h3>
      {date < '2020-05-07' && (
        <>
          <p>Cette carte synthétise, depuis le 30 avril 2020, les 2 indicateurs suivants :</p>
          <ul>
            <li><b>la circulation active du virus</b>, basée sur la proportion de passages aux urgences pour une suspicion de COVID-19 ;</li>
            <li><b>la tension hospitalière sur les capacités en réanimation</b>, basée sur les taux d’occupation des lits de réanimation par des patients atteints de COVID-19, par rapport à la capacité initiale avant l’épidémie.</li>
          </ul>
          <p>Le statut de chaque département (vert/orange/rouge) est publié en open data sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>
        </>
      )}
      {date >= '2020-05-07' && date < '2020-05-28' && (
        <>
          <p>Cette carte, présentée le 7 mai 2020, synthétise les 3 indicateurs suivants :</p>
          <ul>
            <li><b>la circulation active du virus</b>, basée sur la proportion de passages aux urgences pour une suspicion de COVID-19 ;</li>
            <li><b>la tension hospitalière sur les capacités en réanimation</b>, basée sur les taux d’occupation des lits de réanimation par des patients atteints de COVID-19, par rapport à la capacité initiale avant l’épidémie ;</li>
            <li><b>le taux de couverture des besoins en tests</b> estimés au 11 mai.</li>
          </ul>
          <p>Cette carte sert de référence pour les mesures différenciées qui seront appliquées à compter du lundi 11 mai, selon les régions. Elle sera mise à jour en fonction de l’évolution des données de suivi de l’épidémie, et non sur une fréquence quotidienne.</p>
          <p>Le statut de chaque département (vert/rouge) est publié en open data sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>
        </>
      )}
      {date >= '2020-05-28' && date < '2020-06-15' && (
        <>
          <p>Cette carte, présentée le 28 mai 2020, sert de référence pour les mesures différenciées qui seront appliquées à compter du mardi 2 juin, selon les départements.</p>
          <p>Elle est construite sur la base des 4 indicateurs suivants et est complétée par une analyse de risques :</p>
          <ul>
            <li><b>l’activité épidémique</b> : taux d’incidence : nombre de tests virologiques positifs pour 100 000 habitants par semaine ;</li>
            <li><b>le taux de positivité des tests virologiques</b> ;</li>
            <li><b>l’évolution du R0</b> : nombre de personnes contaminées par chaque malade ;</li>
            <li><b>la tension hospitalière sur la capacité en réanimation</b> : le taux d’occupation des lits en réanimation par des patients COVID par rapport à la capacité initiale en réanimation.</li>
          </ul>
          <p>Le statut de chaque département est publié en open data sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>
        </>
      )}
      {date >= '2020-06-15' && (
        <>
          <p>Cette carte, présentée le 28 mai 2020 et mise à jour le 15 juin 2020, sert de référence pour les mesures différenciées qui sont appliquées depuis le mardi 2 juin, selon les départements.</p>
          <p>Découvrez ce qui change, ce qui est conseillé, les mesures prises pour vous aider et ce qui est autorisé ou pas en fonction de votre lieu de résidence : <a href='https://www.gouvernement.fr/info-coronavirus'>https://www.gouvernement.fr/info-coronavirus</a></p>
          <p>Elle est construite sur la base des 4 indicateurs suivants et est complétée par une analyse de risques :</p>
          <ul>
            <li><b>l’activité épidémique</b> : taux d’incidence : nombre de tests virologiques positifs pour 100 000 habitants par semaine ;</li>
            <li><b>le taux de positivité des tests virologiques</b> ;</li>
            <li><b>l’évolution du R0</b> : nombre de personnes contaminées par chaque malade ;</li>
            <li><b>la tension hospitalière sur la capacité en réanimation</b> : le taux d’occupation des lits en réanimation par des patients COVID par rapport à la capacité initiale en réanimation.</li>
          </ul>
          <p>Le statut de chaque département est publié en open data sur <a href='https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/' target='_top'>www.data.gouv.fr</a>.</p>
        </>
      )}

      <style jsx>{`
        .informations {
          padding: 1em;
          background-color: ${colors.sand};
        }

        .informations p, .informations ul {
          font-size: 14px;
          line-height: 22px;
          text-align: justify;
        }
      `}</style>
    </div>
  )
}

export default SyntheseInformations

# Tableau de bord de suivi de l'épidémie de coronavirus

Le tableau de bord disponible sur [gouvernement.fr](http://gouvernement.fr) présente les données relatives à l’épidémie de COVID-19 en France. 
Il a été mis en ligne le 28 mars 2020, afin de répondre aux besoins d’information des citoyens et des citoyennes en matière de transparence sur l’évolution de l’épidémie de coronavirus en France.
 
Ce tableau de bord, dont le code source est libre, a été développé sous l’impulsion d’Etalab et avec la collaboration de la société civile. 

Il propose une vision consolidée des données officielles disponibles.

Le tableau de bord a été disponible sur le site web [gouvernement.fr](http://gouvernement.fr) jusqu'à mai 2021, quand il a été remplacé par [etalab/covid19-dashboard-widgets](https://github.com/etalab/covid19-dashboard-widgets).

Plusieurs sources de données ont alimenté le tableau de bord :

### Données hospitalières

- [Données hospitalières relatives à l’épidémie de COVID-19](https://www.data.gouv.fr/fr/datasets/donnees-hospitalieres-relatives-a-lepidemie-de-covid-19/)

### Données relatives aux tests

- [Capacité analytique de tests virologiques dans le cadre de l'épidémie de COVID-19 (SI-DEP)](https://www.data.gouv.fr/fr/datasets/capacite-analytique-de-tests-virologiques-dans-le-cadre-de-lepidemie-covid-19/)
- [Données relatives aux résultats des tests virologiques COVID-19 (SI-DEP)](https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-resultats-des-tests-virologiques-covid-19/)
- [Taux d'incidence de l'épidémie de COVID-19 (SI-DEP)](https://www.data.gouv.fr/fr/datasets/taux-dincidence-de-lepidemie-de-covid-19/)
- [Sites de prélèvements pour les tests COVID](https://www.data.gouv.fr/fr/datasets/sites-de-prelevements-pour-les-tests-covid/)

### Données relatives aux vaccins

- [Données relatives aux personnes vaccinées contre la Covid-19](https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-personnes-vaccinees-contre-la-covid-19-1/)
- [Données relatives aux stocks des doses de vaccins contre la COVID-19](https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-stocks-des-doses-de-vaccins-contre-la-covid-19/)
- [Données relatives aux livraisons de vaccins contre la COVID-19](https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-livraisons-de-vaccins-contre-la-covid-19/)
- [Données des rendez-vous pris dans des centres de vaccination contre la COVID-19](https://www.data.gouv.fr/fr/datasets/donnees-des-rendez-vous-pris-dans-des-centres-de-vaccination-contre-la-covid-19/)



## Outils utilisés

* [Node.js](https://nodejs.org)
* [React](https://reactjs.org)
* [Next.js](https://nextjs.org)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
* [Chart.js](https://www.chartjs.org)

## Pré-requis

* Node.js >= 10
* yarn ou npm

## Installation

```
yarn
```

## Lancer (en mode développement)

```
yarn dev
```

## Préparer les données

```
yarn prepare-data
```

## Générer le site statique

```
yarn build && yarn export
cat out/
```

## Configurer

Selon le besoin il est possible de configurer l’outil grâce à des variables d’environnement. Le plus simple est de prendre exemple sur le fichier `.env.sample`.

## Mettre à jour les données géographiques

```
yarn build:geo
```

## Licence

MIT

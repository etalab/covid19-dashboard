# Ancien tableau de bord de suivi de l'épidémie de COVID-19

Ce tableau de bord est le fruit d’une collaboration entre les membres du collectif [OpenCovid](https://github.com/opencovid19-fr) et le département Etalab de la Direction Interministérielle du Numérique. Il a été mis en ligne le 28 mars 2020, afin de répondre aux besoins d’information des citoyens et des citoyennes en matière de transparence sur l’évolution de l’épidémie de coronavirus en France.

Afin de toucher le maximum de citoyens, le tableau de bord a été propulsé en avril 2020 sur gouvernement.fr et a connu des évolutions successives avec l’introduction de nouveaux indicateurs. Afin de s’adapter aux évolutions des indicateurs et de faciliter la navigation des utilisateurs, [une refonte graphique et technique du tableau de bord officiel du gouvernement a été réalisée en mai 2021](https://www.data.gouv.fr/fr/reuses/tableau-de-bord-de-suivi-de-lepidemie-de-coronavirus-en-france/). Le répo GitHub du nouveau tableau de bord [est disponible ici](https://github.com/etalab/covid19-dashboard-widgets).

**⚠️ Par conséquent, ce tableau de bord n’est désormais plus maintenu. Les valeurs des indicateurs exposées sur cet outil peuvent être erronées, puisque certaines méthodes de calcul ont évolué.**

Si vous vous souhaitez consulter les indicateurs à jour, nous vous invitons à consulter [le tableau de bord officiel du gouvernement](https://www.gouvernement.fr/info-coronavirus/carte-et-donnees).

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

# Tableau de bord de suivi de l'épidémie de nouveau coronavirus

Cet outil contributif tente de proposer une vision [consolidée](https://github.com/opencovid19-fr/data) des données officielles disponibles.

Pour contribuer, créez une Issue, ou déposez une Pull-request :)

Vous pouvez aussi consulter [le guide de contribution pour l'ensemble des projets de collecte de données](https://github.com/opencovid19-fr/comment-contribuer).

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

## Déployer en production

La production est actuellement sur GitHub Pages. Vous devez disposer des droits suffisants sur de dépôt pour déployer.

```
yarn deploy
```

## Configurer

Selon le besoin il est possible de configurer l’outil grâce à des variables d’environnement. Le plus simple est de prendre exemple sur le fichier `.env.sample`.

## Mettre à jour les centres géographiques

```
yarn centers:build
```

## Licence

MIT

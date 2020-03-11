const YAML = require('yamljs')

async function buildDataset() {
  const datasets = await YAML.load('./data/covid_fr_040320.yaml')

  return {
    datasets
  }
}

module.exports = {buildDataset}

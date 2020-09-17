import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

const PieChartPercent = ({data, labels, colors, height}) => {
  const chartRef = useRef(null)
  const chart = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      _meta: {}
    }]
  }

  const options = {
    responsive: true,
    events: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
      onComplete: animation => {
        const {ctx} = animation.chart
        const {data} = chartRef.current.props
        ctx.font = Chart.helpers.fontString(15, 'bold', Chart.defaults.global.defaultFontFamily)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.context = {}
        data.datasets.forEach(dataset => {
          for (let i = 0; i < dataset.data.length; i++) {
            const model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model
            const total = dataset._meta[Object.keys(dataset._meta)[0]].total
            const midRadius = model.innerRadius + ((model.outerRadius - model.innerRadius) / 2)
            const startAngle = model.startAngle
            const endAngle = model.endAngle
            const midAngle = startAngle + ((endAngle - startAngle) / 2)
            const x = midRadius * Math.cos(midAngle)
            const y = midRadius * Math.sin(midAngle)
            ctx.fillStyle = '#fff'
            const percent = String(Math.round(dataset.data[i] / total * 100)) + '%'
            ctx.fillText(percent, model.x + x, model.y + y + 15)
          }
        })
      }
    }
  }

  return (
    <Doughnut ref={chartRef} data={chart} options={options} height={height} />
  )
}

PieChartPercent.defaultProps = {
  colors: ['black'],
  height: 100
}

PieChartPercent.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array,
  height: PropTypes.number
}

export default PieChartPercent

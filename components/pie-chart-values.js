import React, {useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import {Pie} from 'react-chartjs-2'

const PieChartValues = ({title, data, labels, height}) => {
  const chartRef = useRef(null)

  const chart = {
    datasets: [{
      data: data.map(r => (r.value)),
      label: data.map(r => (r.label ? r.label : null)),
      backgroundColor: data.map(r => r.color),
      hoverBackgroundColor: data.map(r => r.color),
      _meta: {}
    }]
  }

  if (labels) {
    chart.labels = labels
  }

  const options = useMemo(() => {
    return {
      responsive: true,
      events: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
        onComplete: animation => {
          const {ctx} = animation.chart
          const {data} = chartRef.current.props
          ctx.font = Chart.helpers.fontString(14, 'bold', Chart.defaults.global.defaultFontFamily)
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.context = {}
          data.datasets.forEach(dataset => {
            for (let i = 0; i < dataset.data.length; i++) {
              const model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model
              const midRadius = model.innerRadius + ((model.outerRadius - model.innerRadius) / 2)
              const startAngle = model.startAngle
              const endAngle = model.endAngle
              const midAngle = startAngle + ((endAngle - startAngle) / 2)
              const x = midRadius * Math.cos(midAngle)
              const y = midRadius * Math.sin(midAngle)
              ctx.fillStyle = '#fff'
              const values = dataset.label[i] ? dataset.data[i] + ' ' + dataset.label[i] : dataset.data[i]
              ctx.fillText(values, model.x + x - 10, model.y + y + 15)
            }
          })
        }
      }
    }
  }, [chartRef])

  return (
    <>
      {title && (<div className='title'>{title}</div>)}
      <Pie ref={chartRef} data={chart} options={options} height={height} />
      <style jsx>{`
      .title {
          text-align: center;
          font-size: large;
          font-weight: bold;
          padding: .5em;
          margin-top: .5em;
        }
        `}</style>
    </>
  )
}

PieChartValues.defaultProps = {
  title: null,
  labels: null,
  height: 100
}

PieChartValues.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  labels: PropTypes.array,
  height: PropTypes.number
}

export default PieChartValues

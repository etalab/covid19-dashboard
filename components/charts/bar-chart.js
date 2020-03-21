import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
    this.state = {
      yLinearScale: true
    };
  }

  handleClickChangeScale = () => {
    updateScale(this.chartReference.current.chartInstance);
    this.setState({ yLinearScale: !this.state.yLinearScale });
  };

  render() {
    return (
      <>
        <div style={{ padding: "1em" }}>
          <div
            className={`scale-type ${
              this.state.yLinearScale ? "selected" : ""
            }`}
            onClick={this.handleClickChangeScale}
          >
            <div className={this.state.yLinearScale && "selected"}>
              <span>Linéaire</span>
            </div>
            <div className={!this.state.yLinearScale && "selected"}>
              <span>Logarithmique</span>
            </div>
          </div>
          <Bar
            data={this.props.data}
            options={this.props.options}
            height={this.props.height}
            ref={this.chartReference}
          />
        </div>
        <style jsx>{`
          .scale-type {
            text-align: center;
            background-color: #c9d3df;
            color: #fff;
            border-radius: 4px;
            max-width: 8em;
          }

          .scale-type div:first-child {
            border-radius: 4px 4px 0px 0px;
            padding: 3px;
          }

          .scale-type div:last-child {
            border-radius: 0px 0px 4px 4px;
            padding: 3px;
          }

          .scale-type div:hover {
            cursor: pointer;
            background-color: #8393a7;
          }

          .scale-type div.selected {
            background-color: #53657d;
          }
        `}</style>
      </>
    );
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  height: PropTypes.number
};

function updateScale(chart) {
  const type =
    chart.options.scales.yAxes[0].type == "linear" ? "logarithmic" : "linear";
  chart.options.scales.yAxes = [
    {
      ...chart.options.scales.yAxes[0],
      ...{
        type: type,
        ticks: {
          autoSkip: true,
          callback: function(value, index, values) {
            return Number(value.toString());
          }
        }
      }
    }
  ];
  chart.update();
}

export default BarChart;

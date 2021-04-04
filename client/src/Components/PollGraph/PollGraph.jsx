import React from "react";
import { Container, Typography } from "@material-ui/core";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

let myChart;

const PollGraph = (props) => {
  const chartRef = React.useRef();

  const { usePoll, smallVersion, display } = props;

  const labels = usePoll.options.map((option) => option.name);
  const data = usePoll.options.map((option) => option.numberOfVotes);

  const noVotes = data.find((value) => value > 0) === undefined;

  React.useEffect(() => {
    !noVotes && buildChart();
  }, [data, noVotes]);

  const buildChart = () => {
    const myChartRef = chartRef.current.getContext("2d");

    if (typeof myChart !== "undefined" && !smallVersion) myChart.destroy();

    myChart = new Chart(myChartRef, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#157F1F",
              "#4CB963",
              "#A0EADE",
              "#3C91E6",
              "#1D263B",
              "#FE7F2D",
              "#880044",
              "#DD1155",
              "#98A6D4",
              "#64403E",
            ],
            hoverOffset: smallVersion ? 0 : 8,
          },
        ],
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let datasets = ctx.chart.data.datasets;
              let sum = datasets[0].data.reduce((a, b) => a + b, 0);
              let percentage = Math.round((value / sum) * 100) + "%";
              return percentage !== "0%" ? percentage : "";
            },
            font: {
              weight: !smallVersion && "bold",
              size: smallVersion ? 13 : 17,
            },
            color: "#fff",
          },
        },
        animation: {
          duration: 0,
        },
        responsive: true,
        scaleBeginAtZero: true,
        tooltips: {
          enabled: !smallVersion,
        },
        legend: {
          display: display,
          onClick: () => {},
          position: "bottom",
          align: "center",
          labels: {
            boxWidth: smallVersion ? 35 : 50,
            fontSize: smallVersion ? 13 : 20,
            fontColor: "Black",
            fontStyle: "bold",
          },
        },
      },
    });
  };

  return (
    <Container
      style={{ display: "flex", alignItem: "center", justifyContent: "center" }}
    >
      {noVotes ? (
        <Typography
          variant={smallVersion ? "h6" : "h3"}
          style={{
            color: "#28527a",
            padding: "0.5em",
            borderRadius: "0.5em",
          }}
        >
          No votes
        </Typography>
      ) : (
        <canvas id="myChart" ref={chartRef} />
      )}
    </Container>
  );
};

export default PollGraph;

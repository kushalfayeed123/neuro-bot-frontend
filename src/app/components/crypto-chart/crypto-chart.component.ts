import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexLegend,
  ApexResponsive,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { interval } from "rxjs";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  colors: string[];
};

@Component({
  selector: "app-crypto-chart",
  templateUrl: "./crypto-chart.component.html",
  styleUrls: ["./crypto-chart.component.css"],
})
export class CryptoChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions!: ChartOptions;

  ngOnInit(): void {
    // Initialize the chart options with 10 coins and 12 data points each
    this.chartOptions = {
      series: [
        {
          name: "Bitcoin",
          data: [
            40000,
            42000,
            45000,
            43000,
            47000,
            49000,
            48000,
            50000,
            52000,
            51000,
            53000,
            55000,
          ],
        },
        {
          name: "Ethereum",
          data: [
            3000,
            3100,
            3200,
            3150,
            3300,
            3400,
            3350,
            3500,
            3600,
            3550,
            3700,
            3800,
          ],
        },
        {
          name: "Ripple",
          data: [
            0.5,
            0.55,
            0.52,
            0.53,
            0.58,
            0.6,
            0.57,
            0.62,
            0.65,
            0.63,
            0.66,
            0.68,
          ],
        },
        {
          name: "Litecoin",
          data: [150, 160, 155, 158, 162, 170, 168, 172, 175, 174, 178, 180],
        },
        {
          name: "Cardano",
          data: [
            1.2,
            1.25,
            1.3,
            1.28,
            1.35,
            1.38,
            1.36,
            1.4,
            1.42,
            1.41,
            1.45,
            1.5,
          ],
        },
        {
          name: "Polkadot",
          data: [20, 22, 21, 23, 24, 25, 24, 26, 27, 26, 28, 29],
        },
        {
          name: "Binance Coin",
          data: [300, 310, 320, 315, 330, 340, 335, 350, 360, 355, 370, 380],
        },
        {
          name: "Chainlink",
          data: [25, 26, 24, 27, 28, 29, 28, 30, 31, 30, 32, 33],
        },
        {
          name: "Dogecoin",
          data: [
            0.08,
            0.085,
            0.082,
            0.083,
            0.088,
            0.09,
            0.087,
            0.092,
            0.095,
            0.093,
            0.096,
            0.098,
          ],
        },
        {
          name: "Solana",
          data: [100, 105, 110, 108, 115, 120, 118, 125, 130, 128, 132, 135],
        },
      ],
      chart: {
        type: "area",
        height: 400,
        width: "100%",
        zoom: { enabled: false },
      },
      title: {
        text: "",
        align: "left",
        style: { fontSize: "18px", color: "#333" },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      legend: {
        position: "right",
        horizontalAlign: "center",
        labels: { colors: ["#333"] },
      },
      // Expanded colors array for 10 coins:
      colors: [
        "#f7931a", // Bitcoin Orange
        "#627eea", // Ethereum Blue
        "#00aae4", // Ripple Blue
        "#bebebe", // Litecoin Gray
        "#0033ad", // Cardano Blue
        "#e6007a", // Polkadot Pink
        "#f0b90b", // Binance Coin Yellow
        "#375bd2", // Chainlink Blue
        "#c2a633", // Dogecoin Goldish
        "#00ffa3", // Solana Green
      ],
      responsive: [
        {
          breakpoint: 768,
          options: { legend: { position: "bottom" } },
        },
      ],
    };

    // Set up live data updates every 5 seconds.
    interval(5000).subscribe(() => {
      this.updateChartData();
    });
  }

  updateChartData() {
    // For each coin, simulate a new data point by modifying the last value
    const updatedSeries = this.chartOptions.series.map((series) => {
      const dataArray = series.data as number[];
      const lastValue = dataArray[dataArray.length - 1];
      // Simulate a new value with a random change between -500 and +500
      const newValue = Math.round(lastValue + (Math.random() * 1000 - 500));
      const newData = [...dataArray, newValue];
      // Keep only the last 12 data points
      if (newData.length > 12) {
        newData.shift();
      }
      return { ...series, data: newData };
    });

    // Update the series property to trigger the chart update
    this.chartOptions.series = updatedSeries;

    // Optionally, if you have a ViewChild reference, call the updateSeries() method.
    if (this.chart) {
      this.chart.updateSeries(updatedSeries);
    }
  }
}

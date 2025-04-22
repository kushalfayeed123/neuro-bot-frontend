import { Component, OnInit, Input, HostListener } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  ApexTitleSubtitle,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  colors: string[];
};

@Component({
  selector: "app-investment-distribution-chart",
  templateUrl: "./investment-distribution-chart.component.html",
  styleUrls: ["./investment-distribution-chart.component.css"],
})
export class InvestmentDistributionChartComponent implements OnInit {
  @Input() data: any;
  // Expected format:
  // { equities: number, bonds: number, alternatives: number, realEstate?: number, commodities?: number }

  public chartOptions!: Partial<ChartOptions>;

  constructor() {}

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    // Use provided data or default fallback values.
    const distribution = this.data || {
      equities: 40,
      bonds: 30,
      alternatives: 20,
      realEstate: 5,
      commodities: 5,
    };
    this.chartOptions = {
      series: [
        distribution.equities || 40,
        distribution.bonds || 30,
        distribution.alternatives || 20,
        distribution.realEstate || 5,
        distribution.commodities || 5,
      ],
      chart: {
        type: "pie",
        width: "100%",
        height: 400,
        background: '#1f2937', // Dark background
        foreColor: '#e5e7eb', // Light text
      },
      labels: [
        "Equities",
        "Bonds",
        "Alternatives",
        "Real Estate",
        "Commodities",
      ],
      title: {
        text: "",
        align: "left",
        style: { fontSize: "18px", color: "#e5e7eb" },
      },
      // Legend is shown only if window.innerWidth > 600.
      legend: {
        show: window.innerWidth > 600,
        position: "right",
        labels: {
          colors: '#e5e7eb' // Light text for legend
        }
      },
      // Use the app's branding: neon green (#00ff9d) and dark grays
      colors: [
        "#00ff9d", // Neon green for Equities
        "#34495e", // Dark gray for Bonds
        "#2c3e50", // Medium dark gray for Alternatives
        "#6b7280", // Medium gray for Real Estate
        "#1abc9c", // Light gray for Commodities
      ],

      // "#34495e", // dark blue-gray
      // "#2c3e50", // deep navy
      // "#1abc9c", // fresh teal accent
      // "#e74c3c", // vibrant red
      // "#f39c12", // striking orange
      // "#8e44ad", 
      responsive: [
        {
          breakpoint: 600,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    if (this.chartOptions && this.chartOptions.legend) {
      this.chartOptions.legend.show = window.innerWidth > 600;
    }
  }
}

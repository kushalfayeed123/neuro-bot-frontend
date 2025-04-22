import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexGrid,
  ApexTooltip,
} from "ng-apexcharts";
import { ChartComponent } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  colors: string[];
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
};

@Component({
  selector: "app-performance-summary-chart",
  templateUrl: "./performance-summary-chart.component.html",
  styleUrls: ["./performance-summary-chart.component.css"],
})
export class PerformanceSummaryChartComponent implements OnInit {
  @Input() data: any;
  // Expected format:
  // { annualReturn: number, volatility: number, maxDrawdown: number, sharpeRatio: number, beta: number }
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions!: ChartOptions;
  private viewWidth: number = window.innerWidth;

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.viewWidth = window.innerWidth;
    this.setChartOptions();
  }

  ngOnInit(): void {
    this.setChartOptions();
  }

  setChartOptions(): void {
    // Calculate chart width: if window width > 320px, use 33% of window width; otherwise, use full width.
    const chartWidth =
      this.viewWidth > 320 ? this.viewWidth * 0.33 : this.viewWidth;

    // Use provided data or fallback default values.
    const inputData = this.data || {
      annualReturn: 8,
      volatility: 12,
      maxDrawdown: 10,
      sharpeRatio: 1.5,
      beta: 0.95,
    };

    const categories = [
      "Annual Return (%)",
      "Volatility (%)",
      "Max Drawdown (%)",
      "Sharpe Ratio",
      "Beta",
    ];

    const seriesData = [
      inputData.annualReturn || 8,
      inputData.volatility || 12,
      inputData.maxDrawdown || 10,
      inputData.sharpeRatio || 1.5,
      inputData.beta || 0.95,
    ];

    this.chartOptions = {
      series: [
        {
          name: "Performance Metrics",
          data: seriesData,
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        width: chartWidth,
        animations: { enabled: true },
        background: '#1f2937', // Dark background
        foreColor: '#e5e7eb', // Light text
      },
      title: {
        text: "",
        align: "left",
        style: { fontSize: "18px", color: "#e5e7eb" },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: '#e5e7eb' // Light text for x-axis labels
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#e5e7eb' // Light text for y-axis labels
          }
        }
      },
      dataLabels: { 
        enabled: true,
        style: {
          colors: ['#e5e7eb'] // Light text for data labels
        }
      },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      // Use the app's branding: neon green (#00ff9d) and dark grays
      colors: ["#00ff9d", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"],
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 300, width: chartWidth },
          },
        },
      ],
      grid: {
        borderColor: '#374151', // Darker grid lines
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px'
        }
      }
    };
  }
}

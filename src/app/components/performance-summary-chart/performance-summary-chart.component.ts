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
  ApexResponsive,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { ChartComponent } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  colors: string[];
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
      },
      title: {
        text: "",
        align: "left",
        style: { fontSize: "18px", color: "#333" },
      },
      xaxis: {
        categories: categories,
      },
      dataLabels: { enabled: true },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      // Use your app's branding: primary red (#590202), secondary red (#a61103), then black and dark grays.
      colors: ["#590202", "#a61103", "#000000", "#333333", "#555555"],
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 300, width: chartWidth },
          },
        },
      ],
    };
  }
}

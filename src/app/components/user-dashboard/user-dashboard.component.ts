import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { InvestmentService } from "src/app/investment.service";
import { HttpClient } from "@angular/common/http";
import { Color, ScaleType } from "@swimlane/ngx-charts";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
})
export class UserDashboardComponent implements OnInit {
  userData: any;
  error: string = "";
  transactions: any[] = [];
  cryptoData: any[] = [];
  stockPrices: any[] = [];
  colorScheme: Color = {
    name: "cool",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#34495e", // dark blue-gray
      "#2c3e50", // deep navy
      "#1abc9c", // fresh teal accent
      "#e74c3c", // vibrant red
      "#f39c12", // striking orange
      "#8e44ad", // rich purple
    ],
  };
  defaultInvestmentDistribution = {
    /* default nonzero values */ total: 100,
    equities: 40,
    bonds: 30,
    alternatives: 30,
  };
  defaultPerformanceSummary = {
    /* default nonzero values */ annualReturn: 8,
    volatility: 12,
  };

  // Stock color mapping
  stockColors: { [key: string]: string } = {
    AAPL: "#A2AAAD",
    GOOGL: "#4285F4",
    AMZN: "#FF9900",
    MSFT: "#737373",
    TSLA: "#CC0000",
    FB: "#1877F2",
    NFLX: "#E50914",
    NVDA: "#76B900",
    BABA: "#FF6F00",
    ORCL: "#F80000",
    INTC: "#0071C5",
    IBM: "#006699",
  };

  constructor(
    private investmentService: InvestmentService,
    private router: Router,
    private http: HttpClient
  ) {}

  convertTimestampToDate(seconds: number, nanoseconds: number): Date {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds);
  }

  ngOnInit() {
    this.investmentService.showSpinner;
    const uid = localStorage.getItem("uid");
    const hash = localStorage.getItem("hash");
    if (uid && hash) {
      this.investmentService.getDashboard().subscribe({
        next: (data) => {
          this.userData = data;
        },
        error: (err) =>
          (this.error = err.error.error || "Error loading dashboard"),
      });
      this.fetchTransactions(uid);
      this.fetchCryptoData();
      this.fetchStockPrices();
      // Fetch user data and stock prices from service or backend.

      // this.stockPrices = [
      //   { name: "AAPL", price: 150 },
      //   { name: "GOOGL", price: 2800 },
      //   { name: "AMZN", price: 3500 },
      //   { name: "MSFT", price: 300 },
      //   { name: "TSLA", price: 800 },
      //   { name: "FB", price: 340 },
      //   { name: "NFLX", price: 550 },
      //   { name: "NVDA", price: 220 },
      //   { name: "BABA", price: 160 },
      //   { name: "ORCL", price: 90 },
      //   { name: "INTC", price: 50 },
      //   { name: "IBM", price: 140 },
      // ];
    }
    this.investmentService.hideSpinner;
  }

  updateTawkAttributes(userEmail: string, hash: string, userName: string) {
    const interval = setInterval(() => {
      if (
        (window as any).Tawk_API &&
        typeof (window as any).Tawk_API.setAttributes === "function"
      ) {
        (window as any).Tawk_API.setAttributes(
          {
            name: userName, // Change to a display name if available
            email: userEmail,
            hash: hash,
          },
          (error: any) => {
            if (error) {
              console.error("Error updating Tawk.to attributes:", error);
            } else {
              console.log("Tawk.to attributes updated successfully.");
            }
          }
        );
        clearInterval(interval);
      }
    }, 500);
  }

  fetchTransactions(userId: string): void {
    this.investmentService.getTransactionsByUserId(userId).subscribe({
      next: (response) =>
        (this.transactions = response.map((transaction: any) => {
          const createdAtDate = this.convertTimestampToDate(
            transaction.createdAt._seconds,
            transaction.createdAt._nanoseconds
          );
          return { ...transaction, createdAt: createdAtDate };
        })),
      error: () => (this.error = "Failed to load transactions"),
    });
  }

  fetchCryptoData(): void {
    this.http
      .get<any>("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: "5",
          page: "1",
          sparkline: "true",
        },
      })
      .subscribe({
        next: (data) => {
          this.cryptoData = data.map((coin: any) => ({
            name: coin.name,
            series: coin.sparkline_in_7d.price.map(
              (price: number, index: number) => ({
                name: new Date(
                  Date.now() - (168 - index) * 60000
                ).toLocaleTimeString(),
                value: price,
              })
            ),
          }));
        },
        error: () => (this.error = "Failed to fetch crypto data"),
      });
  }

  getStockColor(stockName: string): string {
    let hash = 0;
    for (let i = 0; i < stockName.length; i++) {
      hash = stockName.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Ensure the hue is a positive number within 0-359
    const hue = Math.abs(hash) % 360;
    // Use a fixed saturation and lightness for a sleek look on a dark background.
    return `hsl(${hue}, 70%, 60%)`;
  }

  fetchStockPrices(): void {
    this.http
      .get<any>(
        "https://financialmodelingprep.com/api/v3/stock/real-time-price",
        {
          params: { apikey: "EEtqdfmFwucWeqJBCjFb8vnhGgPtdxmM" },
        }
      )
      .subscribe({
        next: (data) => {
          this.stockPrices = data.stockList.map((stock: any) => ({
            name: stock.symbol,
            price: stock.price.toFixed(2),
          }));
          console.log(this.stockPrices);
        },
        error: () => (this.error = "Failed to fetch stock prices"),
      });
  }

  navigateToDeposit(): void {
    this.router.navigate(["/deposit"]);
  }

  navigateToWithdraw(): void {
    this.router.navigate(["/withdraw"]);
  }
}

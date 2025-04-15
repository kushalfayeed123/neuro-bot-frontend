import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router"; // assuming use of Angular Router
import { InvestmentService } from "src/app/investment.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.css"],
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  error: string = "";

  constructor(
    private router: Router,
    private investmentService: InvestmentService
  ) {}

  ngOnInit(): void {
    // Replace with real API/service call as needed.
    const uid = localStorage.getItem("uid");
    if (uid) {
      this.fetchTransactions(uid);
    }
  }
  convertTimestampToDate(seconds: number, nanoseconds: number): Date {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds);
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

  goBack() {
    // Navigate back to the dashboard.
    this.router.navigate(["/dashboard"]);
  }
}

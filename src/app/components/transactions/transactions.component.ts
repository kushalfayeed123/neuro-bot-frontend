import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router"; // assuming use of Angular Router
import { InvestmentService } from "src/app/investment.service";
import { DepositService } from "src/app/services/deposit.service";

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
    private investmentService: InvestmentService,
    private depositService: DepositService
  ) {}

  ngOnInit(): void {
    this.fetchTransactions();

  }
  
  fetchTransactions(): void {
    this.depositService.getUserDeposits().subscribe({
      next: (response) =>
        (this.transactions = response.map((transaction: any) => {
          const createdAtDate = new Date(transaction.createdAt);
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

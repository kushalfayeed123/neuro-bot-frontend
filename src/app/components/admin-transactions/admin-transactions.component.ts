import { Component, OnInit } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { InvestmentService } from "src/app/investment.service";

interface Transaction {
  id: string;
  uid: string;
  type: "deposit" | "withdraw";
  amount: number;
  currency?: string;
  status: "approved" | "pending" | "rejected";
  createdAt: any;
  approvedAt?: { _seconds: number; _nanoseconds: number };
  userName?: string; // New field to store user's name
}

@Component({
  selector: "app-admin-transactions",
  templateUrl: "./admin-transactions.component.html",
  styleUrls: ["./admin-transactions.component.css"],
})
export class AdminTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  activeTab: "deposit" | "withdraw" = "deposit";
  error: string = "";

  constructor(private investmentService: InvestmentService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  convertTimestampToDate(seconds: number, nanoseconds: number): Date {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds);
  }

  async loadTransactions() {
    this.investmentService.getAllTransactions().subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.transactions = [];
          // this.loading = false;
          return;
        }
        const uniqueUserIds = [...new Set(response.map((t: any) => t.uid))];

        // Fetch user details for each unique UID
        const userRequests = uniqueUserIds.map(
          (uid: any) =>
            this.investmentService.getUserDetails(uid) as Observable<any>
        );
        forkJoin(userRequests).subscribe((users) => {
          // Create a map of UID -> user details
          const userMap = new Map(users.map((user) => [user.uid, user]));

          console.log(users);

          // // Attach user name to transactions
          this.transactions = response.map((transaction: Transaction) => ({
            ...transaction,
            userName: userMap.get(transaction.uid)?.name || "Unknown User",
          }));

          this.transactions = response.map((transaction: any) => {
            const createdAtDate = this.convertTimestampToDate(
              transaction.createdAt._seconds,
              transaction.createdAt._nanoseconds
            );
            return {
              ...transaction,
              createdAt: createdAtDate,
              userName: userMap.get(transaction.uid)?.name || "Unknown User",
            };
          });

          // this.loading = false;
        });
      },
      error: () => (this.error = "Failed to load transactions"),
    });
  }

  filteredTransactions() {
    return this.transactions.filter((t) => t.type === this.activeTab);
  }

  approveTransaction(transaction: Transaction) {
    let payload = {
      transactionId: transaction.id,
      approved: true, // set to true to approve, false to reject
    };
    transaction.status = "approved";

    this.investmentService.approveDeposit(payload).subscribe({
      next: (res) => {
        this.investmentService.getAllTransactions().subscribe();
      },
    });
  }

  denyTransaction(transaction: Transaction) {
    transaction.status = "rejected";
  }
}

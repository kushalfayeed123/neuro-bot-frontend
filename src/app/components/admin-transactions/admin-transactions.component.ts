import { Component, OnInit } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { InvestmentService } from "src/app/investment.service";
import { TransactionService } from "../../services/deposit.service";
import { Transaction } from "src/app/interfaces/transaction.interface";

@Component({
  selector: "app-admin-transactions",
  templateUrl: "./admin-transactions.component.html",
  styleUrls: ["./admin-transactions.component.css"],
})
export class AdminTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  pendingDeposits: Transaction[] = [];
  activeTab: "deposit" | "withdraw" = "deposit";
  error: string = "";
  loading: boolean = false;

  constructor(
    private investmentService: InvestmentService,
    private depositService: TransactionService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadPendingDeposits();
  }

  convertTimestampToDate(seconds: number, nanoseconds: number): Date {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds);
  }

  loadPendingDeposits() {
    this.loading = true;
    this.depositService.getPendingDeposits().subscribe({
      next: (deposits) => {
        this.pendingDeposits = deposits;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load pending deposits";
        this.loading = false;
      },
    });
  }

  async loadTransactions() {
    this.loading = true;
    this.investmentService.getAllTransactions().subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.transactions = [];
          this.loading = false;
          return;
        }
        const uniqueUserIds = [...new Set(response.map((t: any) => t.uid))];

        const userRequests = uniqueUserIds.map(
          (uid: any) =>
            this.investmentService.getUserDetails(uid) as Observable<any>
        );
        forkJoin(userRequests).subscribe((users) => {
          const userMap = new Map(users.map((user) => [user.uid, user]));

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

          this.loading = false;
        });
      },
      error: () => {
        this.error = "Failed to load transactions";
        this.loading = false;
      },
    });
  }

  filteredTransactions() {
    if (this.activeTab === "deposit") {
      // Convert pending deposits to match Transaction interface
      const convertedPendingDeposits = this.pendingDeposits.map((deposit) => ({
        ...deposit,
        type: "deposit" as const,
        userName: "Unknown User", // Default value
        currency: "Crypto", // Default value
      }));

      return [
        ...convertedPendingDeposits,
        ...this.transactions.filter(
          (t) => t.type === "deposit" && t.status !== "pending"
        ),
      ];
    }
    return this.transactions.filter((t) => t.type === this.activeTab);
  }

  approveTransaction(transaction: Transaction) {
    this.handleTransactionAction(transaction, "approve");
  }

  denyTransaction(transaction: Transaction) {
    this.handleTransactionAction(transaction, "deny");
  }

  handleTransactionAction(
    transaction: Transaction,
    action: "approve" | "deny"
  ) {
    this.loading = true;

    const approved = action === "approve";

    const onSuccess = () => {
      this.loadTransactions();
    };

    const onError = () => {
      this.error = `Failed to ${action} "transaction"}`;
      this.loading = false;
    };

    const request = approved
      ? this.depositService.approveDeposit(transaction.id)
      : this.depositService.rejectDeposit(transaction.id);

    request.subscribe({ next: onSuccess, error: onError });
  }
}

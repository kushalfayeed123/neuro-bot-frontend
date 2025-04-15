import { Component } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-withdraw",
  templateUrl: "./withdraw.component.html",
})
export class WithdrawComponent {
  // Add accountNumber and walletAddress to the withdrawData object
  withdrawData = {
    amount: 0,
    currency: "",
    accountNumber: "",
    walletAddress: "",
  };
  message: string = "";
  error: string = "";
  availableCurrencies: any[] = [];

  // Flow control: Step 1 is the form; Step 2 is the success screen.
  currentStep: number = 1;
  processingWithdrawal: boolean = false;

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {
    // Fetch currencies from API then add USD manually if not present
    this.investmentService.getCurrencies().subscribe({
      next: (data: any) => {
        // Ensure USD is included
        this.availableCurrencies = data;
        if (!this.availableCurrencies.find((c) => c.id === "USD")) {
          this.availableCurrencies.unshift({ id: "USD", name: "USD" });
        }
      },
      error: (err) =>
        (this.error = err.error.error || "Error fetching currencies"),
    });
  }

  submitWithdraw() {
    this.processingWithdrawal = true;
    this.investmentService.showSpinner();
    const uid = localStorage.getItem("uid");
    if (!uid) {
      this.error = "User not logged in";
      this.processingWithdrawal = false;
      this.investmentService.hideSpinner();
      return;
    }
    if (!this.withdrawData.currency || !this.withdrawData.amount) {
      this.error = "Please select a currency and enter an amount";
      this.processingWithdrawal = false;
      this.investmentService.hideSpinner();
      return;
    }
    // Validate based on selected currency
    if (this.withdrawData.currency === "USD") {
      if (!this.withdrawData.accountNumber) {
        this.error = "Please enter your account number for USD withdrawal";
        this.processingWithdrawal = false;
        this.investmentService.hideSpinner();
        return;
      }
    } else {
      if (!this.withdrawData.walletAddress) {
        this.error = "Please enter your destination wallet address";
        this.processingWithdrawal = false;
        this.investmentService.hideSpinner();
        return;
      }
    }
    const data = { uid, ...this.withdrawData };
    this.investmentService.withdraw(data).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = "";
        this.processingWithdrawal = false;
        this.investmentService.hideSpinner();
        // Switch to success screen
        this.currentStep = 2;
      },
      error: (err) => {
        this.error = err.error.error || "Withdrawal failed";
        this.processingWithdrawal = false;
        this.investmentService.hideSpinner();
      },
    });
  }

  restartWithdrawal() {
    // Reset all relevant properties and go back to Step 1
    this.currentStep = 1;
    this.withdrawData.amount = 0;
    this.withdrawData.currency = "";
    this.withdrawData.accountNumber = "";
    this.withdrawData.walletAddress = "";
    this.error = "";
    this.message = "";
  }

  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";
import { interval, Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-deposit",
  templateUrl: "./deposit.component.html",
})
export class DepositComponent implements OnInit, OnDestroy {
  currencies: any[] = [];
  selectedCurrency: any;
  depositAmount: number = 0;
  message: string = "";
  error: string = "";
  showCashAppModal: boolean = false; // flag for displaying the modal

  // Flow control properties
  currentStep: number = 1; // 1: Enter Amount, 2: Wallet & Transfer, 3: Complete
  countdown: number = 1200; // 20 minutes in seconds
  countdownSubscription!: Subscription;
  timeoutMessage: string = "";
  copiedCurrencyId: string | null = null;
  processingDeposit: boolean = false; // true when deposit API call is in progress

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch available currencies (wallets)
    this.investmentService.getCurrencies().subscribe({
      next: (data: any) => {
        // Sort the currencies so that "Cash App" is the first item in the list
        this.currencies = data.sort((a: any, b: any) => {
          if (a.name.toLowerCase() === "cash app") return -1;
          if (b.name.toLowerCase() === "cash app") return 1;
          return 0;
        });
      },
      error: (err) =>
        (this.error = err.error.error || "Error fetching currencies"),
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  // Step 1: User approves funding amount
  approveFunding() {
    if (!this.depositAmount || this.depositAmount <= 0) {
      this.error = "Please enter a valid deposit amount.";
      return;
    }
    this.error = "";
    this.currentStep = 2;
    // Start the 20-minute countdown
    this.countdown = 1200;
    this.timeoutMessage = "";
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.timeoutMessage =
          "Time has run out. Please reinitiate the transfer.";
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  // Step 2: User selects a wallet
  selectCurrency(currency: any) {
    // if (currency.name.toLowerCase() === "cash app") {
    //   this.showCashAppModal = true;
    //   return; // do not set as the selected currency
    // }
    this.selectedCurrency = currency;
  }

  closeCashAppModal() {
    this.showCashAppModal = false;
  }

  // Copies the wallet address, shows "Copied!" indicator, and selects the currency
  copyAddress(currency: any) {
    navigator.clipboard.writeText(currency.walletAddress).then(() => {
      this.copiedCurrencyId = currency.id;
      // Also select the currency upon copy
      this.selectedCurrency = currency;
      this.message = "Wallet address copied to clipboard!";
      setTimeout(() => {
        this.copiedCurrencyId = null;
        this.message = "";
      }, 3000);
    });
  }

  // Step 2: Confirm deposit transfer
  confirmDeposit() {
    this.processingDeposit = true;
    this.investmentService.showSpinner();
    const uid = localStorage.getItem("uid");
    if (!uid) {
      this.error = "User not logged in";
      this.processingDeposit = false;
      return;
    }
    if (!this.selectedCurrency || !this.depositAmount) {
      this.error = "Please select a currency and enter an amount";
      this.processingDeposit = false;
      return;
    }
    const depositData = {
      uid,
      amount: this.depositAmount,
      currency: this.selectedCurrency.id,
    };
    this.investmentService.deposit(depositData).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = "";
        this.processingDeposit = false;
        this.investmentService.hideSpinner();
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
        // Move to Step 3: Success screen
        this.currentStep = 3;
      },
      error: (err) => {
        this.error = err.error.error || "Deposit failed";
        this.processingDeposit = false;
        this.investmentService.hideSpinner();
      },
    });
  }

  // Step 3: Restart funding process
  restartFunding() {
    // Reset all relevant properties
    this.currentStep = 1;
    this.depositAmount = 0;
    this.selectedCurrency = null;
    this.error = "";
    this.message = "";
    this.timeoutMessage = "";
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  // Navigate to dashboard
  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}

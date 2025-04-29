import { Component } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";
import { Router } from "@angular/router";
import { Wallet, WalletService } from "src/app/services/wallet.service";
import { TransactionService } from "src/app/services/deposit.service";
import { CreateTransactionRequest } from "src/app/interfaces/create-transaction.interface";

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
    beneficiaryWalletAddress: ""
  };
  message: string = "";
  error: string = "";
  availableCurrencies: Wallet[] = [];
  

  // Flow control: Step 1 is the form; Step 2 is the success screen.
  currentStep: number = 1;
  processingWithdrawal: boolean = false;
  loadingWallets: boolean = false; // true when wallets are being fetched


  constructor(
    private investmentService: InvestmentService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.walletService.getAvailableWallets().subscribe({
      next: (wallets) => {
        console.log("Wallets loaded:", wallets);
        this.availableCurrencies = wallets;
        this.loadingWallets = false;
      },
      error: (err) => {
        console.error("Error loading wallets:", err);
        this.error =
          err.error?.message ||
          "Error fetching wallets. Please try again later.";
        this.loadingWallets = false;
      },
    });
  }

  submitWithdraw() {
    this.processingWithdrawal = true;
    this.investmentService.showSpinner();
   
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

    var payload: CreateTransactionRequest = {
      amount: this.withdrawData.amount,
      type: 'WITHDRAWAL',
      walletId: this.withdrawData.currency,
      beneficiaryAccountNumber: '',
      beneficiaryWalletAddress: this.withdrawData.walletAddress,
      txHash: ''
    
    }
    this.transactionService.createWithdrawalRequest(payload).subscribe({
      next: (res) => {
        this.message = 'Withdrawal request has been created and is currently being reviewed by the finance team';
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

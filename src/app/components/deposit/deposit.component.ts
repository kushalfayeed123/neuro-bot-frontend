import { Component, OnInit, OnDestroy } from "@angular/core";
import { InvestmentService } from "src/app/investment.service";
import { interval, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { WalletService, Wallet } from "../../services/wallet.service";
import { DepositService, CreateDepositRequest } from "../../services/deposit.service";

interface DepositTransaction {
  walletId: string;
  amount: number;
  txHash: string;
}

@Component({
  selector: "app-deposit",
  templateUrl: "./deposit.component.html",
})
export class DepositComponent implements OnInit, OnDestroy {
  Math = Math; // Add Math property to fix template error
  currencies: Wallet[] = [];
  selectedCurrency: Wallet | null = null;
  depositAmount: number = 0;
  txHash: string = "";
  message: string = "";
  error: string = "";
  showCashAppModal: boolean = false; // flag for displaying the modal
  showTransactionModal: boolean = false;

  // Flow control properties
  currentStep: number = 1; // 1: Select Wallet, 2: Enter Amount, 3: Complete
  countdown: number = 1200; // 20 minutes in seconds
  countdownSubscription!: Subscription;
  timeoutMessage: string = "";
  copiedCurrencyId: string | null = null;
  processingDeposit: boolean = false; // true when deposit API call is in progress
  loadingWallets: boolean = false; // true when wallets are being fetched

  constructor(
    private investmentService: InvestmentService,
    private walletService: WalletService,
    private depositService: DepositService,
    private router: Router
  ) {
    console.log('Deposit component constructed');
  }

  ngOnInit() {
    console.log('Deposit component initialized');
    this.loadAvailableWallets();
  }

  loadAvailableWallets() {
    this.loadingWallets = true;
    this.error = '';
    
    console.log('Loading available wallets');
    this.walletService.getAvailableWallets().subscribe({
      next: (wallets) => {
        console.log('Wallets loaded:', wallets);
        this.currencies = wallets;
        this.loadingWallets = false;
      },
      error: (err) => {
        console.error('Error loading wallets:', err);
        this.error = err.error?.message || "Error fetching wallets. Please try again later.";
        this.loadingWallets = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  // Step 1: User selects a wallet
  selectCurrency(currency: Wallet) {
    this.selectedCurrency = currency;
    this.showCashAppModal = true;
  }

  closeCashAppModal() {
    this.showCashAppModal = false;
  }

  // Step 1: Continue to amount entry after selecting wallet
  continueToAmount() {
    if (!this.selectedCurrency) {
      this.error = "Please select a wallet first";
      return;
    }
    this.currentStep = 2;
  }

  // Step 2: Show transaction details modal
  showTransactionDetails() {
    this.showCashAppModal = false;
    this.showTransactionModal = true;
  }

  closeTransactionModal() {
    this.showTransactionModal = false;
  }

  // Step 2: User approves funding amount
  approveFunding() {
    if (this.depositAmount <= 0) {
      this.error = "Please enter a valid amount";
      return;
    }

    // Start countdown timer
    this.currentStep = 3;
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdownSubscription.unsubscribe();
        this.timeoutMessage =
          "Time expired. Please restart the funding process.";
      }
    });
  }

  // Copies the wallet address, shows "Copied!" indicator, and selects the currency
  copyAddress(currency: Wallet) {
    if (currency && currency.address) {
      navigator.clipboard.writeText(currency.address);
      this.copiedCurrencyId = currency._id;
      setTimeout(() => {
        this.copiedCurrencyId = null;
      }, 2000);
    }
  }

  // Step 2: Confirm deposit transfer
  confirmDeposit() {
    if (!this.selectedCurrency) {
      this.error = "Please select a currency";
      return;
    }

    if (!this.txHash) {
      this.error = "Please enter a transaction hash or reference ID";
      return;
    }

    this.processingDeposit = true;
    this.error = "";

    const depositRequest: CreateDepositRequest = {
      walletId: this.selectedCurrency._id,
      amount: this.depositAmount,
      txHash: this.txHash
    };
    console.log(depositRequest)

    this.depositService.createDeposit(depositRequest)
      .subscribe({
        next: (response) => {
          this.processingDeposit = false;
          this.currentStep = 3;
          this.message = "Your deposit has been submitted and is pending approval.";
          
          // Stop the countdown timer
          if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
          }
        },
        error: (err) => {
          this.processingDeposit = false;
          this.error = err.error?.message || "Error processing deposit. Please try again.";
        }
      });
  }

  // Step 3: Restart funding process
  restartFunding() {
    this.currentStep = 1;
    this.depositAmount = 0;
    this.selectedCurrency = null;
    this.message = "";
    this.error = "";
    this.countdown = 1200; // Reset countdown to 20 minutes
    this.timeoutMessage = "";
  }

  // Navigate to dashboard
  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}

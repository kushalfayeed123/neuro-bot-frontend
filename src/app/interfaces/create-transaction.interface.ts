export interface CreateTransactionRequest {
    walletId?: string;
    amount: number;
    txHash?: string;
    beneficiaryAccountNumber?: string;
    beneficiaryWalletAddress?: string;
    type?: "DEPOSIT" | "WITHDRAWAL";
  }
export interface Transaction {
    id: string;
    walletId: string;
    amount: number;
    txHash: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    userName?: string;
    currency?: string;
    type?: 'deposit' | 'withdraw';
    uid?: string;
  }
  
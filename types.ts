
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  type: TransactionType;
}

export interface CategoryBudget {
  category: string;
  budget: number;
}

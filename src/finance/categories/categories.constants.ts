import { TransactionType } from '../transactions/enums/transaction-type.enum';

export const PREDEFINED_CATEGORIES = [
  // Income
  { type: TransactionType.INCOME, name: 'Salary' },
  { type: TransactionType.INCOME, name: 'Freelance' },
  { type: TransactionType.INCOME, name: 'Gifts' },
  { type: TransactionType.INCOME, name: 'Other Income' },

  // Expense: Food
  { type: TransactionType.EXPENSE, name: 'Groceries' },
  { type: TransactionType.EXPENSE, name: 'Restaurants & Cafes' },

  // Expense: Transport
  { type: TransactionType.EXPENSE, name: 'Transport' },
  { type: TransactionType.EXPENSE, name: 'Fuel' },

  // Expense: Housing
  { type: TransactionType.EXPENSE, name: 'Rent' },
  { type: TransactionType.EXPENSE, name: 'Utilities' },

  // Expense: Personal
  { type: TransactionType.EXPENSE, name: 'Shopping' },
  { type: TransactionType.EXPENSE, name: 'Health & Pharmacy' },
  { type: TransactionType.EXPENSE, name: 'Entertainment' },
  { type: TransactionType.EXPENSE, name: 'Subscriptions' },
  { type: TransactionType.EXPENSE, name: 'Education' },

  // Expense: Other
  { type: TransactionType.EXPENSE, name: 'Other Expenses' },
] as const;

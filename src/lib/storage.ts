import { v4 as uuidv4 } from 'uuid';

export interface Income {
  id: string;
  source: 'husband' | 'wife' | 'other';
  amount: number;
  date: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number; // Total allocated to this category
  spent: number;     // Total spent from this category
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
}

export interface AppData {
  incomes: Income[];
  categories: BudgetCategory[];
  transactions: Transaction[];
}

const STORAGE_KEY = 'antigravity_account_book_data';

const INITIAL_DATA: AppData = {
  incomes: [],
  categories: [
    { id: '1', name: '食費', allocated: 0, spent: 0 },
    { id: '2', name: '家賃', allocated: 0, spent: 0 },
    { id: '3', name: '光熱費', allocated: 0, spent: 0 },
    { id: '4', name: '娯楽', allocated: 0, spent: 0 },
    { id: '5', name: '貯金', allocated: 0, spent: 0 },
  ],
  transactions: [],
};

export const loadData = (): AppData => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : INITIAL_DATA;
};

export const saveData = (data: AppData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addIncome = (income: Omit<Income, 'id'>) => {
  const data = loadData();
  const newIncome = { ...income, id: uuidv4() };
  data.incomes.push(newIncome);
  saveData(data);
  return newIncome;
};

export const updateCategoryAllocation = (categoryId: string, amount: number) => {
  const data = loadData();
  const category = data.categories.find(c => c.id === categoryId);
  if (category) {
    category.allocated = amount;
    saveData(data);
  }
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
  const data = loadData();
  const newTransaction = { ...transaction, id: uuidv4() };
  data.transactions.push(newTransaction);
  
  // Update category spent amount
  const category = data.categories.find(c => c.id === transaction.categoryId);
  if (category) {
    category.spent += transaction.amount;
  }
  
  saveData(data);
  return newTransaction;
};

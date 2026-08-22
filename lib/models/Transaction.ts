import { ObjectId } from 'mongodb';

export interface TransactionItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  _id?: ObjectId;
  id: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit' | 'Kredit';
  cashier: string;
  createdAt: Date;
}

export interface TransactionInput {
  items: Omit<TransactionItem, 'subtotal'>[];
  total: number;
  paymentMethod: Transaction['paymentMethod'];
  cashier: string;
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `TRX${timestamp}${random}`;
}
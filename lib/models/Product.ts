import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
  categoryName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
}

export function generateProductId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PROD${timestamp}${random}`;
}
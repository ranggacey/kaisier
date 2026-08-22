import { ObjectId } from 'mongodb';

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export function generateCategoryId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `CAT${timestamp}${random}`;
}
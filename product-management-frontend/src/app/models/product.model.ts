import { Category } from "./category.model";

export interface Product {
  id?: number;
  name: string;
  stock: number;
  price: number;
  barcode?: string;
  category: Category;
}
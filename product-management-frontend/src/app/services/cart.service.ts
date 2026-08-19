import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { SaleRequest, SaleResponse } from '../models/sales.model';

export interface CartItem {
  product: Product;
  quantity : number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/sales';

  items = signal<CartItem[]>([]);

  total = computed(() =>
    this.items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  constructor(private http: HttpClient) { }
  
  checkout(paymentMethod: string) {
    const saleRequest : SaleRequest = {
      paymentMethod : paymentMethod,
      items: this.items().map(item => ({
        productId: item.product.id!,
        quantity: item.quantity
      }))
    };
    return this.http.post<SaleResponse>(this.apiUrl, saleRequest);
  }

  clearCart() {
    this.items.set([]);
  }
}

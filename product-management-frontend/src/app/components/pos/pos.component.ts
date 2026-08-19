import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { SafetyService } from '../../services/safety.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent implements OnInit {
  private productService = inject(ProductService);
  protected cartService = inject(CartService);
  private safetyService = inject(SafetyService);

  masterProducts: Product[] = [];
  filteredProducts: Product[] = [];

  searchInput: string = '';
  selectedPaymentMethod: string = 'CASH';
  
  lastAddedItem = signal<{ name: string; quantity: number; price: number } | null>(null);

  // Layout alerts and validation states
  safetyReport = signal<string | null>(null);
  isLoadingSafety = signal<boolean>(false);
  uiAlert = signal<string | null>(null);
  private alertTimeout: any = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  private showUiAlert(message: string): void {
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    this.uiAlert.set(message);
    this.alertTimeout = setTimeout(() => this.uiAlert.set(null), 4000);
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.masterProducts = data;
        this.filteredProducts = [];
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  onSearchChange(): void {
    let query = this.searchInput.trim().toLowerCase();

    if (!query) {
      this.filteredProducts = [];
      return;
    }
    
    let quantityToAdd = 1;
    
    if (query.includes('*')) {
      const parts = query.split('*');
      const parsedQty = parseInt(parts[0], 10);
      
      if (!isNaN(parsedQty) && parsedQty > 0) {
        quantityToAdd = parsedQty;
        query = parts[1].trim(); 
      }
    }

    const barcodeMatch = this.masterProducts.find(
      p => p.barcode && p.barcode.toLowerCase() === query
    );

    if (barcodeMatch) {
      this.handleProductAddition(barcodeMatch, quantityToAdd);
      this.searchInput = ''; 
      this.filteredProducts = [];
      return;
    }

    this.filteredProducts = this.masterProducts.filter(p =>
      p.name.toLowerCase().includes(query)
    );
  }

  selectProduct(product: Product): void {
    this.handleProductAddition(product, 1);
    this.searchInput = ''; 
    this.filteredProducts = []; 
  }

  private handleProductAddition(product: Product, quantity: number): void {
    const currentItems = this.cartService.items();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const targetQuantity = currentQtyInCart + quantity;

    if (product.stock < targetQuantity) {
      this.showUiAlert(`⚠️ Cannot add ${quantity} x ${product.name}. Only ${product.stock - currentQtyInCart} left in stock!`);
      return;
    }

    if (existingItem) {
      this.cartService.items.update(items => items.map(item =>
        item.product.id === product.id ? { ...item, quantity: targetQuantity } : item
      ));
    } else {
      this.cartService.items.update(items => [...items, { product, quantity }]);
    }

    this.lastAddedItem.set({ name: product.name, quantity: targetQuantity, price: product.price });
  }

  updateQty(product: Product, newQty: number): void {
    if (newQty <= 0) {
      this.cartService.items.update(items => items.filter(item => item.product.id !== product.id));
      this.lastAddedItem.set(null);
      return;
    }
    
    if (newQty > product.stock) {
      this.showUiAlert(`⚠️ Cannot exceed available stock limit. Maximum available items: ${product.stock}`);
      return;
    }

    this.cartService.items.update(items => items.map(item =>
      item.product.id === product.id ? { ...item, quantity: newQty } : item
    ));

    this.lastAddedItem.set({ name: product.name, quantity: newQty, price: product.price });
  }

  handleCheckout(): void {
    const currentItems = this.cartService.items();

    if (currentItems.length === 0) {
      this.showUiAlert('🛒 Your shopping cart is completely empty!');
      return;
    }

    if (currentItems.length < 2) {
      this.executeFinalSale();
      return;
    }

    const productNames = currentItems.map(item => item.product.name);

    this.isLoadingSafety.set(true);
    this.safetyReport.set(null);

    this.safetyService.checkCartSafety(productNames).subscribe({
      next: (response: string) => {
        this.isLoadingSafety.set(false);
        
        // Clean up response: lowercase and remove any stray spaces/punctuation
        const cleanResponse = response.trim().toLowerCase().replace(/[^a-z]/g, '');

        
        if (cleanResponse === 'safe') {
          this.executeFinalSale();
        } else {
          this.safetyReport.set("⚠️ Potential drug interaction or duplication detected. Please review with the customer before completing checkout."); 
        }
      },
      error: (err) => {
        this.isLoadingSafety.set(false);
        console.error('Safety guardrail connection dropped', err);
        this.safetyReport.set("⚠️ Safety check system offline. Manual verification required.");
      }
    });
  }

  executeFinalSale(): void {
    this.safetyReport.set(null);

    this.cartService.checkout(this.selectedPaymentMethod).subscribe({
      next: (response) => {
        this.showUiAlert(`🎉 Success: ${response.message || 'Sale processed successfully!'}`);
        this.cartService.clearCart();
        this.lastAddedItem.set(null);
      },
      error: (err) => {
        this.showUiAlert('❌ Error completing sale: ' + (err.error?.message || err.message));
      }
    });
  }

  clearSafetyReport(): void {
    this.safetyReport.set(null);
  }
}
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService} from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

  @Input() product: Product = { name: '', stock: 0, price: 0, barcode: '', category: { id: 0,name:''} };
  @Input() categories: Category[] = []
  @Input() isEditMode = false;

  @Output() saved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  save() {
    const request = this.isEditMode
      ? this.productService.update(this.product)
      : this.productService.add(this.product);

    request.subscribe({
      next: () => {
        this.saved.emit(); 

        if (!this.isEditMode) {
          this.product = { name: '', stock: 0, price: 0 , barcode: '', category: { id: 0, name:''}};
        }
      },
      error: (err) => {
        console.error('Error saving product:', err);
      }
    });
  }

  cancel() {
    this.canceled.emit();
  }
}
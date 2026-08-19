import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // Added ActivatedRoute and Router
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductFormComponent,
    AppModalComponent,
    DeleteConfirmationModalComponent,
    RouterModule
],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  activeFilter = '';

  showModal = false;
  modalTitle = '';
  currentProduct: Product | null = null;
  isEditMode = false;


  showDeleteModal = false;
  productToDelete: Product | null = null;


  showSuccess = false;
  successMessage = '';
  lowStockLimit: number;
  searchTerm: string = '';
  private searchingSubject = new Subject<string>();
  viewMode: 'grid' | 'list' = 'grid'


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lowStockLimit = this.productService.LOW_STOCK_THRESHOLD;
    this.searchingSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    })
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchingSubject.next(value);
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;

        this.route.queryParams.subscribe(params => {
          this.activeFilter = params['filter'] || '';
          this.applyFilters();
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }


  applyFilters() {
    let filtered = [...this.products];

    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.activeFilter === 'low') {
      this.filteredProducts = this.products.filter(p => p.stock <= this.lowStockLimit);
    } 
      this.filteredProducts = filtered;
  }

  ngOnDestroy() {
    this.searchingSubject.complete();
  }

  clearFilter() {
    this.router.navigate([], { queryParams: { filter: null }, queryParamsHandling: 'merge' });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Error loading categories:', err)
    })
  }


  openAddModal() {
    this.modalTitle = 'Add New Product';
    this.currentProduct = { name: '', stock: 0, price: 0, category: { id: 0, name: '' } };
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(p: Product) {
    this.isEditMode = true;
    this.modalTitle = 'Edit Product';
    this.currentProduct = {
      ...p,
      category: p.category ? { ...p.category } : { id: 0, name: '' }
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentProduct = null;
  }

  onProductSaved() {
    this.showSuccessMessage(
      this.isEditMode ? 'Product updated successfully!' : 'Product added successfully!'
    );
    this.loadProducts();
    if (this.isEditMode) {
      this.closeModal();
    }
  }

  
  openDeleteModal(p: Product) {
    this.productToDelete = p;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete?.id) {
      this.productService.delete(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.showSuccessMessage('Product deleted successfully!');
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.showSuccessMessage('Error deleting product');
          this.closeDeleteModal();
        }
      });
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }
}
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Category } from '../../models/category.model';
import {CategoryService } from '../../services/category.service';

import { FormsModule } from '@angular/forms';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, AppModalComponent, DeleteConfirmationModalComponent],
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []
  loading = false;
  showModal = false;
  modalTitle = '';
  isEditMode = false;
  currentCategory: Category | null = null ;
  categoryToDelete: Category | null = null;
  showSuccess = false;
  showDeleteModal = false;
  successMessage = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.modalTitle = 'Add New Category';
    this.currentCategory = { name: ''} ;
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditMode = true;
    this.modalTitle = 'Edit Category';
    this.currentCategory = { ...cat };
    this.showModal = true;
  }

  saveCategory() {
    if (!this.currentCategory || !this.currentCategory.name.trim()) return;

    if (this.isEditMode) {
      this.categoryService.update(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.showModal = false;
          this.showSuccessMessage('Category updated!');
        }
      });
    } else {
      this.categoryService.create(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.showModal=false;
          this.showSuccessMessage('Category created!')
        }
      });
    }
  }

  openDeleteModal(cat: Category) {
  this.categoryToDelete = cat;
  this.showDeleteModal = true;
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.categoryToDelete = null;
}

confirmDelete() {
  if (this.categoryToDelete?.id) {
    this.categoryService.delete(this.categoryToDelete.id).subscribe({
      next: () => {
        this.loadCategories();
        this.showSuccessMessage('Category deleted successfully!');
        this.closeDeleteModal(); 
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.closeDeleteModal();
      }
    });
  }
}

  showSuccessMessage(msg: string) {
    this.successMessage = msg;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000)
  }

  getCategoryColor(id: number | undefined): string {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return id ? colors[id % colors.length] : colors[0];
  }

}

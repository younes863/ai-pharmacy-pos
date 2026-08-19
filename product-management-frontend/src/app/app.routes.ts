import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';  // adjust path
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { PosComponent } from './components/pos/pos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: 'inventory', component: ProductListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoryListComponent},
  { path: 'pos', component: PosComponent}
];
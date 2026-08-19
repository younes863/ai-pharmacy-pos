import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service'; // Import this!
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalValue = 0;
  lowStockCount = 0;
  chart: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService // Inject CategoryService
  ) { }

  ngOnInit() {
    // 1. Get Categories first, then Products
    this.categoryService.getAll().subscribe(categories => {
      this.productService.getAll().subscribe(products => {
        this.renderChart(categories, products);

        // Update your other stats too
        this.totalProducts = products.length;
        this.totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
        this.lowStockCount = products.filter(p => p.stock <= this.productService.LOW_STOCK_THRESHOLD).length;
      });
    });
  }

  renderChart(categories: Category[], products: any[]) {
    const categoryMap: { [key: number]: string } = {};

    categories.forEach(cat => {
      if (cat.id !== undefined) {
        categoryMap[cat.id] = cat.name;
      }
    });

    const chartData: { [key: string]: number } = {};
    categories.forEach(cat => chartData[cat.name] = 0);

    products.forEach(p => {
      const catId = p.category?.id || p.categoryId;
      const name = categoryMap[catId] || 'Others';

      chartData[name] += p.stock;
    });

    const colorPalette = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
      '#06b6d4'
    ]

    if (this.chart) this.chart.destroy();

    this.chart = new Chart('stockChart', {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Units in Stock',
          data: Object.values(chartData),
          backgroundColor: colorPalette,
          borderColor: colorPalette.map(color => color),
          borderWidth: 1,
          borderRadius: 8,
          maxBarThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}
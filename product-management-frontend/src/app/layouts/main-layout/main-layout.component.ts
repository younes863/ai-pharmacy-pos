import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';          // ← add this
import { MatToolbarModule } from '@angular/material/toolbar';          // ← add this
import { MatListModule } from '@angular/material/list';                // ← add this
import { MatIconModule } from '@angular/material/icon';                // ← add this (for icons)
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    RouterLinkActive
],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
}
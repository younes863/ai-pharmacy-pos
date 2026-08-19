import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './app-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent {

  @Input() title = 'Modal Title';
  @Input() show = false;

  @Output() close = new EventEmitter<void>();
  // Removed confirm — not needed anymore

  onClose() {
    this.close.emit();
  }
}
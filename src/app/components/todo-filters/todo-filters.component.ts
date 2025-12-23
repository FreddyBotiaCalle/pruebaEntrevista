import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';

export type FilterType = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, IonSearchbar, IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss'],
})
export class TodoFiltersComponent {
  @Input() searchTerm: string = '';
  @Input() filterType: FilterType = 'all';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() filterTypeChange = new EventEmitter<FilterType>();

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchTermChange.emit(value);
  }

  onFilterChange(value: any) {
    const filterValue = value as FilterType;
    if (filterValue && ['all', 'pending', 'completed'].includes(filterValue)) {
      this.filterType = filterValue;
      this.filterTypeChange.emit(filterValue);
    }
  }
}

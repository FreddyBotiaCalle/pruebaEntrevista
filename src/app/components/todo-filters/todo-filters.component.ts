import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';

export type FilterType = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption],
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss'],
})
export class TodoFiltersComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Input() filterType: FilterType = 'all';
  @Input() selectedCategoryId: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() filterTypeChange = new EventEmitter<FilterType>();
  @Output() categoryFilterChange = new EventEmitter<string>();

  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {}

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

  onCategoryFilterChange(value: string) {
    this.selectedCategoryId = value;
    this.categoryFilterChange.emit(value);
  }
}

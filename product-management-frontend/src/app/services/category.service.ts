import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/getAll`);
  }

  update(category: Category) : Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update`, category);
  }

  create(category: Category) : Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/add`, category);
  }

  delete(id: number) : Observable<String> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`);
  }

}

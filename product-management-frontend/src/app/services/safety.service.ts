import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {
  private apiUrl = 'http://localhost:8080/safety/check';

  constructor(private http: HttpClient) {}

  checkCartSafety(productNames: string[]): Observable<string> {
    return this.http.post(this.apiUrl, productNames, { responseType: 'text' });
  }
}
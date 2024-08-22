import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl = 'https://localhost:5231/api/User/log-page-visit';

  constructor(private http: HttpClient) {}

  logPageVisit(pageUrl: string) {
    return this.http.post(this.apiUrl, { pageUrl }).subscribe(
      (response) => console.log('Page visit logged successfully'),
      (error) => console.error('Error logging page visit', error)
    );
  }
}

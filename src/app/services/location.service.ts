import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:8080/api/locations';

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }
}

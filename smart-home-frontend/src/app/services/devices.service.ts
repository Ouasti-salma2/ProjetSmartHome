/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private apiUrl = 'http://localhost:5001/api/Devices';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createDevice(device: any): Observable<any> {
    return this.http.post(this.apiUrl, device, { headers: this.getHeaders() });
  }

  toggleDevice(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/toggle`, {}, { headers: this.getHeaders() });
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface pour typer les devices
export interface Device {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  status: string;
  temperature?: number;
  location: string;
  userId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  // URL de l'API .NET
  private apiUrl = 'http://localhost:5001/api/Devices';

  constructor(private http: HttpClient) {}

  // Récupérer les headers avec le token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ GET - Récupérer tous les devices de l'utilisateur
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // ✅ POST - Créer un nouveau device
  createDevice(device: Partial<Device>): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, device, {
      headers: this.getHeaders()
    });
  }

  // ✅ POST - Toggle ON/OFF d'un device
  toggleDevice(id: number): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/${id}/toggle`, {}, {
      headers: this.getHeaders()
    });
  }

  // ✅ PUT - Mettre à jour un device
  updateDevice(id: number, device: Partial<Device>): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device, {
      headers: this.getHeaders()
    });
  }

  // ✅ DELETE - Supprimer un device
  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

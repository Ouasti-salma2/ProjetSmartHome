import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from '../Models/models';

@Injectable({ providedIn: 'root' })
export class EquipementService {
  private apiUrl = 'http://localhost:5297/api/equipements';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(this.apiUrl);
  }

  getByPiece(idPiece: number): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(`${this.apiUrl}/piece/${idPiece}`);
  }

  getById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Condition, ConditionCreate } from '../Models/models';

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private apiUrl = 'http://localhost:5297/api/conditions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Condition[]> {
    return this.http.get<Condition[]>(this.apiUrl);
  }

  getByEquipement(idEquipement: number): Observable<Condition[]> {
    return this.http.get<Condition[]>(`${this.apiUrl}/equipement/${idEquipement}`);
  }

  create(condition: ConditionCreate): Observable<Condition> {
    return this.http.post<Condition>(this.apiUrl, condition);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
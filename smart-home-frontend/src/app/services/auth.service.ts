/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, name });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): any {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}*/
/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ URL du backend .NET (port 5001)
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  // ✅ MÉTHODE REGISTER
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name: name,
      email: email,
      password: password
    });
  }

  // ✅ MÉTHODE LOGIN (garde ta signature avec 2 paramètres)
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      password: password
    }).pipe(
      tap((response: any) => {
        // Stocker le token retourné par .NET
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // ✅ MÉTHODE GETUSER - Décoder le JWT pour récupérer les infos
  getUser(): any {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      // Décoder le JWT (partie payload)
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      // .NET encode les claims avec des noms spécifiques
      return {
        id: decodedPayload.nameid || decodedPayload.sub,
        email: decodedPayload.email || decodedPayload.Email,
        name: decodedPayload.name || decodedPayload.Name || decodedPayload.unique_name
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // ✅ MÉTHODE GETTOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ MÉTHODE ISLOGGEDIN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ MÉTHODE LOGOUT
  logout(): void {
    localStorage.removeItem('token');
  }

  // ✅ MÉTHODE POUR RÉCUPÉRER LES HEADERS AVEC TOKEN
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  register(name: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      name,    // ⬅️ name en premier
      email,   // ⬅️ email en deuxième
      password // ⬅️ password en troisième
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

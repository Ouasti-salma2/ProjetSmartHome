

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie !', response);
        console.log(' Token reçu:', response.token);

        // SAUVEGARDE LE TOKEN
        localStorage.setItem('token', response.token);

        // SAUVEGARDE L'UTILISATEUR
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log(' Utilisateur sauvegardé:', response.user);
        }

        this.successMessage = 'Connexion réussie ! Redirection...';
        this.isLoading = false;

        // REDIRECTION VERS
        console.log(' Redirection vers /dashboard...');
        this.router.navigate(['/dashboard']).then(() => {
          console.log(' Navigation terminée');
        });
      },
      error: (error) => {
        console.error(' Erreur de connexion', error);
        this.errorMessage = error.error?.error || 'Identifiants invalides';
        this.isLoading = false;
      }
    });
  }
}

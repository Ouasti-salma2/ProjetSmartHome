/*import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component'; //  AJOUTER
import { authGuard } from './guards/auth.guard'; // ← AJOUTER EN HAUT
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] }, //  AJOUTER CETTE LIGNE
  { path: 'dashboard', component: DashboardComponent }
];*/
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, //  ENLEVER canActivate
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] } //  METTRE LE GUARD ICI
];

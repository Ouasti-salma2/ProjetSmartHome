
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  //  Utiliser 'token' au lieu de 'jwt'
  const token = localStorage.getItem('token');

  if (token) {
    console.log(' Token trouvé, accès autorisé');
    return true;
  } else {
    console.log('Pas de token, redirection vers page login');
    router.navigate(['/login']);
    return false;
  }
};

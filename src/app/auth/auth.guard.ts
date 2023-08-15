import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { of } from 'rxjs';
import { authService } from './auth.service';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authSF = inject(authService);
  // const store = inject(Store<AppState>);
  const router = inject(Router);
  let isAuth = false;
  let test;
  try {
    test =
      authSF.getisAuthenticated() == true
        ? true
        : router.navigate(['/auth/login']);
  } catch (e) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  return test;
};

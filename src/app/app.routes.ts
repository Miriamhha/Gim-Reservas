import { Routes } from '@angular/router';
import { ReservaComponent } from './reserva';
import { LoginComponent } from './components/login/login';
import { Content } from './components/content/content';

export const routes: Routes = [
  { path: '', component: Content },
  // { path: 'registrar', component: LoginComponent },
  { path: 'mis-reservas', component: ReservaComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
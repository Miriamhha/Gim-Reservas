import { Routes } from '@angular/router';
import { AppComponent } from './app';

import { ReservaComponent } from './reserva';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'mis-reservas', component: ReservaComponent },
];


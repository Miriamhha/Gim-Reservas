
import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { MisReservas } from './pages/misreservas/mis-reservas';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'mis-reservas', component: MisReservas },
];

import { Routes } from '@angular/router';
import { ReservaComponent } from './components/reserva/reserva';
import { LoginComponent } from './components/login/login';
import { Content } from './components/content/content';
import { Register } from './components/register/register';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario';

export const routes: Routes = [
  { path: '', component: Content },
  // { path: 'registrar', component: LoginComponent },
  { path: 'mis-reservas', component: ReservaComponent },
    { path: 'registrar', component: Register },
  { path: 'login', component: LoginComponent },
  //{ path: 'inicio-usuario', loadComponent: () => import('./components/reserva/reserva').then(m => m.ReservaComponent) },
  { path: 'inicio-usuario', component: InicioUsuarioComponent },
  { path: 'panel-admin', loadComponent: () => import('./components/admin/panel-admin').then(m => m.PanelAdminComponent) },
  { path: '**', redirectTo: '' }
];
// import { Component } from '@angular/core';
// import {CommonModule} from '@angular/common';
// import { RouterLink } from '@angular/router'; // ✅ IMPORTANTE

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './header.html',
//   styleUrl: './header.css'
// })
// export class Header {
//   menuAbierto = false;
//   toggleMenu() {
//     this.menuAbierto = !this.menuAbierto;   
//   }
//   scrollTo(id: string) {
//     console.log(id);
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: 'smooth' });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  menuAbierto = false;
  usuarioNombre: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // ✅ Cargar usuario desde localStorage al iniciar
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.usuarioNombre = usuario?.nombre || null;
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  async cerrarSesion() {
    try {
      await this.authService.logout();
      localStorage.removeItem('usuario');
      this.usuarioNombre = null;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

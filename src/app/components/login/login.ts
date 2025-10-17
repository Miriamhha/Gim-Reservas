// src/app/login.ts  (o login.component.ts si tu CLI lo generó con ese nombre)
// import { Component, inject } from '@angular/core';
// import { CommonModule, AsyncPipe } from '@angular/common';
// import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState } from '@angular/fire/auth';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, AsyncPipe],
//   templateUrl: './login.html'
// })
// export class LoginComponent {
//   private auth = inject(Auth);
//   user$: Observable<any | null> = authState(this.auth);

//   async login() {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(this.auth, provider);
//     } catch (err) {
//       console.error('Login error', err);
//       alert('Error en el login: ' + (err as Error).message);
//     }
//   }

//   async logout() {
//     try {
//       await signOut(this.auth);
//     } catch (err) {
//       console.error('Logout error', err);
//     }
//   }
// }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   mensaje = '';
//   cargando = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   async iniciarSesion() {
//     try {
//       this.cargando = true;
//       this.mensaje = '';

//       const usuario = await this.authService.login(this.email, this.password);

//       // Mostrar mensaje de bienvenida
//       this.mensaje = `¡Bienvenido ${usuario.nombre}!`;

//       // Guardar usuario en localStorage
//       localStorage.setItem('usuario', JSON.stringify(usuario));

//       // Redirigir a página principal o dashboard
//       setTimeout(() => this.router.navigate(['/inicio-usuario']), 1500);
//     } catch (error: any) {
//       this.mensaje = error.message || 'Error al iniciar sesión.';
//     } finally {
//       this.cargando = false;
//     }
//   }

//   async iniciarConGoogle() {
//     try {
//       this.cargando = true;
//       const usuario = await this.authService.loginConGoogle();

//       this.mensaje = `¡Bienvenido ${usuario.nombre}!`;
//       localStorage.setItem('usuario', JSON.stringify(usuario));

//       setTimeout(() => this.router.navigate(['/inicio-usuario']), 1500);
//     } catch (error: any) {
//       this.mensaje = error.message || 'Error al iniciar con Google.';
//     } finally {
//       this.cargando = false;
//     }
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  mensaje = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  // 🔹 INICIAR SESIÓN CON EMAIL Y PASSWORD
  async iniciarSesion() {
    try {
      this.cargando = true;
      this.mensaje = '';

      const usuario: Usuario = await this.authService.login(this.email, this.password);

      // Mostrar mensaje de bienvenida
      this.mensaje = `¡Bienvenido ${usuario.nombre}!`;

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir según el rol
      setTimeout(() => {
        if (usuario.rol === 'admin') {
          this.router.navigate(['/panel-admin']);
        } else {
          this.router.navigate(['/inicio-usuario']);
        }
      }, 1500);
    } catch (error: any) {
      this.mensaje = error.message || 'Error al iniciar sesión.';
    } finally {
      this.cargando = false;
    }
  }

  // 🔹 INICIAR SESIÓN CON GOOGLE
  async iniciarConGoogle() {
    try {
      this.cargando = true;
      this.mensaje = '';

      const usuario: Usuario = await this.authService.loginConGoogle();

      this.mensaje = `¡Bienvenido ${usuario.nombre}!`;

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir según el rol
      setTimeout(() => {
        if (usuario.rol === 'admin') {
          this.router.navigate(['/panel-admin']);
        } else {
          this.router.navigate(['/inicio-usuario']);
        }
      }, 1500);
    } catch (error: any) {
      this.mensaje = error.message || 'Error al iniciar con Google.';
    } finally {
      this.cargando = false;
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.error = '';
    try {
      // 🔹 Registrar usuario y actualizar BehaviorSubject
      await this.authService.registrar(this.nombre, this.email, this.password);

      // 🔹 Redirigir a inicio-usuario
      this.router.navigate(['/inicio-usuario']);
    } catch (e: any) {
      this.error = e.message || 'Error al registrar';
    }
  }
}

// src/app/login.ts  (o login.component.ts si tu CLI lo generó con ese nombre)
import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './login.html'
})
export class LoginComponent {
  private auth = inject(Auth);
  user$: Observable<any | null> = authState(this.auth);

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (err) {
      console.error('Login error', err);
      alert('Error en el login: ' + (err as Error).message);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (err) {
      console.error('Logout error', err);
    }
  }
}

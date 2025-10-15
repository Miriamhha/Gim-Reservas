// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Firestore, collectionData, collection } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { LoginComponent } from './login';     
// import { ReservaComponent } from './reserva'

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, LoginComponent, ReservaComponent], 
//   templateUrl: './app.html',
// })
// export class AppComponent {
//   items$: Observable<any[]>;

//   constructor(private firestore: Firestore) {
//     // 👇 Conecta a la colección 'prueba' o la que quieras
//     const ref = collection(this.firestore, 'reservas');
//     this.items$ = collectionData(ref, { idField: 'id' });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { ReservasService } from './services/reservas';
import { Router } from '@angular/router';
import { Header } from './components/header/header';
import { Footer} from './components/footer/footer';
import { Content } from "./components/content/content";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Footer, Header, Content],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  reservas: any[] = [];
  user: any = null;

  constructor(
    private reservasService: ReservasService,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    // Detectar si hay usuario logueado
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        this.cargarReservas();
      } else {
        this.reservas = [];
      }
    });
  }

  // Iniciar sesión con Google
  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      console.log('✅ Sesión iniciada');
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await signOut(this.auth);
      console.log('👋 Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }

  // Cargar reservas desde Firestore
  cargarReservas() {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        console.log('✅ Reservas cargadas:', data);
      },
      error: (err) => console.error('❌ Error al cargar reservas:', err),
    });
  }

  // Reservar horario
  async reservarHorario(reserva: any) {
    if (!this.user) {
      alert('Por favor inicia sesión con Google antes de reservar');
      return;
    }

    try {
      // 1️⃣ Guardar la reserva del usuario
      const reservasUsuarioRef = collection(this.firestore, 'ReservasUsuarios');
      await addDoc(reservasUsuarioRef, {
        id: this.user.uid,
        nombreUsuario: this.user.displayName,
        email: this.user.email,
        tipo: reserva.tipo,
        fecha: reserva.fecha,
        hora: reserva.hora,
        idHorario: reserva.id,
        creada: new Date()
      });

      // 2️⃣ Actualizar el número de cupos
      await this.reservasService.actualizarCupo(
        reserva.id,
        reserva.inscritos,
        reserva.capacidadMax
      );

      // 3️⃣ Mostrar mensaje y redirigir
      alert('✅ Reserva realizada correctamente.');
      this.cargarReservas(); // refresca los cupos en pantalla
      this.router.navigate(['/mis-reservas']); // redirige a pantalla del usuario
    } catch (error) {
      console.error('❌ Error al guardar la reserva:', error);
      alert('Ocurrió un error al reservar. Intenta nuevamente.');
    }
  }
}




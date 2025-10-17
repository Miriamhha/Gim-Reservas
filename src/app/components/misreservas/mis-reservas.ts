import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { ReservasService } from '../../services/reservas';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reservas.html',
})
export class ReservaComponent {
  reservas: any[] = [];              // Clases disponibles
  reservasUsuario: any[] = [];       // Clases reservadas por el usuario
  user: any = null;

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private reservasService = inject(ReservasService);

  ngOnInit() {
    // Detectar usuario logueado y cargar clases disponibles
    onAuthStateChanged(this.auth, async (user) => {
      this.user = user;
      await this.cargarReservas();
      if (user) await this.verMisReservas();
    });
  }

  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(this.auth, provider); } 
    catch(err){ console.error(err); alert('Error login: '+(err as Error).message); }
  }

  async logout() {
    try { 
      await signOut(this.auth); 
      this.user = null;
      this.reservasUsuario = [];
    } catch(err){ console.error(err); }
  }

  // Cargar todas las clases disponibles
  async cargarReservas() {
    try {
      this.reservas = await this.reservasService.getReservas();
    } catch(err) { console.error('Error cargando clases disponibles:', err); }
  }

  // Reservar una clase
  async reservarHorario(reserva: any) {
    if(!this.user) { alert('Inicia sesión primero'); return; }

    try {
      await this.reservasService.reservar(reserva, this.user);
      alert('Reserva realizada ✅');
      await this.cargarReservas();       // refrescar clases disponibles
      await this.verMisReservas();       // refrescar mis reservas
    } catch(err) { console.error(err); alert('Error al reservar'); }
  }

  // Ver las reservas del usuario
  async verMisReservas() {
    if(!this.user) return;

    try {
      const reservasRef = collection(this.firestore, 'ReservasUsuarios');
      const q = query(reservasRef, where('id', '==', this.user.uid));
      const querySnapshot = await getDocs(q);

      this.reservasUsuario = querySnapshot.docs.map(doc => doc.data());
    } catch(err) {
      console.error('Error cargando mis reservas:', err);
    }
  }
}

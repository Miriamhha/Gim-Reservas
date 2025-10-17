// src/app/reserva.ts  (o reserva.component.ts)
import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { serverTimestamp } from 'firebase/firestore';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './reserva.html'
})
export class ReservaComponent {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  form = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    descripcion: ['']
  });

  reservas$: Observable<any[]> = of([]);

  constructor() {
    this.reservas$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        const colRef = collection(this.firestore, 'reservas');
        const q = query(colRef, where('userId', '==', user.uid), orderBy('fecha', 'asc'), orderBy('hora', 'asc'));
        return collectionData(q, { idField: 'id' }) as Observable<any[]>;
      })
    );
  }

  async onSubmit() {
    const user = this.auth.currentUser;
    if (!user) {
      alert('Inicia sesión para reservar');
      return;
    }

    const { fecha, hora, descripcion } = this.form.value;
    try {
      await addDoc(collection(this.firestore, 'reservas'), {
        userId: user.uid,
        userEmail: user.email,
        fecha,
        hora,
        descripcion,
        estado: 'pendiente',
        createdAt: serverTimestamp()
      });
      this.form.reset();
    } catch (err) {
      console.error('Error creando reserva', err);
      alert('Error al crear reserva');
    }
  }
}

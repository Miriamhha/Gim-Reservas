import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ReservasService {
  constructor(private firestore: Firestore) {}

  getReservas(): Observable<any[]> {
    const reservasRef = collection(this.firestore, 'Reserva-gym');
    return collectionData(reservasRef, { idField: 'id' });
  }

  async actualizarCupo(id: string, inscritos: number, capacidadMaxima: number) {
    const reservaRef = doc(this.firestore, `Reserva-gym/${id}`);
    const nuevoValor = inscritos + 1;
    const nuevoEstado = nuevoValor >= capacidadMaxima ? 'lleno' : 'disponible';

    await updateDoc(reservaRef, {
      inscritos: nuevoValor,
      estado: nuevoEstado
    });
  }
}

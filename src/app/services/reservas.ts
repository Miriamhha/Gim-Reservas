import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private firestore = inject(Firestore);

  // Obtener clases disponibles
  async getReservas(): Promise<any[]> {
    const reservasRef = collection(this.firestore, 'Clases');
    const snapshot = await getDocs(reservasRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Reservar una clase para un usuario
  async reservar(reserva: any, user: any) {
    const reservasUsuarioRef = collection(this.firestore, 'ReservasUsuarios');
    await addDoc(reservasUsuarioRef, {
      id: user.uid,
      nombreUsuario: user.displayName,
      email: user.email,
      tipo: reserva.tipo,
      fecha: reserva.fecha,
      hora: reserva.hora,
      idHorario: reserva.id,
      creada: new Date()
    });

    // Actualizar cupos de la clase
    await this.actualizarCupo(reserva.id, reserva.inscritos, reserva.capacidadMax);
  }

  // Actualizar cupos disponibles de la clase
  async actualizarCupo(idClase: string, inscritos: number, capacidadMax: number) {
    if(inscritos < capacidadMax) {
      const claseDoc = doc(this.firestore, `Clases/${idClase}`);
      await updateDoc(claseDoc, { inscritos: inscritos + 1 });
    } else {
      throw new Error('No hay cupos disponibles');
    }
  }
}

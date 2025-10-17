// src/app/services/reservas.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export interface Clase {
  id?: string;
  tipo: string;
  instructor: string;
  fecha: string;
  hora: string;
  capacidadMax: number;
  inscritos: string[]; // IDs de usuarios
  estado: string;
}

export interface Reserva {
  id?: string;
  tipo: string;
  instructor: string;
  fecha: string;
  hora: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private clasesRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.clasesRef = collection(this.firestore, 'Reservas-gym');
  }

  // 🔹 Obtener todas las clases disponibles
  getClasesDisponibles(): Observable<Clase[]> {
    return from(getDocs(this.clasesRef)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Clase) }))
      )
    );
  }

  // 🔹 Obtener reservas de un usuario
  getReservasUsuario(usuarioId: string): Observable<Reserva[]> {
    return from(getDocs(this.clasesRef)).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => ({ id: doc.id, ...(doc.data() as Clase) }))
          .filter(clase => clase.inscritos.includes(usuarioId))
          .map(clase => ({
            id: clase.id,
            tipo: clase.tipo,
            instructor: clase.instructor,
            fecha: clase.fecha,
            hora: clase.hora,
            estado: clase.estado
          }))
      )
    );
  }

  // 🔹 Reservar clase para un usuario
  async reservarClase(usuarioId: string, clase: Clase): Promise<void> {
    if (clase.inscritos.length >= clase.capacidadMax) {
      throw new Error('La clase ya está llena');
    }

    const claseDoc = doc(this.firestore, 'Reservas-gym', clase.id!);
    const inscritosActuales = clase.inscritos || [];

    if (inscritosActuales.includes(usuarioId)) {
      throw new Error('Ya estás inscrito en esta clase');
    }

    inscritosActuales.push(usuarioId);

    await updateDoc(claseDoc, { inscritos: inscritosActuales });
  }

  // 🔹 Crear nueva clase (solo admin)
  async crearClase(nuevaClase: Omit<Clase, 'id' | 'inscritos' | 'estado'>): Promise<void> {
    const clase: Clase = {
      ...nuevaClase,
      inscritos: [],
      estado: 'disponible'
    };
    await addDoc(this.clasesRef, clase);
  }
}

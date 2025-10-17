import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdminComponent implements OnInit {
  clase = {
    tipo: 'grupal',
    instructor: '',
    fecha: '',
    hora: '',
    capacidadMax: 1,
    estado: 'disponible',
    inscritos: 0
  };

  clases$: Observable<any[]> | undefined;
  mensaje = '';
  cargando = false;
  editandoId: string | null = null;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const reservasRef = collection(this.firestore, 'Reservas-gym');
    this.clases$ = collectionData(reservasRef, { idField: 'id' });
  }

  async crearClase() {
    try {
      this.cargando = true;
      this.mensaje = '';

      if (!this.clase.instructor || !this.clase.fecha || !this.clase.hora) {
        throw new Error('Por favor completa todos los campos.');
      }

      const reservasRef = collection(this.firestore, 'Reservas-gym');
      await addDoc(reservasRef, this.clase);

      this.mensaje = '✅ Clase registrada correctamente.';
      this.resetFormulario();
    } catch (error: any) {
      this.mensaje = '❌ Error al registrar: ' + (error.message || error);
    } finally {
      this.cargando = false;
    }
  }

  async eliminarClase(id: string) {
    if (!confirm('¿Deseas eliminar esta clase?')) return;
    try {
      await deleteDoc(doc(this.firestore, 'Reservas-gym', id));
      this.mensaje = '🗑️ Clase eliminada correctamente.';
    } catch (error: any) {
      this.mensaje = '❌ Error al eliminar: ' + (error.message || error);
    }
  }

  editarClase(clase: any) {
    this.editandoId = clase.id;
    this.clase = { ...clase };
  }

  async guardarEdicion() {
    try {
      if (!this.editandoId) return;

      const docRef = doc(this.firestore, 'Reservas-gym', this.editandoId);
      await updateDoc(docRef, this.clase);

      this.mensaje = '✅ Clase actualizada correctamente.';
      this.resetFormulario();
      this.editandoId = null;
    } catch (error: any) {
      this.mensaje = '❌ Error al actualizar: ' + (error.message || error);
    }
  }

  cancelarEdicion() {
    this.resetFormulario();
    this.editandoId = null;
  }

  private resetFormulario() {
    this.clase = {
      tipo: 'grupal',
      instructor: '',
      fecha: '',
      hora: '',
      capacidadMax: 1,
      estado: 'disponible',
      inscritos: 0
    };
  }
}


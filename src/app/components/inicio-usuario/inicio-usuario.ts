
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService, Clase, Reserva } from '../../services/reservas.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio-usuario.html',
  styleUrls: ['./inicio-usuario.css']
})
export class InicioUsuarioComponent implements OnInit {
  clases$!: Observable<Clase[]>;
  reservas$!: Observable<Reserva[]>;
  usuarioId: string = '';
  mensaje: string = '';

  constructor(private reservasService: ReservasService) {}

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioId = usuario.id || '';

    // Obtener todas las clases
    this.clases$ = this.reservasService.getClasesDisponibles();

    // Obtener reservas del usuario
    this.reservas$ = this.reservasService.getReservasUsuario(this.usuarioId);
  }

  async reservarClase(clase: Clase) {
    try {
      await this.reservasService.reservarClase(this.usuarioId, clase);
      this.mensaje = `¡Reserva realizada con éxito para ${clase.tipo} con ${clase.instructor}!`;

      // Refrescar reservas
      this.reservas$ = this.reservasService.getReservasUsuario(this.usuarioId);
    } catch (error: any) {
      this.mensaje = error.message || 'Error al reservar la clase.';
    }
  }
}

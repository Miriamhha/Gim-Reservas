import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LoginComponent } from './login';     
import { ReservaComponent } from './reserva'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, ReservaComponent], 
  templateUrl: './app.html',
})
export class AppComponent {
  items$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    // 👇 Conecta a la colección 'prueba' o la que quieras
    const ref = collection(this.firestore, 'reservas');
    this.items$ = collectionData(ref, { idField: 'id' });
  }
}



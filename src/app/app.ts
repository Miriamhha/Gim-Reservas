// import { Component, signal} from '@angular/core';
// import { NgFor } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [NgFor],
//   templateUrl: './app.html',
//   styleUrl: './app.css',
//     template: `
//     <main class="p-6">
//       <h1 class="text-3xl font-bold text-blue-600">
//         Reservas de Gimnasio 🏋️‍♂️
//       </h1>
//       <p class="mt-4 text-gray-700">
//         Bienvenido, aquí podrás reservar tus clases.
//       </p>
//     </main>  `

// })

// export class App {
//   protected readonly title = signal('gym-reservas');
// }

// import { Component, inject } from '@angular/core';
// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { AsyncPipe } from '@angular/common';  // 👈 importa el pipe

// @Component({
//   selector: 'app-root',
//   standalone: true,
//     imports: [AsyncPipe], // 👈 aquí lo registras
//   templateUrl: './app.html'
// })
// export class AppComponent {
//   private firestore = inject(Firestore);
//   items$: Observable<any[]>;

//   constructor() {
//     const col = collection(this.firestore, 'prueba'); // 👈 tu colección en Firebase
//     this.items$ = collectionData(col, { idField: 'id' });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe], // 👈 Importamos aquí
  templateUrl: './app.html',
})
export class AppComponent {
  items$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    // 👇 Conecta a la colección 'prueba' o la que quieras
    const ref = collection(this.firestore, 'prueba');
    this.items$ = collectionData(ref, { idField: 'id' });
  }
}
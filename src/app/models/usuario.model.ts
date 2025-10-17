export interface Usuario {
  id?: string;     // opcional, porque Firestore lo genera
  nombre: string;
  email: string;
  rol: 'user' | 'admin';
}

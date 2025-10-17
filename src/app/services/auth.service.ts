import { Injectable } from '@angular/core';
import { signOut, Auth, createUserWithEmailAndPassword, updateProfile, UserCredential, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 🔹 Estado compartido del usuario
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Cargar usuario desde localStorage si ya hay sesión
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }

  // 🔹 REGISTRAR USUARIO
  async registrar(nombre: string, email: string, password: string): Promise<Usuario> {
    try {
      if (!nombre.trim()) throw new Error('El nombre es obligatorio');
      if (!email.includes('@')) throw new Error('Correo electrónico no válido');
      if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

      const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(cred.user, { displayName: nombre });

      const usuariosRef = collection(this.firestore, 'usuarios');
      const nuevoUsuario: Omit<Usuario, 'id'> = {
        nombre,
        email,
        rol: 'user', // 👤 Por defecto
      };

      const docRef = await addDoc(usuariosRef, nuevoUsuario);
      const usuario = { id: docRef.id, ...nuevoUsuario };

      console.log('✅ Usuario registrado correctamente con ID:', docRef.id);

      // Guardar en localStorage y BehaviorSubject
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);

      return usuario;
    } catch (error: any) {
      console.error('❌ Error al registrar usuario:', error.message || error);
      throw error;
    }
  }

  // 🔹 LOGIN CON EMAIL Y PASSWORD
  async login(email: string, password: string): Promise<Usuario> {
    try {
      if (!email.includes('@')) throw new Error('Correo electrónico no válido');
      if (password.length < 6) throw new Error('Contraseña muy corta');

      const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = cred.user;

      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', user.email));
      const snap = await getDocs(q);

      if (snap.empty) throw new Error('El usuario no está registrado en la base de datos');

      const doc = snap.docs[0];
      const usuario = { id: doc.id, ...(doc.data() as Usuario) };

      console.log('✅ Inicio de sesión correcto:', usuario);

      // Guardar en localStorage y BehaviorSubject
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);

      return usuario;
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message || error);
      throw error;
    }
  }

  // 🔹 LOGIN CON GOOGLE
  async loginConGoogle(): Promise<Usuario> {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.auth, provider);
      const user = cred.user;

      if (!user.email) throw new Error('No se pudo obtener el correo del usuario');

      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', user.email));
      const snap = await getDocs(q);

      let usuario: Usuario;

      if (snap.empty) {
        const nuevoUsuario: Omit<Usuario, 'id'> = {
          nombre: user.displayName || 'Usuario',
          email: user.email,
          rol: 'user',
        };
        const docRef = await addDoc(usuariosRef, nuevoUsuario);
        usuario = { id: docRef.id, ...nuevoUsuario };
        console.log('🆕 Usuario Google registrado:', usuario);
      } else {
        const doc = snap.docs[0];
        usuario = { id: doc.id, ...(doc.data() as Usuario) };
        console.log('👤 Usuario Google existente:', usuario);
      }

      // Guardar en localStorage y BehaviorSubject
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);

      return usuario;
    } catch (error: any) {
      console.error('❌ Error al iniciar con Google:', error.message || error);
      throw error;
    }
  }

  // 🔹 CERRAR SESIÓN
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('usuario');
      this.usuarioSubject.next(null);
      console.log('🔒 Sesión cerrada correctamente.');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error.message || error);
      throw error;
    }
  }
}

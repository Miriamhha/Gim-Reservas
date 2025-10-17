// import { Injectable } from '@angular/core';
// import { Auth, createUserWithEmailAndPassword, updateProfile, UserCredential } from '@angular/fire/auth';
// import { Firestore, addDoc, collection } from '@angular/fire/firestore';
// import { Usuario } from '../models/usuario.model';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   constructor(private auth: Auth, private firestore: Firestore) {}

//   async registrar(nombre: string, email: string, password: string): Promise<Usuario> {
//     try {
//       // 🔹 Validaciones simples antes del registro
//       if (!nombre.trim()) throw new Error('El nombre es obligatorio');
//       if (!email.includes('@')) throw new Error('Correo electrónico no válido');
//       if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

//       // 🔹 1. Crear usuario en Authentication
//       const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

//       // 🔹 2. Actualizar el perfil con el nombre
//       await updateProfile(cred.user, { displayName: nombre });

//       // 🔹 3. Guardar en Firestore (id automático)
//       const usuariosRef = collection(this.firestore, 'usuarios');
//       const nuevoUsuario: Omit<Usuario, 'id'> = {
//         nombre,
//         email,
//         rol: 'user',
//       };

//       const docRef = await addDoc(usuariosRef, nuevoUsuario);

//       console.log('✅ Usuario registrado correctamente con ID:', docRef.id);

//       return { id: docRef.id, ...nuevoUsuario };
//     } catch (error: any) {
//       console.error('❌ Error al registrar usuario:', error.message || error);
//       throw error;
//     }
//   }
// }

// import { Injectable } from '@angular/core';
// import { signOut } from '@angular/fire/auth';
// import {
//   Auth,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   UserCredential,
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from '@angular/fire/auth';
// import {
//   Firestore,
//   addDoc,
//   collection,
//   getDocs,
//   query,
//   where,
// } from '@angular/fire/firestore';
// import { Usuario } from '../models/usuario.model';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   constructor(private auth: Auth, private firestore: Firestore) {}

//   // 🔹 REGISTRAR USUARIO
//   async registrar(nombre: string, email: string, password: string): Promise<Usuario> {
//     try {
//       // Validaciones simples antes del registro
//       if (!nombre.trim()) throw new Error('El nombre es obligatorio');
//       if (!email.includes('@')) throw new Error('Correo electrónico no válido');
//       if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

//       // 1️⃣ Crear usuario en Authentication
//       const cred: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

//       // 2️⃣ Actualizar el perfil con el nombre
//       await updateProfile(cred.user, { displayName: nombre });

//       // 3️⃣ Guardar en Firestore (id automático)
//       const usuariosRef = collection(this.firestore, 'usuarios');
//       const nuevoUsuario: Omit<Usuario, 'id'> = {
//         nombre,
//         email,
//         rol: 'user',
//       };

//       const docRef = await addDoc(usuariosRef, nuevoUsuario);

//       console.log('✅ Usuario registrado correctamente con ID:', docRef.id);

//       return { id: docRef.id, ...nuevoUsuario };
//     } catch (error: any) {
//       console.error('❌ Error al registrar usuario:', error.message || error);
//       throw error;
//     }
//   }

//   // 🔹 LOGIN CON EMAIL Y PASSWORD
//   async login(email: string, password: string): Promise<Usuario> {
//     try {
//       if (!email.includes('@')) throw new Error('Correo electrónico no válido');
//       if (password.length < 6) throw new Error('Contraseña muy corta');

//       // 1️⃣ Iniciar sesión con Firebase Auth
//       const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
//       const user = cred.user;

//       // 2️⃣ Buscar en Firestore
//       const usuariosRef = collection(this.firestore, 'usuarios');
//       const q = query(usuariosRef, where('email', '==', user.email));
//       const snap = await getDocs(q);

//       if (snap.empty) throw new Error('El usuario no está registrado en la base de datos');

//       const doc = snap.docs[0];
//       const usuario = { id: doc.id, ...(doc.data() as Usuario) };

//       console.log('✅ Inicio de sesión correcto:', usuario);
//       return usuario;
//     } catch (error: any) {
//       console.error('❌ Error al iniciar sesión:', error.message || error);
//       throw error;
//     }
//   }

//   // 🔹 LOGIN CON GOOGLE
//   async loginConGoogle(): Promise<Usuario> {
//     try {
//       const provider = new GoogleAuthProvider();
//       const cred = await signInWithPopup(this.auth, provider);
//       const user = cred.user;

//       if (!user.email) throw new Error('No se pudo obtener el correo del usuario');

//       const usuariosRef = collection(this.firestore, 'usuarios');
//       const q = query(usuariosRef, where('email', '==', user.email));
//       const snap = await getDocs(q);

//       let usuario: Usuario;

//       if (snap.empty) {
//         // Si no existe, agregarlo a Firestore
//         const nuevoUsuario: Omit<Usuario, 'id'> = {
//           nombre: user.displayName || 'Usuario',
//           email: user.email,
//           rol: 'user',
//         };
//         const docRef = await addDoc(usuariosRef, nuevoUsuario);
//         usuario = { id: docRef.id, ...nuevoUsuario };
//         console.log('🆕 Usuario Google registrado:', usuario);
//       } else {
//         const doc = snap.docs[0];
//         usuario = { id: doc.id, ...(doc.data() as Usuario) };
//         console.log('👤 Usuario Google existente:', usuario);
//       }

//       return usuario;
//     } catch (error: any) {
//       console.error('❌ Error al iniciar con Google:', error.message || error);
//       throw error;
//     }
//   }
  

// // ...

// async logout(): Promise<void> {
//   try {
//     await signOut(this.auth);
//     console.log('🔒 Sesión cerrada correctamente.');
//   } catch (error: any) {
//     console.error('❌ Error al cerrar sesión:', error.message || error);
//     throw error;
//   }
// }

// }


import { Injectable } from '@angular/core';
import { signOut } from '@angular/fire/auth';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

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
        rol: 'user', // 👤 Por defecto, usuario normal
      };

      const docRef = await addDoc(usuariosRef, nuevoUsuario);
      console.log('✅ Usuario registrado correctamente con ID:', docRef.id);

      return { id: docRef.id, ...nuevoUsuario };
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

      // 👇 Aquí puedes verificar si es admin
      if (usuario.rol === 'admin') {
        console.log('🔹 Usuario administrador detectado');
      }

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
          rol: 'user', // 👤 Por defecto, usuario normal
        };
        const docRef = await addDoc(usuariosRef, nuevoUsuario);
        usuario = { id: docRef.id, ...nuevoUsuario };
        console.log('🆕 Usuario Google registrado:', usuario);
      } else {
        const doc = snap.docs[0];
        usuario = { id: doc.id, ...(doc.data() as Usuario) };
        console.log('👤 Usuario Google existente:', usuario);
      }

      // 👇 Detectar si es admin
      if (usuario.rol === 'admin') {
        console.log('🔹 Usuario administrador detectado (Google)');
      }

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
      console.log('🔒 Sesión cerrada correctamente.');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error.message || error);
      throw error;
    }
  }
}

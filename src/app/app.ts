// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Content } from './components/content/content';
import { ReservaComponent } from './components/misreservas/mis-reservas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, Footer, ReservaComponent, Content],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}




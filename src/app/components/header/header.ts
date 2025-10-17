import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router'; // ✅ IMPORTANTE

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menuAbierto = false;
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;   
  }
  scrollTo(id: string) {
    console.log(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}


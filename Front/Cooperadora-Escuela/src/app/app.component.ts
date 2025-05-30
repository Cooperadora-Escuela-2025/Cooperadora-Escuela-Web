import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HeaderComponent, FooterComponent,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cooperadora-Escuela';
  showFooter = true;

  mostrar = false;
  sintetizador = window.speechSynthesis;
  lecturaActiva = false;

  constructor(private router: Router) {

    // rutas donde no sale el footer
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showFooter = !['/login','/register'].includes(event.urlAfterRedirects);
      }
    });
  }

  leerPantalla(): void {
    if (this.lecturaActiva) return;

    const texto = document.body.innerText; // o podés usar document.querySelector('main') si tenés un contenedor
    const utterance = new SpeechSynthesisUtterance(texto);
    this.lecturaActiva = true;
    this.sintetizador.speak(utterance);

    utterance.onend = () => {
      this.lecturaActiva = false;
    };
  }

  detenerLectura(): void {
    this.sintetizador.cancel();
    this.lecturaActiva = false;
  }
}
  
  

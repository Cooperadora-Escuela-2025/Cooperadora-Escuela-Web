import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HeaderComponent, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cooperadora-Escuela';
  showFooter = true;

  mostrar = false;
  sintetizador = window.speechSynthesis;
  lecturaActiva = false;

  //tamaño de fuente
  tamanioFuente = 16;
  currentTitle: string = '';

  constructor(private router: Router,private titleService: Title,private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showFooter = !['/login','/register'].includes(event.urlAfterRedirects);
      }

      // parar lectura si se navega a otra pagina
    if (event instanceof NavigationStart) {
      this.detenerLectura();
    }
    });
  }

  leerPantalla(): void {
    if (this.lecturaActiva) return;

    const texto = document.body.innerText;
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

  //aumentar fuente
  aumentarFuente() {
  this.tamanioFuente += 2;
  document.body.style.fontSize = `${this.tamanioFuente}px`;
  }

  //reducir fuente
  reducirFuente() {
  if (this.tamanioFuente > 10) {
    this.tamanioFuente -= 2;
    document.body.style.fontSize = `${this.tamanioFuente}px`;
  }
}

  // restaurar fuente original
  restaurarFuente() {
  this.tamanioFuente = 16;
  document.body.style.fontSize = `${this.tamanioFuente}px`;
  }

  actualizarFuente() {
  const contenedor = document.getElementById('contenedor-accesible');
  if (contenedor) {
    contenedor.style.fontSize = `${this.tamanioFuente}px`;
  }
}

modoAccesible = false;
// cambiar color
activarModoAccesible() {
  document.body.classList.add('accesible');
}

desactivarModoAccesible() {
  document.body.classList.remove('accesible');
}

ngOnInit() {
  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    )
    .subscribe(data => {
      if (data['title']) {
        this.titleService.setTitle(data['title']); 
        this.currentTitle = data['title'];
      }
    });
}
}
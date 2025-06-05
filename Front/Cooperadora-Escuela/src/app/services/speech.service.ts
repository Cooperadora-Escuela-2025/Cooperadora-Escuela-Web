import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  leerTexto(texto: string) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-AR';
    mensaje.rate = 1; 
    speechSynthesis.speak(mensaje);
  }

  detenerLectura() {
    speechSynthesis.cancel();
  }
}

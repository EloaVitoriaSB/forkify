import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {
  private requests = 0;
  private timeOut: any

  loading = signal<boolean>(false);

  show() {
    this.requests++;

    if (this.requests == 1) {
      this.timeOut = setTimeout(() => {
        if (this.requests > 0) {
          this.loading.set(true);

        }
      }, 200);

    }
      console.log('Loading ativado');
  }

  hide() {
    this.requests--;
    if (this.requests <= 0) {
      this.requests = 0;

      clearTimeout(this.timeOut);

      setTimeout(() => { this.loading.set(false) }, 300)
    }
     console.log('Loading finalizado');
  }

}

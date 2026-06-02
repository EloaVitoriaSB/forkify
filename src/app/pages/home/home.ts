import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitasService } from '../../core/services/receitas.service';
import { LoadingService } from '../../core/services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { Receita } from '../../core/models/receita.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{

  private loadingService = inject(LoadingService);
  private receitasService = inject(ReceitasService);
  destroyRef = inject(DestroyRef);

  loading = this.loadingService.loading;
  receitas = signal<Receita[]>([])


  ngOnInit(): void {
    this.buscarReceitas('pizza');
  }

  buscarReceitas(query: string) {

    this.receitasService.getTodasReceitas(query)
      .subscribe({
        next: (res) => {
          this.receitas.set(res.data.recipes);
          console.log('RECEITAS', this.receitas);

          this.destroyRef.onDestroy(() => {
            console.log('Componente destruído, cancelando assinaturas');
          });
        },
        error: () => {
          console.error('Erro ao carregar receitas');
        }
      });
  }

}

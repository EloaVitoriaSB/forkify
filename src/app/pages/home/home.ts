import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitasService } from '../../core/services/receitas.service';
import { Subject, takeUntil } from 'rxjs';
import { Receita } from '../../core/models/receita.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {

  private receitasService = inject(ReceitasService);
  private destroy$ = new Subject<void>()

  receitas= signal<Receita[]>([])

  loading = false;

  erro = '';

  ngOnInit(): void {
    this.buscarReceitas('pizza');
  }

  buscarReceitas(query: string) {

    this.loading = true;

    this.erro = '';

    this.receitasService.getTodasReceitas(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.receitas.set(res.data.recipes);

          console.log('RECEITAS', this.receitas);

          this.loading = false;
        },
        error: () => {
          console.error('Erro ao carregar receitas');
          console.log(  this.erro);
          this.erro = 'Erro ao carregar receitas';
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

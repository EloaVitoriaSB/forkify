import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitasService } from '../../core/services/receitas.service';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Receita } from '../../core/models/receita.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {

  private receitasService = inject(ReceitasService);
  private destroy$ = new Subject<void>()

  receitas: Receita[] = [];

  loading = false;

  erro = '';

  query = '';

  ngOnInit(): void{
    this.buscarReceitas('pizza');
  }

  buscarReceitas(query: string) {

    this.loading = true;

    this.erro = '';

    this.receitasService.getTodasReceitas(query)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.receitas = res.data.recipes;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar receitas';
        this.loading = false;
      }
    });

  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceitasService } from '../../core/services/receitas.service';
import { Receita } from '../../core/models/receita.model';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-receitas',
  imports: [],
  templateUrl: './receitas.html',
  styleUrl: './receitas.scss',
})
export class Receitas implements OnInit, OnDestroy {


  private receitasService = inject(ReceitasService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>()

  receitas = signal<Receita[]>([])

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarReceita(id);
    }
  }

  carregarReceita(id: string) {
    this.receitasService.getReceitaPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.receitas.set([res.data.recipe]);
      })



  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

  }








}

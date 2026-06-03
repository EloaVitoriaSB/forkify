import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceitasService } from '../../core/services/receitas.service';
import { LoadingService } from '../../core/services/loading.service';
import { Receita, Ingrediente } from '../../core/models/receita.model';
import { Location } from '@angular/common';



@Component({
  selector: 'app-receitas',
  imports: [],
  templateUrl: './receitas.html',
  styleUrl: './receitas.scss',
})
export class Receitas implements OnInit {

  private loadingService = inject(LoadingService);
  private receitasService = inject(ReceitasService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);


  loading = this.loadingService.loading;
  receitas = signal<Receita[]>([])
  ingredientes = signal<Ingrediente[]>([])

  ngOnInit() {

    this.destroyRef.onDestroy(() => {
      console.log('Componente destruído, cancelando assinaturas');
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarReceita(id);
    }
  }

  carregarReceita(id: string) {
    this.receitasService.getReceitaPorId(id)

      .subscribe(res => {
        this.receitas.set([res.data.recipe]);
        this.ingredientes.set(res.data.recipe.ingredients);
      })

  }

  voltarPagina() {
    this.location.back();
  }







}

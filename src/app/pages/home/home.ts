import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitasService } from '../../core/services/receitas.service';
import { LoadingService } from '../../core/services/loading.service';
import { FavoritoService } from '../../core/services/favoritos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Receita } from '../../core/models/receita.model';
import { Dialog } from '@angular/cdk/dialog';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private loadingService = inject(LoadingService);
  private receitasService = inject(ReceitasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  favoritoService = inject(FavoritoService);
  dialog = inject(Dialog);

  destroyRef = inject(DestroyRef);

  loading = this.loadingService.loading;
  receitas = signal<Receita[]>([])

  //armazena o termo atual em um signal para usar no html
  termoBusca = signal<string>('pizza');


  ngOnInit(): void {

    this.destroyRef.onDestroy(() => {
     console.log('Componente destruído, cancelando assinaturas');
    });

    //escuta mudança na url, se clicar em voltar ele pega o termo antigo
    this.route.queryParams.subscribe(params => {
      const query = params['search'] || 'pizza'; //se nao tiver nada na url, o padrão é pizza
      this.termoBusca.set(query);
      this.buscarReceitas(query);
    });
  }

  buscarReceitas(query: string) {

    this.receitasService.getTodasReceitas(query)
      .subscribe({
        next: (res) => {
          this.receitas.set(res.data.recipes);
          console.log('RECEITAS', this.receitas);
        },
        error: () => {
          console.error('Erro ao carregar receitas');
        }
      });
  }

  realizarNovaBusca(termo: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: termo },
      queryParamsHandling: 'merge' // preserva os outros parametros se existirem
    });

  }

  abrirModal(){
    this.dialog.open(Modal, {
      width: '80%',
      data: {mensagem: 'Dialog aberto'}
    });
  }

}

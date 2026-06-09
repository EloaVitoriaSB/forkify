
import { Component, inject, signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormField, form, required } from '@angular/forms/signals';
import { ReceitasService } from '../../core/services/receitas.service';
import { Receita } from '../../core/models/receita.model';

@Component({
  selector: 'app-modal',
  imports: [FormField],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {

  private receitaService = inject(ReceitasService);

  dialogRef = inject(DialogRef);

  receitaModel = signal<Receita>({
    id: '',
    title: '',
    source_url: '',
    image_url: '',
    publisher: '',
    cooking_time: 0,
    servings: 0,
    ingredients: [
      {
        quantity: 0,
        unit: '',
        description: ''
      }
    ]
  });

  receitaForm = form(this.receitaModel, (schemaPath) => {
    required(schemaPath.title, {message: 'title is required'});
    required(schemaPath.publisher, {message: 'publisher is required'});
    required(schemaPath.source_url, {message: 'source url is required'});
    required(schemaPath.image_url, {message: 'image url is required'});
    required(schemaPath.servings, {message: 'servings is required'});
    required(schemaPath.cooking_time, {message: 'cooking time is required'});
  });

  adicionarIngrediente() {
    this.receitaModel.update(receita => ({
      ...receita,
      ingredients: [...receita.ingredients, { quantity: null, unit: '', description: ''}],
    }))
  };

  criarReceita() {
    const enviarReceita = this.receitaModel();

    this.receitaService.postReceita(enviarReceita)
      .subscribe({
        next: (res) => {
          this.receitaModel.set(res.data.recipe);
          console.log("Receita criada com sucesso");
          this.fecharDialog();
        },
        error: () => {
          console.log("Erro ao criar nova receita!")
        },
      })
  }


  fecharDialog() {
    this.dialogRef.close();
  }

}

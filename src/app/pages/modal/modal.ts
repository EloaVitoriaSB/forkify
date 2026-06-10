
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
        quantity: null,
        unit: '',
        description: ''
      }
    ]
  });

  receitaForm = form(this.receitaModel, (schemaPath) => {
    required(schemaPath.title, {
      message: 'title is required'
    });

    required(schemaPath.source_url, {
      message: 'source url is required'
    });

    required(schemaPath.image_url, {
      message: 'image url is required'
    });

    required(schemaPath.publisher, {
      message: 'publisher is required'
    });

    required(schemaPath.cooking_time, {
      message: ' invalid cooking time',
      when: ({valueOf}) => valueOf(schemaPath.cooking_time) > 0
    })

    required(schemaPath.servings, {
      message: ' Sorry, servings is required! Its only allowed numbers greaters than zero  ',
      when: ({ valueOf }) => valueOf(schemaPath.servings) > 0,
    });



  });

  adicionarIngrediente() {
    this.receitaModel.update(receita => ({
      ...receita,
      ingredients: [...receita.ingredients, { quantity: null, unit: '', description: '' }],
    }))
  };

  criarReceita() {
    const dadosFormulario = this.receitaModel();

    const enviarReceita = {
      title: dadosFormulario.title ? dadosFormulario.title.trim() : '',
      source_url: dadosFormulario.source_url ? dadosFormulario.source_url.trim() : '',
      image_url: dadosFormulario.image_url ? dadosFormulario.image_url.trim() : '',
      publisher: dadosFormulario.publisher ? dadosFormulario.publisher.trim() : '',
      cooking_time: Number(dadosFormulario.cooking_time),
      servings: Number(dadosFormulario.servings),
      ingredients: dadosFormulario.ingredients.map(ing => ({
        quantity: ing.quantity ? Number(ing.quantity) : null,
        unit: ing.unit ? ing.unit.trim() : '',
        description: ing.description ? ing.description.trim() : '',
      })),
    };

    console.log("=== Texto JSON ===");
    console.log(JSON.stringify(enviarReceita, null, 2));
    console.log("============================");

    this.receitaService.postReceita(enviarReceita as any)
      .subscribe({
        next: (res) => {
          this.receitaModel.set(res.data.recipe);
          console.log("Receita criada com sucesso", res.data.recipe);
          this.fecharDialog();
        },
        error: (err) => {
          console.log("Erro ao criar nova receita!")
          console.log(err)
        },
      })
  }


  fecharDialog() {
    this.dialogRef.close();
  }

}

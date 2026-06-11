import { Ingrediente } from './../../core/models/receita.model';

import { Component, inject, signal, ɵEVENT_REPLAY_QUEUE } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormField, SchemaPath, form, pattern, required, validate } from '@angular/forms/signals';
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

  url(path: SchemaPath<string>, options?: { message?: string }) {
    validate(path, ({ value }) => {
      try {
        new URL(value());
        return null;
      } catch {
        return {
          kind: 'url',
          message: options?.message || 'Enter a valid URL',
        };
      }
    });
  }

  receitaForm = form(this.receitaModel, (schemaPath) => {
    required(schemaPath.title, {
      message: 'title is required',

    });

    pattern(schemaPath.source_url, /^[a-zA-Z0-9_-]+$/, {
      message: 'invalid source url'
    });

    this.url(schemaPath.source_url, {
      message: 'Plase enter a valid website URL'
    });

    pattern(schemaPath.image_url, /^[a-zA-Z0-9_-]+$/, {
      message: 'invalid source url'
    });

    this.url(schemaPath.image_url, {
      message: 'Plase enter a valid image URL'
    });

    required(schemaPath.publisher, {
      message: 'publisher is required'
    });

    required(schemaPath.cooking_time, {
      message: ' invalid cooking time',
      when: ({ valueOf }) => valueOf(schemaPath.cooking_time) <= 0
    })

    required(schemaPath.servings, {
      message: ' Sorry, servings is required! Its only allowed numbers greaters than zero  ',
      when: ({ valueOf }) => valueOf(schemaPath.servings) <= 0,
    });

    validate(schemaPath.ingredients, ({ value }) => {
      const ingredients = value();
      const naoTemQuantity = ingredients.some(ingredient => ingredient.quantity == null || ingredient.quantity <= 0);
      if (naoTemQuantity) {
        return {
          kind: 'required',
          message: 'quantity is required',
        };
      }

      const naoTemUnit = ingredients.some(ingredient => ingredient.unit.length >= 7 || ingredient.unit == null);
      if (naoTemUnit) {
        return {
          kind: 'required',
          message: 'unit is required and must be 7 characters or less',
        };
      }

      const naoTemDescription = ingredients.some(ingredient => ingredient.description == null);
      if(naoTemDescription){
        return{
          kind: 'required',
          message: 'description is required'
        }
      }

      return null;
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

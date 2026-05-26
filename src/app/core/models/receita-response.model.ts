import { Receita } from './receita.model';

export interface ReceitaResponse {
  status: string;
  data: {
    recipes: Receita[];
  };
}

export interface ReceitaDetalheResponse {
  status: string;
  data: {
    recipe: Receita;
  };
}

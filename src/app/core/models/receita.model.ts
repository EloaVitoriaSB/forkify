export interface Receita {
  id: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingrediente[];
}

export interface Ingrediente {
  quantity: number | null;
  unit: string;
  description: string;
}

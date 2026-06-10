import { Injectable, inject } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { Receita } from "../models/receita.model";
import { ReceitaResponse, ReceitaDetalheResponse } from "../models/receita-response.model";




@Injectable({
  providedIn: 'root'
})

export class ReceitasService {

private http = inject(HttpClient);

   // pega todas as receitas
  getTodasReceitas(query: string) : Observable<ReceitaResponse> {
     return this.http.get<ReceitaResponse>(`${environment.apiUrl}?search=${query}`)
     .pipe(
      catchError((err) => {
       console.error('Erro ao buscar receitas:', err);
        throw err;
      }),
     )
  }

  // pega por ID
  getReceitaPorId(id: string) : Observable<ReceitaDetalheResponse> {
  return this.http.get<ReceitaDetalheResponse>(`${environment.apiUrl}/${id}`)
  .pipe(
    catchError((err) => {
      console.error(`Erro ao buscar receita com ID ${id}:`, err);
      throw err;
    }),
  )
  };


  //post
  postReceita(receita: Receita) : Observable<ReceitaDetalheResponse> {
    return this.http.post<ReceitaDetalheResponse>(`${environment.apiUrl}?key=${environment.apiKey}`, receita)
    .pipe(
      catchError((err) => {
        console.error('Erro ao criar receita:', err);
        throw err;
      }),
    )
  };


  //delete
  deleteReceita(id: string) : Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${id}?key=${environment.apiKey}`)
    .pipe(
      catchError((err) => {
        console.error(`Erro ao excluir receita com o ID ${id}:`, err);
        throw err;
      }),
    )
  }
}

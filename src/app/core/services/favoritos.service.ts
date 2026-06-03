import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})


export class FavoritoService{

    favoritos: string[] = JSON.parse(localStorage.getItem('favoritos') || '[]');

    isFavorito(id: string): boolean {
        return this.favoritos.includes(id);
    }

    toggleFavorito(id: string){
        if(this.isFavorito(id)){
            this.favoritos = this.favoritos.filter(favId => favId !== id)
        }else{
            this.favoritos.push(id);
        }
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }


}

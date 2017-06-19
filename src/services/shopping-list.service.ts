import { Ingredient } from "../interfaces/ingredient";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth.service";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListService {
    private ingredientsList: Ingredient[] = [];
    constructor(private http: Http, private authService: AuthService) { }
    onAddIngredient(name: string, amount: number) {
        this.ingredientsList.push(new Ingredient(name, amount));
        console.log(this.ingredientsList);
    }

    onAddIngredients(items: Ingredient[]) {
        this.ingredientsList.push(...items);
    }

    onUpdateIngredient(index: number, ingredient: Ingredient) {
        this.ingredientsList[index] = ingredient;
    }

    getAllIngredients() {
        return this.ingredientsList.slice();
    }

    removeIngredient(index: number) {
        this.ingredientsList.splice(index, 1);
    }

    storeList(token: string) {
        const userId = this.authService.getCurrentUser().uid;
        return this.http.put('https://ionic2-recipebook-f1c4d.firebaseio.com/' + userId + '/shopping-list.json?auth='+ token, this.ingredientsList)
            .map((response: Response) => {
                return response.json();
            });
    }

    fetchList(token: string){
        const userId = this.authService.getCurrentUser().uid;
        return this.http.get('https://ionic2-recipebook-f1c4d.firebaseio.com/' + userId + '/shopping-list.json?auth='+ token)
            .map((response: Response) => {
                return response.json();
            })
            .do((ingredients: Ingredient[]) => {
                if(ingredients){
                    this.ingredientsList = ingredients;
                }else{
                    this.ingredientsList = [];
                }
            })
    }
}
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Recipe } from "../../interfaces/recipe";
import { NewRecipePage } from "../new-recipe/new-recipe";
import { ShoppingListService } from "../../services/shopping-list.service";
import { RecipesService } from "../../services/recipes.service";

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams, 
  private slSrv: ShoppingListService,
  private recipesService: RecipesService) {
  }

  ngOnInit(){
    this.recipe = this.navParams.get('recipe');
    this.index = this.navParams.get('index');
  }

  onEditRecipe(){
    this.navCtrl.push(NewRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index})
  }

  onAddIngredients(){
    this.slSrv.onAddIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }

}

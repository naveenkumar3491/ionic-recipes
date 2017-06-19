import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NewRecipePage } from "../new-recipe/new-recipe";
import { RecipesService } from "../../services/recipes.service";
import { Recipe } from "../../interfaces/recipe";
import { RecipePage } from "../recipe/recipe";
import { DatabaseOptionsPage } from "../database-options/database-options";
import { AuthService } from "../../services/auth.service";

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage  {
  recipes: Recipe[];
  constructor(private navCtrl: NavController, 
  private recipesService: RecipesService,
  private popoverCtrl: PopoverController,
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private authService: AuthService){}
  onNewRecipe(){
    this.navCtrl.push(NewRecipePage, {mode: 'New'});
  }

  ionViewWillEnter(){
    this.recipes = this.recipesService.getRecipes();
  }

  onLoadRecipe(recipe: Recipe, index: number){
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

    onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please wait..'
    }); 
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(
      data => {
        if(data && data.action == 'load'){
          loading.present();
          this.authService.getCurrentUser().getToken()
            .then(
              (token: string) => {  
                this.recipesService.fetchList(token)
                  .subscribe(
                    (list: Recipe[]) => {
                      loading.dismiss();
                      if(list){
                        this.recipes = list;
                      }else{
                        this.recipes = [];
                      }
                    },
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            );
        }else if(data && data.action == 'store'){
          loading.present();
          this.authService.getCurrentUser().getToken()
            .then(
              (token: string) => {
                this.recipesService.storeList(token)
                  .subscribe(
                    () => loading.dismiss(),
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  )
              }
            );
        }
      }
    )
  }

  handleError(errorMessage: string){
    const alert = this.alertCtrl.create({
      title: 'Error Occured',
      message: errorMessage,
      buttons:['Ok']
    });
    alert.present();
  }

}

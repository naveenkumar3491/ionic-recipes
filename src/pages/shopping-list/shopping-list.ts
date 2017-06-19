import { Component, ViewChild } from '@angular/core';
import { IonicPage, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list.service";
import { Ingredient } from "../../interfaces/ingredient";
import { AuthService } from "../../services/auth.service";
import { DatabaseOptionsPage } from "../database-options/database-options";

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  @ViewChild('f') formData: NgForm;
  ingredientsList: Ingredient[] = [];
  iNameModel: string = '';
  amountModel: number;
  isEditMode: boolean = false;
  editedIndex: number;
  constructor(private slSrv: ShoppingListService, 
  private popoverCtrl: PopoverController, 
  private authService: AuthService,
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController){}

  ionViewWillEnter(){
    this.loadItems();
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
                this.slSrv.fetchList(token)
                  .subscribe(
                    (list: Ingredient[]) => {
                      loading.dismiss();
                      if(list){
                        this.ingredientsList = list;
                      }else{
                        this.ingredientsList = [];
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
                this.slSrv.storeList(token)
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

  onAddItem(){
    this.slSrv.onAddIngredient(this.formData.value.ingredientName, +this.formData.value.amount);
    this.formData.reset();
    this.loadItems();
  }

  private loadItems(){
    this.ingredientsList = this.slSrv.getAllIngredients();
  }

  onRemoveIngredient(index: number){
    this.slSrv.removeIngredient(index);
    this.loadItems();
  }

  onUpdateIngredient(){
    this.slSrv.onUpdateIngredient(this.editedIndex, {name: this.iNameModel, amount: +this.amountModel});
    this.formData.reset();
    this.isEditMode = false;
    this.loadItems();
  }

  onEditIngredient(ingredient: Ingredient, index: number){
    this.isEditMode = true;
    this.editedIndex = index;
    this.iNameModel = ingredient.name;
    this.amountModel = ingredient.amount;
  }

}

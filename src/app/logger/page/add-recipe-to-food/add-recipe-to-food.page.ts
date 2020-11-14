import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FsService } from '../../service/fs.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-recipe-to-food',
  templateUrl: './add-recipe-to-food.page.html',
  styleUrls: ['./add-recipe-to-food.page.scss'],
})
export class AddRecipeToFoodPage implements OnInit {
  public recipe;
  public intergredients;
  public currentDate = new Date();
  public amount;
  constructor(
    private modalController: ModalController, 
    private navParams: NavParams,
    private fsService: FsService, 
    private router: Router,
  ) { }

  ngOnInit() {
    this.recipe = this.navParams.data.recipe;
    this.intergredients = this.recipe.intergredients;
    console.log(this.recipe)
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  public addRecipeToFood() {
    var calorie = 0;
    var protein = 0;
    var sugar = 0;
    var carb = 0;
    var fat = 0;
    this.intergredients.forEach((element) => {
      calorie += element.amount * element.intergredient.nf_calories
      protein += element.amount * element.intergredient.nf_protein
      sugar += element.amount * element.intergredient.nf_sugars
      carb += element.amount * element.intergredient.nf_total_carbohydrate
      fat += element.amount * element.intergredient.nf_total_fat
    });
    var photo = {
      'thumb':" ",
      'is_user_uploaded':false,
      'highres':" "
    }
    var food = {...this.recipe, 
    'isRecipe':true,
    'nf_calories':calorie,
    'nf_protein':protein,
    'nf_sugars':sugar,
    'nf_total_carbohydrate':carb,
    'nf_total_fat':fat,
    'photo':photo,
    }

    var data = {'food':food,
    'date': this.currentDate,
    'amount': this.amount
    }
    console.log(data)
    this.fsService.logfood(data, this.currentDate)
    this.router.navigate(['/logger/home']);
  }
  

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRecipeToFoodPage } from './add-recipe-to-food.page';

describe('AddRecipeToFoodPage', () => {
  let component: AddRecipeToFoodPage;
  let fixture: ComponentFixture<AddRecipeToFoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecipeToFoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeToFoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodEditPage } from './food-edit.page';

describe('FoodEditPage', () => {
  let component: FoodEditPage;
  let fixture: ComponentFixture<FoodEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

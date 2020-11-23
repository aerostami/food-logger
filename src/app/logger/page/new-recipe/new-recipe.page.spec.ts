import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewRecipePage } from './new-recipe.page';

describe('NewRecipePage', () => {
  let component: NewRecipePage;
  let fixture: ComponentFixture<NewRecipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecipePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewRecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

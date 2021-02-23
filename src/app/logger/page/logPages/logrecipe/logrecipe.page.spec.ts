import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogRecipePage } from './logrecipe.page';

describe('NewRecipePage', () => {
  let component: LogRecipePage;
  let fixture: ComponentFixture<LogRecipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogRecipePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogRecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

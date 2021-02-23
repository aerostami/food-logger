import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddfoodPage } from './addfood.page';

describe('AddfoodPage', () => {
  let component: AddfoodPage;
  let fixture: ComponentFixture<AddfoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddfoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

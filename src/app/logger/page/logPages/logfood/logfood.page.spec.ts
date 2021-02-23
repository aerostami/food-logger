import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogfoodPage } from './logfood.page';

describe('LogfoodPage', () => {
  let component: LogfoodPage;
  let fixture: ComponentFixture<LogfoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogfoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogfoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

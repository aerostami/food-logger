import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowresultPage } from './showresult.page';

describe('ShowresultPage', () => {
  let component: ShowresultPage;
  let fixture: ComponentFixture<ShowresultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowresultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowresultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

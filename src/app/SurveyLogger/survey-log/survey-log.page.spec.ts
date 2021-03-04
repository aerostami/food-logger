import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyLogPage } from './survey-log.page';

describe('SurveyLogPage', () => {
  let component: SurveyLogPage;
  let fixture: ComponentFixture<SurveyLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

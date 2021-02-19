import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventLogPagePage } from './event-log-page.page';

describe('EventLogPagePage', () => {
  let component: EventLogPagePage;
  let fixture: ComponentFixture<EventLogPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLogPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventLogPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

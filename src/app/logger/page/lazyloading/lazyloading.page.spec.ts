import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LazyloadingPage } from './lazyloading.page';

describe('LazyloadingPage', () => {
  let component: LazyloadingPage;
  let fixture: ComponentFixture<LazyloadingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyloadingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LazyloadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

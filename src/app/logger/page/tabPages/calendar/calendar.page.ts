import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import { Subject, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView,} from 'angular-calendar';
import { FsService } from '../../../service/fs.service';
import { timeInterval } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { FoodEditPage } from '../../logPages/food-edit/food-edit.page';
import { OpenModalService } from 'src/app/services/open-modal.service';


export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  activeDayIsOpen: boolean = false;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [

    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.fsService.deleteItem(event.id, event.start);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  eventStream = new Subject<any>();
  events$: Observable<CalendarEvent<any>[]>;
  test: any;
  public monthFoods = [];


  constructor(
    private fsService: FsService,
    private openModalService: OpenModalService,
    ) {
      this.fsService.getMonthFoods();
      this.fsService.getAddFoodStream().subscribe(v => {
        let date = this.fsService.convertTimeStampToDate(v.date)
        let time = date.getHours() + ":" + date.getMinutes();
        let event = {
          start: date,
          title: v.food.food_name + "   " + time,
          food: v,
          color: colors.blue,
          actions: this.actions,
          id: v.id,
        }
        this.events.push(event);
        this.refresh.next();
      })
      this.fsService.getDeleteFoodStream().subscribe(data =>{
        this.events = this.events.filter(v=>v.id!=data.id);
      })
    }

  ngOnInit() {
  }

  ionViewWillEnter() {   
  }

  public getEventStream() {
    return this.eventStream.asObservable();
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  public handleEvent(action: string, event): void {
    this.modalData = { event, action };
    if (action === "Clicked") {
      this.openModalService.openFoodEditModal(event.food);
    };
  }

  public addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  public deleteEvent(eventToDelete) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  public setView(view: CalendarView) {
    this.view = view;
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  
  

}

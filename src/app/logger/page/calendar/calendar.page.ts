import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import { Subject, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView,} from 'angular-calendar';
import { FsService } from '../../service/fs.service';
import { timeInterval } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { FoodEditPage } from '../food-edit/food-edit.page';


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
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.fsService.deleteItem(event.id, event.start);
        this.handleEvent('Deleted', event);

      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  eventStream = new Subject<any>();
  events$: Observable<CalendarEvent<any>[]>;
  test: any;



  public monthFoods = [];

  private ids = [];

  constructor(
    private modal: NgbModal,
    private fsService: FsService,
    private modalController: ModalController,
    ) {
      


    }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.fsService.getMonthFoods();
      this.events$ = this.fsService.getFoodStream();
      this.fsService.getFoodStream().subscribe(v => {
        console.log(v)

        if (!( this.ids.includes(v.id))) {
        
          this.ids.push(v.id);
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
        }
        
      })
  }

  getEventStream() {
    return this.eventStream.asObservable();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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

  eventTimesChanged({
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

  handleEvent(action: string, event): void {
    this.modalData = { event, action };
    if (action === "Clicked") {

      this.openFoodEditModal(event.food);
    };
  }

  addEvent(): void {
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

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public edit(v) {

  }
  public async openFoodEditModal(food){
    const modal = await this.modalController.create({
      component: FoodEditPage,
      componentProps: {
        "food": food,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.dataReturned = dataReturned.data;
        // console.log(this.dataReturned);
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

}

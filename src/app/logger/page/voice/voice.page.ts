import { Component, OnInit } from '@angular/core';
import { HttpRestService } from "../../service/http-rest.service";
import { FsService } from '../../service/fs.service';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {

  text: string;
  foods: any;
  hasPermission: boolean;

  constructor(
      private rest: HttpRestService,
      private fsService: FsService,
  ) {
  }

  ngOnInit() {
    /*
    this.hasPermission = false;
    this.speechRecognition.isRecognitionAvailable()
        .then((available: boolean) => {if (available){
              this.speechRecognition.hasPermission()
                  .then((hasPermission: boolean) => { this.hasPermission = hasPermission; if ( !hasPermission){
                    this.speechRecognition.requestPermission()
                        .then(
                            () => console.log('Granted'),
                            () => console.log('Denied')
                ); } } );
    }else{
          console.log('Speech Recognition not available.');
        }});
    if (this.hasPermission){
      const options = {
        language: 'en-US',
        matches: 20,
        prompt: 'Tell me what you ate?',      // Android only
        showPopup: true,  // Android only
        showPartial: false
      }
      this.speechRecognition.startListening(options)
          .subscribe(
              (matches: string[]) => console.log(matches),
              (onerror) => console.log('error:', onerror)
          );
    }
  }
*/
  }

  searchForText() {
    this.rest.getRestNutritionix().all('/v2/natural/').one('nutrients').post('', {
      query: this.text
    }).subscribe(response => {
      this.foods = response.foods;

      this.foods.forEach(food => {
        this.fsService.addItem(food);
      });
      localStorage.setItem('foods', JSON.stringify(this.foods));
    });
  }
}

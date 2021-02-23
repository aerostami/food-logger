import { Component, OnInit } from '@angular/core';
import { HttpRestService } from "../../../service/http-rest.service";
import { FsService } from '../../../service/fs.service';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import {subscribeOn} from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {
  public mode;
  text: string;
  foods: any;
  hasPermission: boolean;
  msg: string;

  constructor(
      private rest: HttpRestService,
      private fsService: FsService,
      private speechRecognition: SpeechRecognition,
      private router: Router
  ) {
  }
  ionViewWillEnter() {
    this.mode = localStorage.getItem('mode')
  }

  checkPermission(){
    this.speechRecognition.hasPermission().then((permission) => {
      if (permission){
        // alert('already have permission!');
        this.StartListening();
      }else{
        // alert('not have permission of speech recognition!');
        this.requestPermission();
        this.msg = 'Please provide the permission for speech recognition feature to work.';
      }
    }, (err) => {
        alert(JSON.stringify(err));
        this.msg = 'Speech recognition is not available.';
    });
  }

  requestPermission(){
    this.speechRecognition.requestPermission().then((data) => {
      // alert(JSON.stringify(data));
        this.StartListening();
    }, (err) => {
      // alert(JSON.stringify(err));
    });
  }

  StartListening(){
    this.speechRecognition.startListening().subscribe((speeches) => {
      this.text = speeches[0];
      this.searchForText();
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  ngOnInit() {
    this.checkPermission();
    this.msg = '';
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
      if (this.mode == 'food') {
        this.foods.forEach(food => {
          this.router.navigate(["/","logger","logfood"]);
        });
        localStorage.setItem('foods', JSON.stringify(this.foods));
      } else if (this.mode == 'recipe') {
        this.router.navigate(['/new-recipe'])
                      var intergredient = this.foods
                      localStorage.setItem('intergredient', JSON.stringify(intergredient))

      }
      });
      
    }
  
}

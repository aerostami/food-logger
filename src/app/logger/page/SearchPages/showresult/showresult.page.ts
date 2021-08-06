import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-showresult',
  templateUrl: './showresult.page.html',
  styleUrls: ['./showresult.page.scss'],
})
export class ShowresultPage implements OnInit {

  image: any;
  result: any;
  feature: any;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.special && params.result && params.feature) {
        this.image = JSON.parse(params.special);
        this.result = JSON.parse(params.result);
        this.feature = JSON.parse(params.feature);
      }
      switch (this.feature) {
        default: {
          this.result = this.result.responses[0].labelAnnotations;
        }
      }
      console.log(this.result);
    });
  }

}

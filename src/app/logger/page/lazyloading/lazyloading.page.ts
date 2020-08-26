import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-lazyloading',
  templateUrl: './lazyloading.page.html',
  styleUrls: ['./lazyloading.page.scss'],
})
export class LazyloadingPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/logger/home']);
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector:    'my-card',
  templateUrl: 'my-card.html'
})
export class MyCardComponent implements OnInit { 

  @Input( 'cliente' ) xliente: any;

  constructor() {
  }

  ngOnInit() {
    console.log( this.xliente );
  }  

}

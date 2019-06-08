
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabtarea',
  templateUrl: 'tabtarea.html',
})
export class TabtareaPage {

  constructor( public  navCtrl:   NavController,
               public  navParams: NavParams ) {
      console.log('<<< TabTareaPage >>>' );
  }

  ionViewDidLoad() {
  }  

}

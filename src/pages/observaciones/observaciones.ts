import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-observaciones',
  templateUrl: 'observaciones.html',
})
export class ObservacionesPage {

  textoObs: string;

  constructor(  private navParams:  NavParams,
                private viewCtrl:   ViewController) {
        this.textoObs = this.navParams.get( "obs" );
        console.log('ObservacionesPage', this.textoObs );
  }

  ionViewDidLoad() {
  }

  salir() {
    this.viewCtrl.dismiss();
  }

  enviar() {
    this.viewCtrl.dismiss( {  obs:  this.textoObs } );
  }
  
}

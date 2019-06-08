import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { FuncionesProvider } from '../../providers/funciones/funciones';

@IonicPage()
@Component({
  selector: 'page-norecuerdo',
  templateUrl: 'norecuerdo.html',
})
export class NorecuerdoPage {

  public rutocorreo: string;

  constructor( public navCtrl:   NavController, 
               public navParams: NavParams,
               public netWork:   NetworkEngineProvider,
               public funciones: FuncionesProvider,
               public app:       App ) {
      console.log('<<< NorecuerdoPage >>>');
  }

  ionViewDidLoad() {
  }

  enviarCorreo( rutocorreo ) {
    if ( rutocorreo == '' || rutocorreo == undefined ) {
      this.funciones.msgAlert('ATENCION','Ingrese el dato solicitado. Corrija y reintente');
    } else {
      this.funciones.cargaEspera();
      this.netWork.sendMail( rutocorreo )
      .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                  err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( "ATENCION" , 'Ocurrió un error -> '+err ); }
                )   
    }
  }

  private revisaExitooFracaso( data ) { 
    if ( data.length==0 )
          this.funciones.msgAlert('ATENCION','La información entregada quizás no sea correcta. Corrija y reintente');
    else
        { this.funciones.msgAlert('ATENCION','Un correo electrónico será enviado en algunos instantes. Revise su bandeja de entrada.' );
          // remove tokens, api, etc...
          const root = this.app.getRootNav();
          root.popToRoot();
        } 
  }
}

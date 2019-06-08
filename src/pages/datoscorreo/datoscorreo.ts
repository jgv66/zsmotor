
import { Component }                                from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

import { FuncionesProvider } from '../../providers/funciones/funciones';

@IonicPage()
@Component({
  selector:     'page-datoscorreo',
  templateUrl:  'datoscorreo.html',
})
export class DatoscorreoPage {

  private emailTo:      string = '';
  private emailCc:      string = '';

  public cliente:  any;

  constructor(  public  navCtrl:    NavController, 
                private viewCtrl:   ViewController,
                private funciones:  FuncionesProvider ) {
        this.cliente = undefined;
  }

  ionViewDidLoad() {
    console.log('<< DatoscorreoPage  >>' );
    this.funciones.obtenUltimoCliente()
        .then( result => {  
            this.cliente = result;
            this.emailTo = result.email;
        });
  }

  salir() {
    this.viewCtrl.dismiss();
  }

  enviar() {
    this.viewCtrl.dismiss( {  xto:  this.emailTo,  xcc:  this.emailCc } );
  }
  
  limpiarTextos( caso: number ) {
    if ( caso == 1 )      { this.emailTo  = ''; } 
    else if ( caso == 2 ) { this.emailCc  = ''; }
  }

}

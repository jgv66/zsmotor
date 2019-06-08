
import { Component }                                from '@angular/core';
import { IonicPage, NavController, App, NavParams } from 'ionic-angular';
import { FuncionesProvider }                        from '../../providers/funciones/funciones';
import { BaseLocalProvider } from '../../providers/base-local/base-local';

@IonicPage()
@Component({
  selector:    'page-tabsalir',
  templateUrl: 'tabsalir.html',
})
export class TabsalirPage {

  norecordar: boolean = false;

  constructor( public navCtrl:    NavController,
               public  navParams: NavParams,
               public funciones:  FuncionesProvider,
               public baseLocal:  BaseLocalProvider,
               public app:        App ) {
      console.log('<<< TabsalirPage >>>');
  }

  salirDelSistema() { 
    if ( this.norecordar ) {
      this.baseLocal.guardaUltimoUsuario( this.baseLocal.initUsuario() );
    }
    this.funciones.inicializaTodo();
    const root = this.app.getRootNav();
    root.popToRoot();
  }
  
}

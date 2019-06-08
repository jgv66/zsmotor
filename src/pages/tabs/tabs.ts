
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { FuncionesProvider }   from './../../providers/funciones/funciones';
import { TabpendientePage }    from '../tabpendiente/tabpendiente';
import { TabsalirPage }        from '../tabsalir/tabsalir';
import { BuscarProductosPage } from '../buscar-productos/buscar-productos';
//import { TabmensajePage }    from '../tabmensaje/tabmensaje';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BuscarProductosPage;
  tab2Root = TabpendientePage;
  //tab3Root = TabmensajePage;
  tab4Root = TabsalirPage;

  public mensajes:    any;
  public usuario:     any;

  constructor( public funciones: FuncionesProvider,
               public navParams: NavParams ) {
    this.mensajes = [];
    this.usuario  = this.navParams.data
  }

  cuantosProductosEnCarro() {
    return this.funciones.cuantosProductosEnCarroTengo();
  }

}


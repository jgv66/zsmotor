
import { Component }                            from '@angular/core';
import { IonicPage, NavController, NavParams }  from 'ionic-angular';

import { FuncionesProvider }      from '../../providers/funciones/funciones';
import { BaseLocalProvider }      from '../../providers/base-local/base-local';
import { Cliente }                from '../../model/modelos.model';

import { BuscarClientesPage }     from '../buscar-clientes/buscar-clientes';
import { TabmensajePage }         from '../tabmensaje/tabmensaje';

@IonicPage()
@Component({
  selector:    'page-menu-seteo',
  templateUrl: 'menu-seteo.html',
})
export class MenuSeteoPage {

  private barraTabs:    any;  // variable para ocultar barra de tabs
  public  cliente:      Cliente;
  public  usuario:      any;
  public  config:       any;

  constructor( private navCtrl:   NavController, 
               private navParams: NavParams,
               private funciones: FuncionesProvider,
               private baseLocal: BaseLocalProvider ) {
      //           
      this.usuario = this.navParams.get( "usuario" );
      //
      if ( this.cliente == undefined ) { this.cliente = this.funciones.initCliente(); };
      if ( this.config == undefined )  { this.config  = this.baseLocal.initConfig();  };
      //
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    this.funciones.obtenUltimoCliente().then( data => { this.cliente = data } ) ;
    this.baseLocal.obtenUltimoConfig().then(  data => { this.config = data  } ) ;
    this.barraTabs  = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.baseLocal.guardaUltimoConfig( this.config );
    this.funciones.showTabs( this.barraTabs );
  }

  salir() {
    this.navCtrl.pop();
  }

  buscarOtroCliente() {
    this.navCtrl.push( BuscarClientesPage, { callback: this.retornaDataCliente, usuario: this.usuario });
  }

  retornaDataCliente = ( data ) => {
    return new Promise( (resolve, reject) => { 
          this.cliente = data; 
          resolve(); 
          this.funciones.guardaUltimoCliente( data );
          if ( data.listaprecios != this.usuario.LISTAMODALIDAD ) {
            this.usuario.LISTACLIENTE = data.listaprecios;
          };
       });
  };

  consultarImpagos( cliente ) { 
      //console.log('consultarImpagos()',cliente,this.usuario);
      if ( cliente == null || cliente == undefined || cliente.codigo == '' ) {
        this.funciones.muestraySale('ATENCION : Código de cliente no puede estar vacío',2);
      } else {  
        this.navCtrl.push( TabmensajePage, { cliente: cliente, usuario: this.usuario } );
      }
  }  

}


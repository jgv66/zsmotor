
import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';

import { FuncionesProvider }      from '../../providers/funciones/funciones';
import { NetworkEngineProvider }  from '../../providers/network-engine/network-engine';
import { Usuario }                from '../../model/modelos.model';
import { DocumentoPage } from './../documento/documento';

@IonicPage()
@Component({
  selector: 'page-tabmensaje',
  templateUrl: 'tabmensaje.html',
})
export class TabmensajePage {

  private barraTabs:    any;  // variable para ocultar barra de tabs
  public  Vencidos:     any;
  public  PorVencer:    any;
  public  cliente:      any;
  public  usuario:      Usuario;

  impagos:              string = 'Vencidos';

  constructor( private navParams: NavParams,
               private navCtrl:   NavController,
               public  funciones: FuncionesProvider,
               public  netWork:   NetworkEngineProvider ) {
    this.cliente      = this.navParams.get( "cliente" );
    this.usuario      = this.navParams.get( "usuario" );
    this.Vencidos     = [];
    this.PorVencer    = [];
    console.log('<<< TabmensajePage >>>');
  }

  ionViewDidLoad() {
    //console.log('<<< TabmensajePage.ionViewDidLoad() >>>', this.cliente );
    this.cargaImpagos();
  }
  ionViewWillEnter() {
    this.barraTabs  = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.funciones.showTabs( this.barraTabs );
  }

  cargaImpagos() {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_traeImpagos', { codigo:  this.cliente.codigo, 
                                                empresa: this.usuario.EMPRESA }, 
                                              { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data );           },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err ); })
  }  
  
  revisaExitooFracaso( data ) { 
    let rs = data.recordset;
    if ( rs == undefined || rs.length==0 ) {
      this.funciones.muestraySale('ATENCION : Código de cliente no presenta documentos impagos.', 2 );
    } else {
      rs.forEach( fila => {
        if ( fila.estado == 'por vencer' ) { this.PorVencer.push( fila ); }
        else                               { this.Vencidos.push(  fila ); }
      });
    }
  }

  muestraID( pDocumento ) {
    this.navCtrl.push( DocumentoPage, { documento: pDocumento, cliente: this.cliente, usuario: this.usuario } );
  }

}

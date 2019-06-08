
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { FuncionesProvider } from '../../providers/funciones/funciones';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

@IonicPage()
@Component({
  selector: 'page-infoproducto',
  templateUrl: 'infoproducto.html',
})
export class InfoproductoPage {

  private barraTabs: any;  // variable para ocultar barra de tabs
  public  registros: any;   
  public  codigo:    string;
  public  descrip:   string;
  private cliente:   string;
  private sucursal:  string;
  private empresa:   string;
  private usuario:   any;

  constructor( private navParams: NavParams,
               private funciones: FuncionesProvider,
               private netWork:   NetworkEngineProvider ) {
      // parametros            
      this.codigo   = this.navParams.get( "producto" );
      this.descrip  = this.navParams.get( "descripc" );
      this.cliente  = this.navParams.get( "cliente"  );
      this.sucursal = this.navParams.get( "sucursal" );
      this.empresa  = this.navParams.get( "empresa"  );
      this.usuario  = this.navParams.get( "usuario"  );
      //console.log('<<<< InfoproductoPage >>>>', this.usuario);
      this.cargaInfoProducto();
      //
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.barraTabs  = this.funciones.hideTabs();
  }

  ionViewWillLeave() {
    this.funciones.showTabs( this.barraTabs );
  }

  cargaInfoProducto() {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_traeInfoProductos', { codigo:   this.codigo, 
                                                      cliente:  this.cliente,
                                                      sucursal: this.sucursal,
                                                      empresa:  this.empresa },
                                                    { codigo: this.usuario.KOFU,
                                                      nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data );           },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err ); })
  }  
  
  revisaExitooFracaso( data ) { 
    let rs = data.recordset;
    if ( rs == undefined || rs.length==0 ) {
      this.funciones.muestraySale('ATENCION : Producto y cliente no presentan documentos en conjunto', 2 );
    } else {
      this.registros = rs;  
    }
  }

}

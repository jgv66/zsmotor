
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FuncionesProvider }     from '../../providers/funciones/funciones';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { Infoproducto2Page }     from './../infoproducto2/infoproducto2';
import { Usuario }               from '../../model/modelos.model';

@IonicPage()
@Component({
  selector: 'page-documento',
  templateUrl: 'documento.html',
})
export class DocumentoPage {

  public cliente:   any;
  public detalle:   any;
  public documento: any;
  public usuario:   Usuario

  constructor(  public navCtrl:   NavController, 
                public navParams: NavParams,
                public funciones: FuncionesProvider,
                public netWork:   NetworkEngineProvider ) {
      this.documento = this.navParams.get( "documento" );                 
      this.cliente   = this.navParams.get( "cliente" );
      this.usuario   = this.navParams.get( "usuario");
  }

  ionViewDidLoad() {
    this.cargaDocumento( this.documento.id );
    //console.log('<<< DocumentoPage >>>',this.documento);
  }

  cargaDocumento( idDocumento ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_traeDocumento', { id: idDocumento }, { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFDoc( data );           },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err ); })
  }  
  
  revisaEoFDoc( data ) { 
    let rs = data.recordset;
    if ( rs == undefined || rs.length==0 ) {
      this.funciones.muestraySale('ATENCION : Código de cliente no presenta documentos impagos.', 2 );
    } else {
      this.detalle = rs;
    }
  }

  infoProd( pCodigo, pCliente, pSucCliente, pEmpresa, pDescrip ) {  
    //console.log(pCodigo, pCliente, pSucCliente, pEmpresa, pDescrip);
    this.navCtrl.push( Infoproducto2Page, { producto: pCodigo, 
                                            descripc: pDescrip,
                                            cliente:  pCliente, 
                                            sucursal: pSucCliente, 
                                            empresa:  pEmpresa,
                                            usuario:  this.usuario } );
  }

}


import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FuncionesProvider }     from '../../providers/funciones/funciones';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { Usuario }               from '../../model/modelos.model';

@IonicPage()
@Component({
  selector:    'page-buscar-clientes',
  templateUrl: 'buscar-clientes.html',
})
export class BuscarClientesPage {

  private barraTabs:      any;  // variable para ocultar barra de tabs
  public  listaClientes:  any = [];
  public  inilista:       any = null;  // primer registro codigo+sucursal
  public  finlista:       any = null;  // ultimo registro codigo+sucursal
  private callback:       any;
  public  data:           any;
  public  cliente:        any;
  private usuario:        Usuario;
  public  razonsocial:    string;
  public  codcliente:     string;

  constructor( private navCtrl:   NavController, 
               private navParams: NavParams,
               private funciones: FuncionesProvider,
               private netWork:   NetworkEngineProvider) {
        // paa devolver datos
        this.callback      = this.navParams.get('callback');
        this.data          = this.navParams.get('data') || '';
        this.usuario       = this.navParams.get( "usuario");
        this.finlista      = undefined;
        this.inilista      = undefined;
        //
        if ( this.cliente == undefined ) { this.cliente = this.funciones.initCliente(); };
  }

  ionViewDidLoad() {
    console.log('<<< BuscarClientesPage >>>');
  }
  ionViewWillEnter() {
    this.barraTabs = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.funciones.showTabs( this.barraTabs );
  }

  salir() {
    this.navCtrl.pop();
  }

  retornaCliente( cliente: string, event: any ) {
    this.callback( cliente ).then( () => { this.cliente = cliente; this.navCtrl.pop() });  
  }

  aBuscarClientes( pCliente, pRazonSoc, pInilista?, pFinLista? ) {
    //console.log(pCliente, pRazonSoc, pInilista, pFinLista );
    if ( pCliente == undefined && pRazonSoc == undefined && pInilista == "" && pFinLista == "" ) {
      this.funciones.msgAlert("Código vacío","Debe indicar datos para buscare algún cliente.");
    } else {
      this.funciones.cargaEspera();   // solo mostrar clientes principales para ctacte -->> tipo: 'p'
      this.netWork.traeUnSP( 'ksp_buscarClientes', 
                            { codcliente: pCliente, razonsocial: pRazonSoc, inilista: pInilista, finlista: pFinLista, tipo: 'p' }, 
                            { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )  
          .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                      err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err );  }
                    )
    }
  }  


  private revisaExitooFracaso( data ) { 
    let rs    = data.recordset;
    let largo = rs.length;
    if ( rs == undefined || rs.length==0 ) {
        this.funciones.msgAlert('ATENCION','Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( largo>0 ) {
      this.listaClientes = rs;
      this.inilista      = rs[0].codigo;
      this.finlista      = rs[largo-1].codigo;
    }
  }

}

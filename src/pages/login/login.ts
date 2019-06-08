import { Component }                from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { FuncionesProvider }     from '../../providers/funciones/funciones';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { BaseLocalProvider }     from '../../providers/base-local/base-local';
import { TabsPage }              from '../tabs/tabs';
import { NorecuerdoPage }        from '../norecuerdo/norecuerdo';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public rutocorreo:  string;
  public clave:       string;
  public auto_arriba: any;
  public auto_abajo:  any;

  constructor( public navCtrl:   NavController, 
               public funciones: FuncionesProvider,
               public netWork:   NetworkEngineProvider,
               public baseLocal: BaseLocalProvider ) {
      console.log('<<< LoginPage >>>');
      this.rutocorreo  = '';
      this.clave       = '';
      // aleatorios para cambiar imagenes
      this.auto_arriba = Math.trunc( (Math.random() * 7) + 1 );
      this.auto_abajo  = Math.trunc( (Math.random() * 7) + 1 );
      if ( this.auto_arriba == this.auto_abajo ) {
        this.auto_abajo  = Math.trunc( (Math.random() * 7) + 1 );
      }

  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.baseLocal.obtenUltimoUsuario()
        .then( pUsuario => {
          this.rutocorreo = pUsuario.EMAIL.trim();
          this.clave      = pUsuario.RTFU.trim();
          this.clave      = this.clave.slice(0,5);
        })
        .catch( err => console.log( 'Lectura de usuario con error->', err ) );
  }   

  salir() {
    this.navCtrl.pop();
  }

  // importante, rescata la configuracion 
  rescataConfiguracion() { 
    //console.log( '<<< rescataConfiguracion() >>>' );
    this.netWork.rescataSeteoCliente()
        .subscribe( data => { this.baseLocal.actualizarConfig( data.configp ); },
                    err  => { this.funciones.msgAlert( "ATENCION" , 'Ocurrió un error -> '+err ); }
                  )           
  }  

  logearme( rutocorreo, clave ) { 
    if ( rutocorreo == '' || clave == '' ) {
      this.funciones.msgAlert("Código vacío","Debe digitar usuario y clave para ingresar.");
    } else {
    //console.log( '<<< logearme() >>>', rutocorreo, clave );
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_buscarUsuario', { rutocorreo: rutocorreo, clave: clave }, { codigo: rutocorreo , nombre: rutocorreo } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( "ATENCION" , 'Ocurrió un error -> '+err ); }
                  )
    }           
  }
  
  private revisaExitooFracaso( data ) { 
    //console.log( data.recordset );
    let rs = data.recordset[0];
    if ( rs.length==0 ) {
        this.funciones.msgAlert('ATENCION','Los datos ingresados no coinciden con usuarios registrados. Corrija o póngase en contacto con su administrador.');
    } else {
        this.rescataConfiguracion();
        //this.funciones.msgAlert('Bienvenido !','Hola '+data[0].nombre );
        this.funciones.muestraySale( 'Hola '+rs.NOKOFU+', '+this.funciones.textoSaludo(), 1.5 );
        this.baseLocal.guardaUltimoUsuario( rs );
        this.navCtrl.push( TabsPage, rs );
    }    
  }

  noRecuerdo() { 
    this.navCtrl.push( NorecuerdoPage );
  }

}
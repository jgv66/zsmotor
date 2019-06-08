
import { Component, ViewChild, OnInit, Renderer, Input }    from '@angular/core';
import { AlertController, NavController, ModalController }  from 'ionic-angular';

import { BaseLocalProvider }      from '../../providers/base-local/base-local';
import { FuncionesProvider }      from '../../providers/funciones/funciones';
import { NetworkEngineProvider }  from '../../providers/network-engine/network-engine';
import { DatoscorreoPage }        from '../../pages/datoscorreo/datoscorreo';

@Component({
  selector:     'acordeon',
  templateUrl:  'acordeon.html'
})

export class AcordeonComponent implements OnInit {
  //
  @ViewChild("ccmodalidad")  cardContent_M:  any;
  @ViewChild("ccfiltros")    cardContent_F:  any;
  @ViewChild("ccordenar")    cardContent_O:  any;
  @ViewChild("ccgrabar")     cardContent_G:  any;
  //
  @Input("titulo")   titulo:   string;
  @Input("usuario")  usuario:  any;
  @Input("mostrar")  mostrar:  any;
  @Input("config")   config:   any;
  @Input("carrito")  carrito:  any;
  @Input("textoObs") textoObs: any;
  @Input("textoOcc") textoOcc: any;
  //
  public expandido: any = false;
  public icon:      string = "arrow-forward";
  //
  public queHacerConCarrito: string = "Acción a realizar?" ;
  // 
  constructor( public  renderer:      Renderer,
               public  funciones:     FuncionesProvider,
               public  netWork:       NetworkEngineProvider,
               public  alertCtrl:     AlertController,
               public  baseLocal:     BaseLocalProvider,
               public  navCtrl:       NavController,
               private modalCtrl:     ModalController ) {
    console.log("<<< AcordeonComponent >>>");
  }

  ngOnInit() {
    this.renderer.setElementStyle( this.cardContent_M.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms" );
    this.renderer.setElementStyle( this.cardContent_F.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms" );
    this.renderer.setElementStyle( this.cardContent_O.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms" );
    this.renderer.setElementStyle( this.cardContent_G.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms" );
  }

  colapsarAcordeon() {
    if ( this.mostrar == "filtros" ) {
      if ( this.expandido ) {
        this.renderer.setElementStyle( this.cardContent_F.nativeElement, "max-height", "0px" );
        this.renderer.setElementStyle( this.cardContent_F.nativeElement, "padding",    "0px 12px" );
      } else {
        this.renderer.setElementStyle( this.cardContent_F.nativeElement, "max-height", "500px" );
        this.renderer.setElementStyle( this.cardContent_F.nativeElement, "padding",    "15px 12px" );
      }
      this.expandido  = !this.expandido;
      this.icon       = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward" ;
    } else if ( this.mostrar == "modalidad"  ) {
      if ( this.expandido ) {
        this.renderer.setElementStyle( this.cardContent_M.nativeElement, "max-height", "0px" );
        this.renderer.setElementStyle( this.cardContent_M.nativeElement, "padding",    "0px 12px" );
      } else {
        this.renderer.setElementStyle( this.cardContent_M.nativeElement, "max-height", "500px" );
        this.renderer.setElementStyle( this.cardContent_M.nativeElement, "padding",    "15px 12px" );
      }
      this.expandido = !this.expandido;
      this.icon       = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward" ;
    } else if ( this.mostrar == "ordenar"  ) {
      if ( this.expandido ) {
        this.renderer.setElementStyle( this.cardContent_O.nativeElement, "max-height", "0px" );
        this.renderer.setElementStyle( this.cardContent_O.nativeElement, "padding",    "0px 12px" );
      } else {
        this.renderer.setElementStyle( this.cardContent_O.nativeElement, "max-height", "500px" );
        this.renderer.setElementStyle( this.cardContent_O.nativeElement, "padding",    "15px 12px" );
      }
      this.expandido = !this.expandido;
      this.icon       = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward" ;
    } else if ( this.mostrar == "carrito" ) {
      if ( this.expandido ) {
        this.renderer.setElementStyle( this.cardContent_G.nativeElement, "max-height", "0px" );
        this.renderer.setElementStyle( this.cardContent_G.nativeElement, "padding",    "0px 12px" );
      } else {
        this.renderer.setElementStyle( this.cardContent_G.nativeElement, "max-height", "500px" );
        this.renderer.setElementStyle( this.cardContent_G.nativeElement, "padding",    "15px 12px" );
      }
      this.expandido = !this.expandido;
      this.icon       = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward" ;
    }
  }

  cambiarBodega() {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_BodegaMias', { empresa: '01' }, {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFBM( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err );  }
                  )
  }

  private revisaEoFBM( data ) { 
    let rs      = data.recordset;
    let largo   = 0;
    largo = rs.length;
    if ( rs == undefined || largo==0 ) {
      this.funciones.msgAlert('ATENCION','Usted no tiene permiso para revisar todas las bodegas. Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.seleccionarBodega( rs );
    }
  } 
  
  private seleccionarBodega( bodegas ) {
    if ( bodegas.length ) {
        let alert = this.alertCtrl.create();
        alert.setTitle("Bodegas disponibles" );
        //
        bodegas.forEach( element => {
          alert.addInput({ 
              type: 'radio', 
              label: element.bodega+" [ " +element.nombrebodega.trim()+" ]", 
              value: element } );  
        });
        //
        alert.addButton( 'Cancelar' );                  
        alert.addButton({ text:'Ok', handler: data => { this.usuario.BODEGA   = data.bodega;
                                                        this.usuario.SUCURSAL = data.sucursal;
                                                        this.usuario.NOKOBO   = data.nombrebodega;
                                                        this.baseLocal.guardaUltimoUsuario( this.usuario ) } })
        //
        alert.present()
          .then( ()   => { null } )
          .catch( ()  => { null } )
    } else {
        this.funciones.msgAlert('ATENCION','Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas. Intente con otros datos.' );
    }
  }

  cambiarLista() {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_ListasMias', 
                           { empresa: '01' }, 
                           { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFLP( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err );  }
                  )
  }

  private revisaEoFLP( data ) {
    let rs      = data.recordset;
    let largo   = 0;
    largo       = rs.length;
    if ( rs == undefined || largo==0 ) {
      this.funciones.msgAlert('ATENCION','Usted no tiene permiso para revisar todas las listas. Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.seleccionarLista( rs );
    }
  } 
  
  private seleccionarLista( listas ) {
    if ( listas.length ) {
        let alert = this.alertCtrl.create();
        alert.setTitle("Listas de Precio" );
        //
        listas.forEach( element => {
          alert.addInput({ 
              type: 'radio', 
              label: "( "+element.listaprecio+"/"+element.tipolista +" ) "+ element.nombrelista.trim(),
              value: element } );  
        });
        //
        alert.addButton( 'Cancelar' );
        alert.addButton({ text:'Ok', handler: data => { this.usuario.LISTAMODALIDAD = data.listaprecio;
                                                        this.usuario.NOKOLT         = data.nombrelista;
                                                        this.baseLocal.guardaUltimoUsuario( this.usuario ) } })
        //
        alert.present()
          .then( ()   => { null } )
          .catch( ()  => { null } )
    } else {
        this.funciones.msgAlert('ATENCION','Sin permiso para revisar todas las listas de precio. Intente con otros datos.' );
    }
  }
  
  accionDelCarrito() {
    if      ( this.queHacerConCarrito == 'Grabar una Pre-Venta' )  { this.enviarCarrito( "PRE" ); }
    else if ( this.queHacerConCarrito == 'Grabar una cotización' ) { this.enviarCarrito( "COV" ); }
    else if ( this.queHacerConCarrito == 'Grabar NVV definitiva' ) { this.enviarCarrito( "NVV" ); } 
    else if ( this.queHacerConCarrito == 'Solo enviar un correo' ) { this.enviarCorreo();         }
  }

  enviarCarrito( cTipoDoc ) {
    this.funciones.cargaEspera();
    this.netWork.grabarDocumentos( this.carrito, this.usuario.MODALIDAD, cTipoDoc, this.textoObs, this.textoOcc )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaExitooFracaso( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( "ATENCION" , 'Ocurrió un error -> '+err ); }
      )           
  }

  private revisaExitooFracaso( data ) { 
    if ( data.length==0 ) {
        this.funciones.msgAlert('ATENCION','Los datos ingresados podrían estar incorrectos. Vuelva a revisar y reintente.')
    } else { 
      try { 
        if ( data.resultado == 'ok' ) {
            this.funciones.msgAlert('Documento #'+data.numero,'Su Nro. de documento es el '+data.numero+'. Ya ha llegado al sistema. Una copia del documento será despachado a su correo para verificación. Gracias por utilizar nuestro carro de compras.' );
            this.funciones.initCarro();
            this.navCtrl.parent.select(0);
        } else {
            this.revisaError(data);
        }
      }
      catch (e) {
        this.funciones.msgAlert('ATENCION','Ocurrió un error al intentar guardar el documento ->'+e ); 
      }
    } 
  }

  private revisaError( data ) {
    console.log( 'Error en grabación ', data )
  }

  enviarCorreo() {
    let rescataCorreo = this.modalCtrl.create( DatoscorreoPage );
    rescataCorreo.onDidDismiss( data => {
      //console.log(data);
      if ( data.xto != '' || data.xto != undefined ) {
        this.funciones.cargaEspera();
        this.netWork.soloEnviarCorreo( this.carrito, data.xto, data.xcc, this.textoObs )
            .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFCorreo( data ); },
                        err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( "ATENCION" , 'Ocurrió un error -> '+err ); }
          )           
      } else {
        this.funciones.msgAlert( "Correo vacío", "Debe indicar datos para enviar el correo." );
      }
    });    
    rescataCorreo.present();
  }

  private revisaEoFCorreo( data ) {
    try { 
      if ( data.resultado == 'ok' ) {
          this.funciones.msgAlert('Correo enviado','El correo fue enviado exitosamente.');
          this.funciones.initCarro();
          this.navCtrl.parent.select(0);
      } else {
        this.funciones.msgAlert('Correo con problemas','El correo aparentemente no fue enviado. Reintente luego.');
      }
    }
    catch (e) {
      this.funciones.msgAlert('ATENCION','Ocurrió un error al intentar enviar el correo -> '+e ); 
    }
  }

}

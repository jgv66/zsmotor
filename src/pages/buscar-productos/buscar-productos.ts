
import { Component, ViewChild  }                              from '@angular/core';
import { IonicPage, AlertController, NavController, Content } from 'ionic-angular';
import { BarcodeScanner }                                     from '@ionic-native/barcode-scanner';
import { Clipboard }                                          from '@ionic-native/clipboard';

import { FuncionesProvider }      from '../../providers/funciones/funciones';
import { NetworkEngineProvider }  from '../../providers/network-engine/network-engine';
import { BaseLocalProvider }      from '../../providers/base-local/base-local';
import { Cliente, Configuracion } from '../../model/modelos.model';
import { MenuSeteoPage }          from '../menu-seteo/menu-seteo';

@IonicPage()
@Component({
  selector: 'page-buscar-productos',
  templateUrl: 'buscar-productos.html',
})

export class BuscarProductosPage {

  @ViewChild( Content ) content: Content;

  public lScrollInfinito: boolean = false;

  public  listaProductos: any = [];
  public  offset:         number = 0;  // primer registro codigo+sucursal
  public  codproducto:    string;
  private pProd:          string;
  public  descripcion:    string;
  private pDesc:          string;
  public  usuario:        any;
  public  Carro:          any = [];
  public  results:        any = {};
  public  cliente:        Cliente;
  public  config:         Configuracion;
  private firstcall:      boolean;
  public  filtroFamilias: Boolean;
  public  codFamilias:    string;
  private pFami:          string;
  public  Importados:     any = [];
  private tap:            number = 0;
  // familias zsmotor   jgv 01-05-2018 
  public  listaFamilias:  any = [{ cod: 'NEUM', descrip: 'Neumáticos'            },             
                                 { cod: 'LLAN', descrip: 'Llantas'               },             
                                 { cod: 'AEXT', descrip: 'Accesorios exterior'   },     
                                 { cod: 'AINT', descrip: 'Accesorios interior'   },     
                                 { cod: 'ACCL', descrip: 'Accesorios llantas'    },       
                                 { cod: 'DET ', descrip: 'Detailing'             },               
                                 { cod: 'ILUM', descrip: 'Iluminación'           },                
                                 { cod: '4X4 ', descrip: 'Off Road'              },                
                                 { cod: 'SEGU', descrip: 'Protección y seguridad'},  
                                 { cod: 'THUL', descrip: 'Thule'                 },                   
                                 { cod: 'TUNI', descrip: 'Tunning'               } ];               
  //
  constructor( private funciones: FuncionesProvider,
               private netWork:   NetworkEngineProvider,
               private baseLocal: BaseLocalProvider,
               private barcode:   BarcodeScanner, 
               private alertCtrl: AlertController,
               private navCtrl:   NavController,
               private clipboard: Clipboard ) {
    // variables locales
    this.codproducto  = '';
    this.descripcion  = '';
    this.usuario      = this.baseLocal.user;
    this.inicializa();
    this.cliente      = this.funciones.initCliente();
    //
    this.firstcall      = true;
    this.filtroFamilias = false;
    this.codFamilias    = '';
    //
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    if ( !this.firstcall ) {
      this.funciones.obtenUltimoCliente().then( data => { this.cliente = data } ) ;
    } else {
      this.firstcall = false;
      this.funciones.guardaUltimoCliente( this.cliente );
    };
    this.baseLocal.obtenUltimoConfig().then( data => { this.config = data } );
  }
  ionViewWillLeave() {
  }

  inicializa() {
    this.cliente = this.funciones.initCliente()
    this.baseLocal.obtenUltimoConfig().then( data => { this.config = data } );
  }

  aBuscarProductos( pProducto?, pDescripcion?, pCodFamilias?, xdesde?, infiniteScroll? ) {
    if ( pProducto == '' && pDescripcion == '' && pCodFamilias == '' ) {
      this.funciones.msgAlert("DATOS VACIOS","Debe indicar algún dato para buscar...")
    } else {
      // 
      if ( xdesde == 1 ) { 
        this.funciones.cargaEspera();
        this.offset          = 0 ; 
        this.listaProductos  = [];
        this.pProd           = pProducto ;
        this.pDesc           = pDescripcion ;
        this.pFami           = pCodFamilias ;
        this.lScrollInfinito = true;
      } else { 
        this.offset += 20 ; 
        pProducto    = this.pProd ;
        pDescripcion = this.pDesc ;
        pCodFamilias = this.pFami ;  
      } 
      //
      if ( pCodFamilias == this.listaProductos ) pCodFamilias = '';
      this.netWork.traeUnSP( 'ksp_buscarProductos_v7', {  codproducto:   pProducto, 
                                                          descripcion:   pDescripcion, 
                                                          bodega:        this.usuario.BODEGA, 
                                                          offset:        this.offset.toString(), 
                                                          usuario:       this.usuario,
                                                          soloconstock:  this.config.soloconstock,
                                                          ordenar:       this.config.ordenar,
                                                          soloverimport: this.config.soloverimport,
                                                          familias:      pCodFamilias },
                                                        { codigo:  this.usuario.KOFU,
                                                          nombre:  this.usuario.NOKOFU,
                                                          empresa: this.usuario.EMPRESA } )
          .subscribe( data => { if ( xdesde == 1 ) { this.funciones.descargaEspera(); }; 
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll ); },
                      err  => { this.funciones.descargaEspera(); 
                                this.funciones.msgAlert( 'ATENCION' ,err );  }
                    )
    }
  }  

  private revisaExitooFracaso( data, xdesde, infiniteScroll ) { 
    let rs    = data.recordset;
    let largo = 0;
    let i     = 0;
    largo = rs.length;
    if ( rs == undefined || largo==0 ) {
      this.funciones.msgAlert('ATENCION','Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( largo>0 ) {
      this.listaProductos = this.offset==0 ? rs : this.listaProductos.concat(rs);
      // aqui detengo el scroll
      if ( infiniteScroll ) { 
        infiniteScroll.complete();    
      }
      if        ( largo < 20  ) { this.lScrollInfinito = false; 
      } else if ( xdesde == 1 ) { this.lScrollInfinito = true ;       
      } 
      //
      this.listaProductos.forEach( fila => {
        if ( this.config.ocultardscto ) {
          this.listaProductos[i].descuentomax = 0;
          this.listaProductos[i].preciomayor  = this.listaProductos[i].precio;
          i++;
        }
      });
    }
  }

  masDatos( infiniteScroll ) {
    this.aBuscarProductos( this.pProd, this.pDesc, this.pFami, 0, infiniteScroll );
  }

  async scanBarcode() {
    try {
      await this.barcode.scan()
                .then( barcodeData => {
                      this.codproducto = barcodeData.text.trim();
                      this.descripcion = '';
                      this.aBuscarProductos( this.codproducto, '', '', 1 );
                }, (err) => {
                    // An error occurred
                });
    } catch(error) {
      console.error(error);
    } 
  }

  cargaListas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_ListasProducto', 
                           { codproducto: producto.codigo, usuario: this.usuario, empresa: '01' }, 
                           {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFLP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err );  }
                  )
  }

  private revisaEoFLP( producto, data ) {
    let rs      = data.recordset;
    let largo   = 0;
    largo       = rs.length;
    if ( rs == undefined || largo==0 ) {
      this.funciones.msgAlert('ATENCION','Producto sin asignacion a listas de precio o usted no tiene permiso para revisar todas las listas. Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.seleccionarLista( producto, rs );
    }
  } 
  
  private seleccionarLista( producto, listas ) {
    if ( listas.length ) {
        let alert = this.alertCtrl.create();
        alert.setTitle("Precios para : " + producto.codigo );
        //
        listas.forEach( element => {
          alert.addInput({ 
              type: 'radio', 
              label: "("+element.metodolista+"/"+element.listaprecio +") -> "+ 
                          element.monedalista.trim()+"   "+ 
                          element.precio1.toLocaleString("es-ES")+this.CeroBlanco(element.descuentomax1),
              value: element } );  
        });
        //
        alert.addButton( 'Cancelar' );
        alert.addButton({ text:'Ok', handler: data => { this.cambiaListaProductos( data, producto, 2 ) } })
        //
        alert.present()
          .then( ()   => { null } )
          .catch( ()  => { null } )
    } else {
        this.funciones.msgAlert('ATENCION','Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas. Intente con otros datos.' );
    }
  }

  private CeroBlanco( valor ) {
    if ( valor==0 ) {
        return '';
    } else {
        return "      ("+valor.toLocaleString("es-ES")+"%)";
    }
  }
  
  cargaBodegas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_BodegaProducto', { codproducto: producto.codigo, usuario: this.usuario, empresa: '01' }, {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFBP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err );  }
                  )
  }

  private revisaEoFBP( producto, data ) { 
    let rs      = data.recordset;
    let largo   = 0;
    largo = rs.length;
    if ( rs == undefined || largo==0 ) {
      this.funciones.msgAlert('ATENCION','Producto sin stock, sin asignación a bodegas o usted no tiene permiso para revisar todas las bodegas. Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.seleccionarBodega( producto, rs );
    }
  } 
  
  private seleccionarBodega( producto, bodegas ) {
    if ( bodegas.length ) {
        let alert = this.alertCtrl.create();
        alert.setTitle("Bodegas con stock para : " + producto.codigo );
        //
        bodegas.forEach( element => {
          alert.addInput({ 
              type: 'radio', 
              label: "Stock: "+element.stock_ud1.toString() + " [ " +element.nombrebodega.trim()+" ]", 
              value: element } );  
        });
        //
        alert.addButton( 'Cancelar' );
        alert.addButton({ text:'Ok', handler: data => { this.cambiaListaProductos( data, producto, 1 ) } })
        //
        alert.present()
          .then( ()   => { null } )
          .catch( ()  => { null } )
    } else {
        this.funciones.msgAlert('ATENCION','Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas. Intente con otros datos.' );
    }
  }

  cambiaListaProductos( data, producto, caso ) {
    let i = 0;
    if ( caso == 1 ) { 
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo == producto.codigo ) {
            producto.stock_ud1    = data.stock_ud1;
            producto.bodega       = data.bodega;
            producto.sucursal     = data.sucursal;
            producto.nombrebodega = data.nombrebodega;
            producto.apedir       = 1;
        };
        ++i;
      });
    } else if ( caso == 2 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo == producto.codigo ) {
            producto.precio       = data.precio1;
            producto.preciomayor  = data.preciomayor1;
            producto.montolinea   = data.montolinea1;
            producto.descuentomax = data.descuentomax1;
            producto.dsctovalor   = data.dsctovalor1;
            producto.tipolista    = data.tipolista;
            producto.metodolista  = data.metodolista;
            producto.listaprecio  = data.listaprecio;
          };
        ++i;
      });
    }
  }

  agregarAlCarro( producto, cliente ) {
    this.funciones.pideCantidad( producto, cliente, this.usuario );
  }

  totalDelPedido() {
    this.funciones.msgAlert( 'ATENCION', 'La suma hasta ahora de su pedido es de : $'+this.funciones.sumaCarrito() );
  }

  ConfiguracionLocal(){
    this.navCtrl.push( MenuSeteoPage, { usuario: this.usuario } ) ;
  } 

  masOpciones(){
    this.filtroFamilias = !this.filtroFamilias ;
    if ( !this.filtroFamilias ) this.codFamilias = '';
  } 

  limpiarCliente() {
    let confirm = this.alertCtrl.create({
      title: 'Limpiar datos',
      message: 'Iniciará búsquedas sin mencionar a cliente y no podrá agregar al carro sin este dato. Desea limpiar los datos del cliente activo?',
      buttons: [
                  { text: 'No, gracias', handler: () => { null } },
                  { text: 'Sí, limpiar', handler: () => { this.cliente = this.funciones.initCliente(); 
                                                          this.funciones.guardaUltimoCliente( this.cliente ); } }
               ]
    });
    confirm.present();
  }

  limpiarTextos( caso: number ) {
    if ( caso == 1 )      { this.codproducto = ''; } 
    else if ( caso == 2 ) { this.descripcion = ''; }
  }

  largoListaProductos() {
    return this.listaProductos.length;
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  cambiaDescuento( producto ) {
    let dmax   = producto.descuentomax;
    let prompt = this.alertCtrl.create({
      title:   "Descto. Máximo : "+producto.descuentomax.toString()+"%",
      message: "Ingrese el nuevo descuento máximo a utilizar.",
      inputs:  [ { name: "dmax", placeholder: dmax } ],
      buttons: [
        { text: 'Salir',     handler: data => { null } },
        { text: 'Cambiar !', handler: data => { 
          if ( data.dmax < 0 || data.dmax > 100 ) {
            this.funciones.msgAlert('ATENCION','Descuento digitado está incorrecto. Intente con otro valor.');
          } else {
            producto.descuentomax = data.dmax;
            producto.preciomayor  = Math.round((producto.precio-(producto.precio*data.dmax/100)));
            producto.dsctovalor   = producto.precio - producto.preciomayor;
          }
        } }
      ]
    });
    prompt.present();
  }

  cargaDatoImportado( codproducto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_EnImportaciones', 
                           { codproducto: codproducto, usuario: this.usuario, empresa: '01' }, 
                           { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); 
                              this.Importados = data.recordset; 
                              this.muestraImportados( codproducto ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' ,err ); }
                  )
  }

  private muestraImportados( codproducto ) {
    if ( this.Importados.length ) {
        let alert = this.alertCtrl.create();
        alert.setTitle("Importaciones : " + codproducto );
        //
        this.Importados.forEach( element => {
          alert.addInput({ 
              type: 'checkbox', 
              label: "Q: "+element.cantidad.toString() + "  [ Fecha: " +element.fecha+" ]", 
              value: element } );  
        });
        //
        //alert.addButton( 'Cancelar' );
        alert.addButton({ text:'Ok', handler: data => { null } })
        //
        alert.present()
          .then( ()   => { null } )
          .catch( ()  => { null } )
    } else {
        this.funciones.msgAlert('ATENCION','Producto sin importaciones. Intente con otros datos.' );
    }
  }

  PresionaryCopiar( event, producto ) {
    //
    let texto = '';
    // console.log(this.tap);
    if ( ++this.tap >= 3 ) { 

        texto += 'Código : '+producto.codigo+'\n';
        texto += 'Descripcion : '+producto.descripcion+'\n' ;
        texto += 'Bodega ('+producto.bodega.trim()+') : '+producto.nombrebodega+'\n' ;
        //
        if ( producto.preciomayor > 0 ) {
          //texto += 'Precio '+producto.tipolista+' : '+this.funciones.numberFormat(producto.preciomayor)+'\n\n' ;
          texto += 'Precio '+producto.tipolista+' : '+producto.preciomayor.toLocaleString()+'\n\n' ;
        }
        //
        texto +="http://www.zsmotor.cl/img/Producto/"+producto.codigo.trim()+"/"+producto.codigo.trim()+".jpg"+'\n' ;
        //
        this.clipboard.copy( texto );
        //
        this.tap = 0 ;
        //
        this.funciones.muestraySale("Copiado al porta-papeles...",1,'middle');
        //
      }
  }
  
}


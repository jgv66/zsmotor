
import { Injectable }       from '@angular/core';
import { ToastController }  from 'ionic-angular';
import { Storage }          from '@ionic/storage';
import { LoadingController, AlertController } from 'ionic-angular';

import { NetworkEngineProvider }              from '../network-engine/network-engine';
import { Usuario, Cliente }                   from '../../model/modelos.model'; 
import { BaseLocalProvider }                  from '../base-local/base-local';

@Injectable()
export class FuncionesProvider {

  private loader:          any;
  public  usuario:         Usuario;
  public  cliente:         Cliente;
  public  config:          any;
  public  copiaPendientes: any;
  public  pendientes:      number;
  public  misCompras:      number = 0;
  public  documento:       any;
  public  miCarrito:       Array<{ empresa: string, 
                                   vendedor: string, 
                                   bodega: string, 
                                   sucursal: string, 
                                   cliente: string, 
                                   suc_cliente: string, 
                                   codigo: string,
                                   descrip: string; 
                                   cantidad: number, 
                                   stock_ud1: number, 
                                   precio: number, 
                                   preciomayor: number,
                                   descuentomax: number,
                                   listapre: string,
                                   metodolista: string }>;  

  constructor( public netWork:     NetworkEngineProvider,
               public loadingCtrl: LoadingController,
               public toastCtrl:   ToastController,
               public alertCtrl:   AlertController,
               public storage:     Storage,
               public baseLocal:   BaseLocalProvider ) {
    console.log('<<< FuncionesProvider >>>');
    this.inicializaTodo();
  }

  textoSaludo() {
    let dia   = new Date();
    if      ( dia.getHours() >= 8  && dia.getHours() < 12 ) { return 'buenos días ';   } 
    else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) { return 'buenas tardes '; } 
    else                                                    { return 'buenas noches '; }
  }

  hideTabs() {
    let estilo = '';
    let elem   = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      estilo             = elem.style.display;  // se guarda
      elem.style.display = 'none';              // se anula
    }
    return estilo;
  }

  showTabs( estilo ) {
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = estilo;              
    }
  }

  cargaEspera() {
    this.loader = this.loadingCtrl.create({
      content: "Favor esperar...",
      duration: 3000
      }); 
    this.loader.present();
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  msgAlert( titulo, texto ) {
    let alert = this.alertCtrl.create(
      { title: titulo,
        subTitle: texto,
        buttons: ['OK']
      });
    alert.present();
  } 

  muestraySale( cTexto, segundos, posicion? ) {
    let toast = this.toastCtrl.create( {
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle'
    });
    toast.present();
  }

  inicializaTodo() {
    this.usuario    = this.baseLocal.initUsuario();
    this.cliente    = this.initCliente();
    this.config     = this.baseLocal.initConfig(); 
    this.pendientes = 0;
    this.initCarro(); 
  }

  initCarro() {
    this.miCarrito  = [{ empresa:'', vendedor:'', bodega:'', sucursal:'', 
                         cliente:'', suc_cliente:'', 
                         codigo:'', descrip:'', cantidad:0, stock_ud1:0, precio:0, preciomayor:0, descuentomax:0, 
                         listapre:'', metodolista:'' }];
    this.misCompras = 0;
  }

  initCliente() {
    this.usuario.LISTACLIENTE = '';
    return { codigo:'',sucursal:'',razonsocial:'',direccion:'',ciudad:'',comuna:'',vendedor:'',nombrevendedor:'',listaprecios:'',nombrelista:'',email:''};
  }

  guardaUltimoCliente( data ) {
    //console.log('guardaUltimoCliente()', data );
    this.cliente = data;
    this.storage.set( 'ktp_ultimo_cliente',  this.cliente );
  }

  obtenUltimoCliente() {
    return this.storage.get('ktp_ultimo_cliente')
      .then( pCliente => { 
          this.cliente = pCliente == null ? this.initCliente() : pCliente;
          return this.cliente;
      });
  }
  
  pideCantidad( producto, cliente, usuario ) {
    let cantidad = "1";
    let prompt = this.alertCtrl.create({
      title:   "Stock Bodega : "+producto.stock_ud1.toString(),
      message: "Ingrese la cantidad a solicitar de este producto. No debe sobrepasar el stock actual ni lo pedido si ya existe en el carro. El sistema lo validará",
      inputs:  [ { name: "cantidad", placeholder: cantidad } ],
      buttons: [
        { text: 'Cancelar', handler: data => {  null                 } },
        { text: 'Guardar',  handler: data => {  producto.apedir = parseInt(data.cantidad) || 1 ;
                                                this.Add2Cart( producto, cliente, usuario ); } }
      ]
    });
    prompt.present();
  }
  
  modificaCantidad( producto, cliente ) {
    let cantidad = producto.cantidad;
    let prompt = this.alertCtrl.create({
      title:   "Stock Bodega : "+producto.stock_ud1.toString(),
      message: "Ingrese la cantidad a solicitar de este producto. No debe sobrepasar el stock actual ni la suma de lo pedido. El sistema lo validará",
      inputs:  [ { name: "cantidad", placeholder: cantidad } ],
      buttons: [
        { text: 'Salir',   handler: data => { null } },
        { text: 'Cambiar !', handler: data => { 
          producto.apedir = parseInt(data.cantidad) || 1 ;
          if ( producto.apedir > producto.stock_ud1  ) {
            this.msgAlert('ATENCION','Stock insuficiente para esta operación. Intente con otra cantidad.');
          } else {
            const largo = this.miCarrito.length;
            for ( var i = 0 ; i < largo ; i++ ) {
                if ( this.miCarrito[i].codigo.trim() == producto.codigo.trim() && this.miCarrito[i].bodega.trim() == producto.bodega.trim() ) { 
                     this.miCarrito[i].cantidad = producto.apedir;
                };
            };
          }
        } }
      ]
    });
    prompt.present();
  }
  
  Add2Cart( producto, cliente, usuario ) {
    if ( this.stockAlcanza( producto )  ) {
        if ( this.aunVacioElCarrito() ) {
            this.miCarrito[0].empresa     = usuario.EMPRESA;
            this.miCarrito[0].vendedor    = usuario.KOFU;
            this.miCarrito[0].bodega      = producto.bodega;
            this.miCarrito[0].sucursal    = producto.sucursal;
            this.miCarrito[0].cliente     = cliente.codigo;
            this.miCarrito[0].suc_cliente = cliente.sucursal;
            this.miCarrito[0].codigo      = producto.codigo;
            this.miCarrito[0].descrip     = producto.descripcion;
            this.miCarrito[0].cantidad    = producto.apedir;
            this.miCarrito[0].stock_ud1   = producto.stock_ud1;
            this.miCarrito[0].precio      = producto.precio;
            this.miCarrito[0].preciomayor = producto.preciomayor;
            this.miCarrito[0].descuentomax= producto.descuentomax;
            this.miCarrito[0].listapre    = producto.listaprecio;
            this.miCarrito[0].metodolista = producto.metodolista;
        } else if ( this.existeEnCarrito( producto ) ) {
            this.agregaACarrito( producto );
        } else {
            this.miCarrito.push({ empresa:      usuario.EMPRESA,
                                  vendedor:     usuario.KOFU,
                                  bodega:       producto.bodega,
                                  sucursal:     producto.sucursal,
                                  cliente:      cliente.codigo,
                                  suc_cliente:  cliente.sucursal,
                                  codigo:       producto.codigo, 
                                  descrip:      producto.descripcion,
                                  cantidad:     producto.apedir, 
                                  stock_ud1:    producto.stock_ud1,
                                  precio:       producto.precio,
                                  preciomayor:  producto.preciomayor,
                                  descuentomax: producto.descuentomax,
                                  listapre:     producto.listaprecio,
                                  metodolista:  producto.metodolista });
        };
        this.misCompras = this.miCarrito.length ;
        this.muestraySale( "Item agregado a pre-venta", 1, 'bottom' );
    } else {
      this.msgAlert('ATENCION','Stock insuficiente para esta operación. Intente con otra cantidad.');
    }    
  }

  private stockAlcanza( producto ) {
    let stock = 0;
    const largo = this.miCarrito.length;
    for ( var i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].codigo == producto.codigo && this.miCarrito[i].bodega == producto.bodega ) { 
          stock += this.miCarrito[i].cantidad;
        };
    };
    return ( (stock + producto.apedir ) <= producto.stock_ud1 ) ;
  }

  private existeEnCarrito( producto ) {
    let existe = false ;
    const largo = this.miCarrito.length;
    for ( var i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].codigo.trim() == producto.codigo.trim() && this.miCarrito[i].bodega.trim() == producto.bodega.trim() ) { 
            existe = true;
            break;
        };
        ++i
    };
    return existe;
  }

  private agregaACarrito( producto ) {
    const largo = this.miCarrito.length;
    for ( var i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].codigo.trim() == producto.codigo.trim() && this.miCarrito[i].bodega.trim() == producto.bodega.trim() ) { 
             this.miCarrito[i].cantidad += producto.apedir;
        };
        ++i
    };
  }

  private aunVacioElCarrito() {
    return ( this.miCarrito.length == 1 && this.miCarrito[0].codigo == '' );
  }

  sumaCarrito() {
    let tot = 0;
    const largo = this.miCarrito.length;
    for ( var i = 0 ; i < largo ; i++ ) {
        if ( this.miCarrito[i].descuentomax<=0 || this.miCarrito[i].descuentomax == undefined ) { 
            tot += this.miCarrito[i].cantidad * this.miCarrito[i].precio; 
        } else {
            tot += this.miCarrito[i].cantidad * this.miCarrito[i].preciomayor; 
        }
    };
    return tot;
  }

  cuantosProductosEnCarroTengo() {
    let tot = 0;
    const largo = this.miCarrito.length;
    for ( var i = 0 ; i < largo ; i++ ) {
      if ( this.miCarrito[i].codigo!='' ) { 
          tot += 1; 
      }; 
    };
    return tot;
  }

  quitarDelCarro( producto ) {
    let i = 0;
    if ( !this.aunVacioElCarrito() ) {
        this.miCarrito.forEach(element => {
          if ( this.miCarrito[i].codigo == producto.codigo && this.miCarrito[i].bodega == producto.bodega ) {         
            this.miCarrito.splice(i, 1);
          };
          ++i;  
        });  
    };
    if ( this.miCarrito.length == 0 ) {
         this.initCarro();
    }
    this.misCompras = this.miCarrito.length;
  }

  numberFormat( numero ) {

      // Variable que contendra el resultado final
      var resultado   = '';
      var nuevoNumero = '';

      // Si el numero empieza por el valor "-" (numero negativo)
      if( numero[0] == "-" )
      {
          // Cogemos el numero eliminando los posibles puntos que tenga, y sin el signo negativo
          nuevoNumero = numero.replace(/\./g,'').substring(1);
      }else{
          // Cogemos el numero eliminando los posibles puntos que tenga
          nuevoNumero = numero.replace(/\./g,'');
      }

      // Si tiene decimales, se los quitamos al numero
      if( numero.indexOf(",")>=0 )
          nuevoNumero = nuevoNumero.substring(0,nuevoNumero.indexOf(","));

      // Ponemos un punto cada 3 caracteres
      var j = 0;
      for ( var i = nuevoNumero.length - 1; i >= 0 ; i--, j++ ) {
        resultado = nuevoNumero.charAt(i) + ( (j > 0) && (j % 3 == 0) ? "." : "" ) + resultado;
      }

      // Si tiene decimales, se lo añadimos al numero una vez formateado con los separadores de miles
      if(numero.indexOf(",")>=0) {
          resultado+=numero.substring(numero.indexOf(","));
      }

      // Devolvemos el valor añadiendo al inicio el signo negativo
      if(numero[0]=="-") {
          return "-"+resultado;
      } else {
          return resultado;
      }
  }

}

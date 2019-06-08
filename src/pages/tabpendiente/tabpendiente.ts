
import { Component }                                                              from '@angular/core';
import { IonicPage, NavParams, AlertController, NavController, ModalController }  from 'ionic-angular';

import { Usuario, Cliente }       from '../../model/modelos.model';
import { FuncionesProvider }      from '../../providers/funciones/funciones';
import { NetworkEngineProvider }  from '../../providers/network-engine/network-engine';
import { InfoproductoPage }       from '../infoproducto/infoproducto';
import { ObservacionesPage }      from './../observaciones/observaciones';

@IonicPage()
@Component({
  selector:     'page-tabpendiente',
  templateUrl:  'tabpendiente.html',
})
export class TabpendientePage {

  private usuario:        Usuario;
  public  carrito:        any = [];
  private cliente:        Cliente;
  public  totalCarrito:   number;
  private textoObs:       string;
  private ordendecompra:  string;   

  constructor( private navParams: NavParams, 
               private alertCtrl: AlertController,
               private navCtrl:   NavController,
               public funciones:  FuncionesProvider,
               public netWork:    NetworkEngineProvider,
               private modalCtrl: ModalController ) {
    this.usuario      = this.navParams.data;
    this.totalCarrito = 0;
    //console.log('<<< TabPendientePage >>>',this.usuario);
  }

  ionViewWillEnter() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito();
  }

  ionViewDidEnter() {
    this.totalCarrito = this.funciones.sumaCarrito();
  }

  ionViewDidLoad() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito();
  }

  quitarDelPedido( producto ) {
    let confirm = this.alertCtrl.create({
      title:   'Eliminar ítem',
      message: 'Desea eliminar este ítem -> '+producto.codigo+' ?',
      buttons: [
                { text: 'Sí, elimine!', handler: () => { this.funciones.quitarDelCarro( producto ); } },
                { text: 'No, gracias',  handler: () => { null;                                      } }
               ]
      });
      confirm.present();
  }  
  
  sumaCarrito() {
    return this.funciones.sumaCarrito();
  }

  cambiarCantidad( producto ) {
      this.funciones.modificaCantidad( producto, this.cliente );
  }
  
   infoProducto( producto ) {
      this.navCtrl.push( InfoproductoPage, {  producto: producto.codigo, 
                                              descripc: producto.descrip,
                                              cliente:  this.carrito[0].cliente, 
                                              sucursal: this.carrito[0].suc_cliente, 
                                              empresa:  this.usuario.EMPRESA,
                                              usuario:  this.usuario } );
  }

  observaciones() {
    let rescataCorreo = this.modalCtrl.create( ObservacionesPage, { obs: this.textoObs } );
    rescataCorreo.onDidDismiss( data => {
      console.log(data);
      if ( data.obs != '' || data.obs != undefined ) {
         this.textoObs = data.obs;
         this.funciones.muestraySale("Observaciones guardadas",1);
      } else {
        this.funciones.msgAlert( "Correo vacío", "Debe indicar datos para enviar el correo." );
      }
    });    
    rescataCorreo.present();
  }

  ordenDeCompra() {
    let prompt = this.alertCtrl.create({
      title:   "Orden de Compra",
      message: "Ingrese el número de Orden de Compra del cliente",
      inputs:  [ { name: "occ", placeholder: "número-de-orden", value: this.ordendecompra } ],
      buttons: [
        { text: 'Salir',   handler: data => { null } },
        { text: 'Guardar', handler: data => { 
          if ( data.occ == '' ) {
            this.funciones.msgAlert('ATENCION','Número de Orden de Compra está vacío.');
          } else {
            this.ordendecompra = data.occ;
          }
        } }
      ]
    });
    prompt.present();
  }

}

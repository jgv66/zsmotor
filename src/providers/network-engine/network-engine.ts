import { Http }       from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NetworkEngineProvider {

  // url:    string = "http://23.239.29.171";  /* servidor linode mio */
  // url:    string = "http://45.56.70.121";  /* servidor linode cliente*/
  url:    string = "https://api.kinetik.cl/zspwa";  /* servidor linode cliente*/
  // puerto: string = "3020";                  /* puerto: ZSMOTOR */
  puerto: string = "443";                  /* puerto: ZSMOTOR */

  constructor( public http: Http ) {
      console.log('<<< NetworkengineProvider >>>');
  }

  soloEnviarCorreo( pCarro, cTo, cCc, cTextoObs )  {
    console.log("soloEnviarCorreo()->",pCarro);
    let accion = "/soloEnviarCorreo";
    let url    = this.url  + accion;
    let body   = { carro: pCarro, cTo: cTo, cCc: cCc, cObs: cTextoObs };
    return this.http.post( url, body ).map( res => res.json() );
  }

  sendMail( rutocorreo: string ) {
    let accion = "/sendmail";
    let url    = this.url  + accion;
    let body   = { rutocorreo: rutocorreo };
    return this.http.post( url, body ).map( res => res.json() );
  }

  traeUnSP( cSP: string, parametros?: any, pUser?: any ) {
    let accion = "/proalma";
    let url    = this.url + accion;
    let body   = { sp: cSP, datos: parametros, user: pUser };
    return this.http.post( url, body ).map( res => res.json() );
  }

  rescataSeteoCliente() {
    let accion = "/seteocliente";
    let url    = this.url  + accion;
    let body   = { x: 'ktp_configuracion' };
    return this.http.post( url, body ).map( res => res.json() );
  }

  grabarDocumentos( pCarro, pModalidad, cTipodoc, cTextoObs, cTextoOcc )  {
    console.log("grabadocumentos()->",pCarro);
    let accion = "/grabadocumentos";
    let url    = this.url  + accion;
    let body   = { carro: pCarro, modalidad: pModalidad, tipodoc: cTipodoc, cObs: cTextoObs, cOcc: cTextoOcc };
    return this.http.post( url, body ).map( res => res.json() );
  }

}

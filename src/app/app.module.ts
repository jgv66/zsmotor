
import { BrowserModule }                            from '@angular/platform-browser';
import { ErrorHandler, NgModule }                   from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen }                             from '@ionic-native/splash-screen';
import { StatusBar }                                from '@ionic-native/status-bar';
import { HttpModule }                               from '@angular/http';
import { IonicStorageModule }                       from '@ionic/storage';
import { BarcodeScanner }                           from '@ionic-native/barcode-scanner';
import { Clipboard }                                from '@ionic-native/clipboard';
import { EmailComposer }                            from '@ionic-native/email-composer';

import { MyApp }                 from './app.component';
import { HomePage }              from '../pages/home/home';
import { LoginPage }             from '../pages/login/login';
import { TabsPage }              from '../pages/tabs/tabs';
import { TabpendientePage }      from '../pages/tabpendiente/tabpendiente';
import { TabsalirPage }          from '../pages/tabsalir/tabsalir';
import { TabmensajePage }        from '../pages/tabmensaje/tabmensaje';
import { BuscarClientesPage }    from '../pages/buscar-clientes/buscar-clientes';
import { BuscarProductosPage }   from '../pages/buscar-productos/buscar-productos';
import { MenuSeteoPage }         from '../pages/menu-seteo/menu-seteo';
import { InfoproductoPage }      from '../pages/infoproducto/infoproducto';
import { Infoproducto2Page }     from './../pages/infoproducto2/infoproducto2';
import { DocumentoPage }         from '../pages/documento/documento';
import { DatoscorreoPage }       from '../pages/datoscorreo/datoscorreo';

import { BaseLocalProvider }     from '../providers/base-local/base-local';
import { FuncionesProvider }     from '../providers/funciones/funciones';
import { NetworkEngineProvider } from '../providers/network-engine/network-engine';

import { MyCardComponent }       from '../components/my-card/my-card';
import { AcordeonComponent }     from '../components/acordeon/acordeon';
import { AutoHideDirective }     from '../directives/auto-hide/auto-hide';
import { ObservacionesPage }     from '../pages/observaciones/observaciones';

@NgModule({
  declarations: [
    MyApp,  
    HomePage,  
    LoginPage,
    TabsPage,
    TabmensajePage,
    TabpendientePage,
    TabsalirPage,
    BuscarClientesPage,
    BuscarProductosPage,
    MenuSeteoPage,
    InfoproductoPage,
    Infoproducto2Page,
    DocumentoPage,
    MyCardComponent,
    AcordeonComponent,
    DatoscorreoPage,
    AutoHideDirective,
    ObservacionesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,    
    HomePage,
    LoginPage,
    TabsPage,
    TabmensajePage,
    TabpendientePage,
    TabsalirPage,
    BuscarClientesPage,
    BuscarProductosPage,
    MenuSeteoPage,
    InfoproductoPage,
    Infoproducto2Page,
    DocumentoPage,
    DatoscorreoPage,
    ObservacionesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BaseLocalProvider,
    FuncionesProvider,
    NetworkEngineProvider,
    Clipboard
  ]
})
export class AppModule {}

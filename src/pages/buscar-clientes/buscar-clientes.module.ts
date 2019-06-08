import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscarClientesPage } from './buscar-clientes';

@NgModule({
  declarations: [
    BuscarClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscarClientesPage),
  ],
})
export class BuscarClientesPageModule {}

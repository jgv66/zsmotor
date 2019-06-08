import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscarProductosPage } from './buscar-productos';

@NgModule({
  declarations: [
    BuscarProductosPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscarProductosPage),
  ],
})
export class BuscarProductosPageModule {}

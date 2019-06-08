import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentoPage } from './documento';

@NgModule({
  declarations: [
    DocumentoPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentoPage),
  ],
})
export class DocumentoPageModule {}

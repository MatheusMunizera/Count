import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryPageRoutingModule } from './gallery-routing.module';

import { GalleryPage } from './gallery.page';
import { CountHeaderComponent } from '../components/count-header/count-header.component';
import { CountHeaderModule } from '../components/count-header/count-header.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryPageRoutingModule,
    CountHeaderModule
  ],
  declarations: [GalleryPage]
})
export class GalleryPageModule {}

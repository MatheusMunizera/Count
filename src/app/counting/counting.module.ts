import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountingPageRoutingModule } from './counting-routing.module';

import { CountingPage } from './counting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountingPageRoutingModule
  ],
  declarations: [CountingPage]
})
export class CountingPageModule {}

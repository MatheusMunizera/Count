import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountingPageRoutingModule } from './counting-routing.module';

import { CountingPage } from './counting.page';
import { CountHeaderComponent } from '../components/count-header/count-header.component';
import { CountHeaderModule } from '../components/count-header/count-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountingPageRoutingModule,
    CountHeaderModule
  ],
  declarations: [CountingPage]
})
export class CountingPageModule {}

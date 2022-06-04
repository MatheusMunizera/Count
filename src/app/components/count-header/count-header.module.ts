import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountHeaderComponent } from './count-header.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


@NgModule({
  declarations: [CountHeaderComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports: [CountHeaderComponent]
})
export class CountHeaderModule { }

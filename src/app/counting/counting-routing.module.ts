import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountGuard } from '../guards/count.guard';

import { CountingPage } from './counting.page';

const routes: Routes = [
  {
    path: 'counting',
    component: CountingPage,
    canActivate: [CountGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountingPageRoutingModule {}

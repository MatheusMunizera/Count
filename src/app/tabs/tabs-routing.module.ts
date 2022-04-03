import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'menu-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../menu-tab/menu-tab.module').then(m => m.MenuTabPageModule)
          }
        ]
      },
      {
        path: 'gallery-tab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../gallery-tab/gallery-tab.module').then(m => m.GalleryTabPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/menu-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/menu-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

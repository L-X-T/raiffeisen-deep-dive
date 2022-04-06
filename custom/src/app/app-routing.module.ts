import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading-strategy.service';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((esm) => esm.AdminModule),
    data: { preload: true, delay: 2000 }
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then((esm) => esm.TestModule),
    data: { preload: true, delay: 4000 }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

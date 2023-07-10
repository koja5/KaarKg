import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home.component';
import { DocumentComponent } from '../pages/documents/document.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'category/KAPLA-Bausteine'
  },
  {
    path: 'category/:category',
    component: HomeComponent,
  },
  {
    path: 'document',
    component: DocumentComponent,
    loadChildren: () =>
      import('./../pages/documents/routing-module/document.module').then(
        (m) => m.DocumentModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomedRouting {}

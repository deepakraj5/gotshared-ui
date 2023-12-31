import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './main-layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: '',
    component: LayoutComponent,
    children:[{
      path: 'dashboard',
      component: DashboardComponent
    }]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

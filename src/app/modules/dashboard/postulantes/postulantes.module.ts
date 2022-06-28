import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostulantesComponent } from './postulantes.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
   component:PostulantesComponent
  }
];

@NgModule({
  declarations: [
    PostulantesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PostulantesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaboratorioComponent } from './laboratorio.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';

const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
    component:LaboratorioComponent
  }
];


@NgModule({
  declarations: [
    LaboratorioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule

  ]
})
export class LaboratorioModule { }

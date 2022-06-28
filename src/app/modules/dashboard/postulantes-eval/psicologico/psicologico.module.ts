import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsicologicoComponent } from './psicologico.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';



const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
    component:PsicologicoComponent
  }
];


@NgModule({
  declarations: [
    PsicologicoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PsicologicoModule { }

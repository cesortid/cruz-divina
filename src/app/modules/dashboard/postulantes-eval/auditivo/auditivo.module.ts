import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditivoComponent } from './auditivo.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';

const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
    component:AuditivoComponent
  }
];

@NgModule({
  declarations: [
    AuditivoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AuditivoModule { }

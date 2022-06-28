import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfinalComponent } from './rfinal.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';


const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
    component:RfinalComponent
  }
];

@NgModule({
  declarations: [
    RfinalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RfinalModule { }

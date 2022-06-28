import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualComponent } from './visual.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';

const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
    component:VisualComponent
  }
];

@NgModule({
  declarations: [
    VisualComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class VisualModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MenusComponent } from './pages/menus/menus.component';
import { ModalRegistrarMenuComponent } from './modales/modal-registrar-menu/modal-registrar-menu.component';

import { SharedModule } from 'src/app/modules/shared/shared.module';

const routes: Routes = [
  { path : "", component: MenusComponent
  }
];

@NgModule({
  declarations: [MenusComponent, ModalRegistrarMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot()
  ],
  entryComponents:[
    ModalRegistrarMenuComponent
  ]
})
export class MenusModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComponentesComponent } from './pages/componentes/componentes.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalRegistrarComponenteComponent } from './modales/modal-registrar-componente/modal-registrar-componente.component';

import { SharedModule } from 'src/app/modules/shared/shared.module';

const routes: Routes = [
  {
    path: "", component: ComponentesComponent
  }
];

@NgModule({
  declarations: [ComponentesComponent
    , ModalRegistrarComponenteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot()
  ],
  entryComponents: [
    ModalRegistrarComponenteComponent
  ]
})
export class ComponentesModule { }

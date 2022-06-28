import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { ModalRegistroPerfilComponent } from './modales/modal-registro-perfil/modal-registro-perfil.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalAsignacionMenuComponent } from './modales/modal-asignacion-menu/modal-asignacion-menu.component';
import { ModalAsignacionComponentesComponent } from './modales/modal-asignacion-componentes/modal-asignacion-componentes.component';
import { ModalAgregarComponenteComponent } from './modales/modal-asignacion-componentes/modal-agregar-componente/modal-agregar-componente.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


const routes: Routes = [
  { path : "", component: PerfilesComponent
  }
];

@NgModule({
  declarations: [
    PerfilesComponent
    ,ModalRegistroPerfilComponent
    ,ModalAsignacionMenuComponent
    ,ModalAsignacionComponentesComponent
    ,ModalAgregarComponenteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot()
  ],
  entryComponents:[
    ModalRegistroPerfilComponent,
    ModalAsignacionMenuComponent,
    ModalAsignacionComponentesComponent,
    ModalAgregarComponenteComponent
  ]
})
export class PerfilesModule { }

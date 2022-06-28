import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ModalRegistroUsuarioComponent } from './modales/modal-registro-usuario/modal-registro-usuario.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/modules/shared/shared.module';


const routes: Routes = [
  { path : "", component: UsuariosComponent
  }
];

@NgModule({
  declarations: [UsuariosComponent, ModalRegistroUsuarioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule.forRoot()
  ],
  entryComponents:[
    ModalRegistroUsuarioComponent
  ]
})
export class UsuariosModule { }

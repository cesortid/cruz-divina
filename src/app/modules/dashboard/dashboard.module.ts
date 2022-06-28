import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService } from 'src/app/core/guards/role.guard.service';

const routes:Routes=[
  {
    path:"",
    component:DashboardComponent,
    children:[
      {
        path:"",
        redirectTo:"postulantes",
      },
      {
        path:"postulantes",
        loadChildren:()=>import("./postulantes/postulantes.module").then(m=>m.PostulantesModule),
        canActivate: [RoleGuardService] 
      },
      {
        path:"postulantes/evaluacion/:id",
        loadChildren:()=>import("./postulantes-eval/postulantes-eval.module").then(m=>m.PostulantesEvalModule)
      },
      // {
      //   path:"postulantes/evaluacion",
      //   component:DashboardComponent,
      //   pathMatch:"prefix",
      //   loadChildren:()=>import("./postulantes-eval/postulantes-eval.module").then(m=>m.PostulantesEvalModule)
      // },
      {
        path:"configuracion/usuarios",
        loadChildren:()=>import("./seguridad/usuarios/usuarios.module").then(m=>m.UsuariosModule),
        canActivate: [RoleGuardService] 
      },  
      {
        path:"configuracion/perfiles",
        loadChildren:()=>import("./seguridad/perfiles/perfiles.module").then(m=>m.PerfilesModule),
        canActivate: [RoleGuardService] 
      },   
      
      { 
        path: 'configuracion/menus', 
        loadChildren:()=>import("./seguridad/menus/menus.module").then(m=>m.MenusModule), 
        canActivate: [RoleGuardService] 
      },
      { 
        path: 'configuracion/componentes', 
        loadChildren:()=>import("./seguridad/componentes/componentes.module").then(m=>m.ComponentesModule), 
        canActivate: [RoleGuardService] 
      },
      // { 
      //   path: 'configuracion/perfiles',
      //   loadChildren:()=>import("./seguridad/perfiles/perfiles.module").then(m=>m.PerfilesModule), 
      //   canActivate: [RoleGuardService] 
      // },
      // { 
      //   path: 'configuracion/componentes', 
      //   loadChildren:()=>import("./seguridad/componentes/componentes.module").then(m=>m.ComponentesModule),
      //   canActivate: [RoleGuardService] 
      // },
      // { 
      //   path: 'configuracion/usuarios', 
      //   loadChildren:()=>import("./seguridad/usuarios/usuarios.module").then(m=>m.UsuariosModule),
      //   canActivate: [RoleGuardService] 
      // },

    ]
  },

];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }

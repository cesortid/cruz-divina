import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostulantesEvalComponent } from './postulantes-eval.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes=[
  {
    path:"",
    pathMatch:"full",
   component:PostulantesEvalComponent
  },
  {
    path:"laboratorio/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./laboratorio/laboratorio.module").then(m=>m.LaboratorioModule)
  },
  {
    path:"psicologico/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./psicologico/psicologico.module").then(m=>m.PsicologicoModule)
  },
  {
    path:"visual/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./visual/visual.module").then(m=>m.VisualModule)
  },
  {
    path:"auditivo/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./auditivo/auditivo.module").then(m=>m.AuditivoModule)
  },
  {
    path:"clinico/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./clinico/clinico.module").then(m=>m.ClinicoModule)
  },
  {
    path:"resultado-final/:id",
   component:PostulantesEvalComponent,
   loadChildren:()=>import("./rfinal/rfinal.module").then(m=>m.RfinalModule)
  },
  // {
  //   path:"postulantes/evaluacion/:id",
  //   component:DashboardComponent,
  //   loadChildren:()=>import("./postulantes-eval/postulantes-eval.module").then(m=>m.PostulantesEvalModule)
  // },
];

@NgModule({
  declarations: [
    PostulantesEvalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
})
export class PostulantesEvalModule { }

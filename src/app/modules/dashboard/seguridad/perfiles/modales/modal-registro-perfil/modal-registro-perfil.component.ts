import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
//import { FacadeService } from 'src/app/core/patterns/facade.service';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';
import { Perfiles } from 'src/app/services/models/mantenimiento/perfil/perfil.model';


@Component({
  selector: 'app-modal-registro-perfil',
  templateUrl: './modal-registro-perfil.component.html',
  styleUrls: ['./modal-registro-perfil.component.scss']
})
export class ModalRegistroPerfilComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  entidadModal! : Perfiles;
  entidadEditar:any;
  cambiarEditar:boolean = true;
  nomUsuario: string = sessionStorage.getItem("Usuario")!;
  constructor(public modalRef: BsModalRef, private fs : MantenimientoPerfilService, private funciones : Funciones) { }

  ngOnInit() {
    this.entidadModal = new Perfiles();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  administrarPerfil(){
    if(this.entidadEditar==null){
      this.guardarPerfil();
    }else{
      this.editarPerfil();
    }
  }
  setearCamposEditar(){
    this.entidadModal.id_perfil = this.entidadEditar.id_perfil;
    this.entidadModal.descripcion = this.entidadEditar.descripcion;
    this.entidadModal.id_organismo = this.entidadEditar.id_organismo;
    this.entidadModal.flag_etapa = this.entidadEditar.flag_etapa;
    this.entidadModal.usuario_modificacion = this.nomUsuario;
  }
  editarPerfil(){
    let entidadEditar = new Perfiles();
    entidadEditar.id_perfil = this.entidadModal.id_perfil;
    entidadEditar.descripcion = this.entidadModal.descripcion.toUpperCase();;
    entidadEditar.id_organismo = 2;//this.entidadModal.id_organismo;
    entidadEditar.flag_etapa = true;//this.entidadModal.flag_etapa;
    entidadEditar.usuario_modificacion = this.nomUsuario;
    this.fs.actualizarPerfiles(entidadEditar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","","no fue posible completar la operación",()=>{});
        }
        else{
          this.funciones.Mensaje("success","","Información guardada",()=>{});
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }
  guardarPerfil(){ 
    let entidadRegistrar = new Perfiles();
    entidadRegistrar.id_perfil = 0;
    entidadRegistrar.descripcion = this.entidadModal.descripcion.toUpperCase();
    entidadRegistrar.id_organismo = 2;//this.entidadModal.id_organismo;
    entidadRegistrar.flag_etapa = true;//this.entidadModal.flag_etapa;
    entidadRegistrar.usuario_creacion = this.nomUsuario;
    this.fs.registrarPerfiles(entidadRegistrar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","","no fue posible completar la operación",()=>{});
        }
        else{
          this.funciones.Mensaje("success","","Información guardada",()=>{});
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )    
  }

}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'node_modules/ngx-bootstrap/modal';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoMenuService } from 'src/app/services/mantenimiento/menu.service';
import { Menu,MenuModal } from 'src/app/services/models/mantenimiento/menu/menu.model';

// import { Menu, MenuModal } from 'src/app/shared/models/mantenimiento/menu/menu.model';


@Component({
  selector: 'app-modal-registrar-menu',
  templateUrl: './modal-registrar-menu.component.html',
  styleUrls: ['./modal-registrar-menu.component.scss']
})
export class ModalRegistrarMenuComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  entidadModal! : MenuModal;
  arregloEstado = [{estado : true,nom_estado:"ACTIVO"},{estado:false,nom_estado:"INACTIVO"}]
  entidadEditar:any;
  cambiarEditar:boolean = true;
  entidadPadre:any;
  desOrden:boolean = false;
  modulos:any;
  ListadoSistemas:any=[];
  nombreUsuario: any = "";
  constructor(public modalRef: BsModalRef,private fs: MantenimientoMenuService, public funciones: Funciones) { }

  ngOnInit() {
    this.nombreUsuario! = sessionStorage.getItem("Usuario");
    //this.listarModulos();
    this.entidadModal = new MenuModal();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }else{
      if(this.entidadPadre != undefined){
        //agregado para heredar modulo de padre
        //this.entidadModal.id_modulo=this.entidadPadre.id_modulo;
        this.desOrden=true;
        this.entidadModal.nivel = this.entidadPadre.nivel + 1;
        this.entidadModal.id_menu_padre = this.entidadPadre.id_menu;
      }else{
        this.entidadModal.nivel = 0;
      }
    }
    
    (<HTMLInputElement>document.getElementById("nivel")).disabled = true;
    (<HTMLInputElement>document.getElementById("nivelEdicion")).disabled = true;
  }

  administrarMenu(){
    if(this.entidadEditar==null){
      this.guardarMenu();
    }else{
      this.editarMenu();
    }
  }
  setearCamposEditar(){
    this.entidadModal.nombre_menu = this.entidadEditar.nombre_menu;
    this.entidadModal.id_menu_padre = this.entidadEditar.id_menu_padre;
    this.entidadModal.orden = this.entidadEditar.orden;
    this.entidadModal.nivel = this.entidadEditar.nivel;
    this.entidadModal.url = this.entidadEditar.url;
    this.entidadModal.icono = this.entidadEditar.icono;
    this.entidadModal.activo = this.entidadEditar.activo;
    //this.entidadModal.id_modulo = this.entidadEditar.id_modulo;
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  editarMenu(){   
    let entidadEditar = new Menu();
    entidadEditar.id_menu = this.entidadEditar.id_menu;
    entidadEditar.nombre_menu = this.entidadModal.nombre_menu;
    entidadEditar.id_menu_padre = this.entidadModal.id_menu_padre;
    entidadEditar.icono = this.entidadModal.icono;
    entidadEditar.nivel = this.entidadModal.nivel;
    entidadEditar.orden = this.entidadModal.orden;
    entidadEditar.url = this.entidadModal.url;
    entidadEditar.activo = this.entidadModal.activo;
    entidadEditar.usuario_modificacion = this.nombreUsuario;//sessionStorage.getItem("Usuario");
    //entidadEditar.id_modulo=this.entidadModal.id_modulo;
    this.fs.actualizarMenu(entidadEditar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","Mensaje del Sistema","No se pudo guardar su información",()=>{});
        }
        else{
          this.funciones.Mensaje("success","Mensaje del Sistema","Información guardada",()=>{});
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }
  guardarMenu(){ 
    let entidadRegistrar = new Menu();
    //entidadRegistrar.id_menu = 0;
    entidadRegistrar.nombre_menu = this.entidadModal.nombre_menu;
    entidadRegistrar.id_menu_padre = this.entidadModal.id_menu_padre == undefined ? 0: this.entidadModal.id_menu_padre;
    entidadRegistrar.icono = this.entidadModal.icono;
    entidadRegistrar.nivel = this.entidadModal.nivel;
    entidadRegistrar.orden = this.entidadModal.orden;
    entidadRegistrar.url = this.entidadModal.url;
    entidadRegistrar.activo = true;
    entidadRegistrar.usuario_creacion = this.nombreUsuario;//sessionStorage.getItem("Usuario");
    //entidadRegistrar.id_modulo=this.entidadModal.id_modulo;
    this.fs.registrarMenu(entidadRegistrar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","Mensaje del Sistema","No se pudo guardar su información",()=>{});
        }
        else{
          this.funciones.Mensaje("success","Mensaje del Sistema","Información guardada",()=>{});
          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )    
  }
}

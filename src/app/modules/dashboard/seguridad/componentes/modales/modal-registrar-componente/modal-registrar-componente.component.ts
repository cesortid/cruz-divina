import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'node_modules/ngx-bootstrap/modal';
import { FormControl } from 'node_modules/@angular/forms';

import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoComponenteService } from 'src/app/services/mantenimiento/componente.service';
import { ComponenteModal,Componente } from 'src/app/services/models/mantenimiento/componente/componente.model';


@Component({
  selector: 'app-modal-registrar-componente',
  templateUrl: './modal-registrar-componente.component.html',
  styleUrls: ['./modal-registrar-componente.component.scss']
})
export class ModalRegistrarComponenteComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  buscarPagina: FormControl = new FormControl();
  buscarModulo: FormControl = new FormControl();
  buscarEvento: FormControl = new FormControl();
  buscarSeccion: FormControl = new FormControl();
  entidadModal!: ComponenteModal;
  entidadEditar:any;
  cambiarEditar:boolean = true;
  //---------
  paginas:any = [];
  modulos:any = [];
  eventos:any = [];
  autoPagina:number=0;
  autoModulo:number=0;
  autoEvento:number=0;
  autoSeccion:number=0;
  secciones:any = [];
  nombreUsuario: string = "";
  constructor(public modalRef: BsModalRef, private funciones : Funciones, private fs : MantenimientoComponenteService) { }

  ngOnInit() {
    this.entidadModal = new ComponenteModal();
    if(this.entidadEditar !=null){
      this.setearCamposEditar();
      this.cambiarEditar = false;
    }


    this.nombreUsuario = sessionStorage.getItem("Usuario")!;
  }

  limpiarAutocomplete(campo:any) {
    if(campo == "pagina"){
      this.paginas = undefined;
    }
    else if(campo == "modulo"){
      this.modulos = undefined;
    }
    else if(campo ==  "evento"){
      this.eventos = undefined;
    }
    else{
      this.secciones = undefined;
    }
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

  administrarComponente(){
    if(this.entidadEditar==null){
      this.guardarComponente();
    }else{
      this.editarComponente();
    }
  }
  setearCamposEditar(){
    this.entidadModal.id_componente = this.entidadEditar.id_componente;
    this.entidadModal.nombre_componente = this.entidadEditar.nombre_componente;
    this.entidadModal.descripcion = this.entidadEditar.descripcion;
    this.entidadModal.evento = this.entidadEditar.evento;
    this.entidadModal.modulo = this.entidadEditar.modulo;
    this.entidadModal.pagina = this.entidadEditar.pagina;
    this.entidadModal.seccion = this.entidadEditar.seccion;
    this.entidadModal.tipo_componente = this.entidadEditar.tipo_componente;
    this.entidadModal.estado = this.entidadEditar.estado;
}
  editarComponente(){   
    let entidadEditar = new Componente();
    entidadEditar.id_componente = this.entidadEditar.id_componente;
    entidadEditar.nombre_componente = this.entidadModal.nombre_componente;
    entidadEditar.descripcion = this.entidadModal.descripcion;
    entidadEditar.evento = this.entidadModal.evento;
    entidadEditar.modulo = this.entidadModal.modulo;
    entidadEditar.pagina = this.entidadModal.pagina;
    entidadEditar.tipo_componente = this.entidadModal.tipo_componente;
    entidadEditar.seccion = this.entidadModal.seccion;
    entidadEditar.estado = this.entidadModal.estado;
    entidadEditar.usuario_modificacion = this.nombreUsuario; //sessionStorage.getItem("Usuario");
    this.fs.actualizarComponente(entidadEditar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","","No se pudo guardar su información",()=>{});
        }
        else{
          this.funciones.Mensaje("success","","Información guardada",()=>{});

          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    );
  }
  guardarComponente(){ 
    let entidadRegistrar = new Componente();
    entidadRegistrar.id_componente = 0;
    entidadRegistrar.nombre_componente = this.entidadModal.nombre_componente;
    entidadRegistrar.descripcion = this.entidadModal.descripcion;
    entidadRegistrar.evento = this.entidadModal.evento;
    entidadRegistrar.modulo = this.entidadModal.modulo;
    entidadRegistrar.pagina = this.entidadModal.pagina;
    entidadRegistrar.tipo_componente = this.entidadModal.tipo_componente;
    entidadRegistrar.seccion = this.entidadModal.seccion;
    entidadRegistrar.estado = true;
    entidadRegistrar.usuario_creacion = this.nombreUsuario; //sessionStorage.getItem("Usuario");
    this.fs.registrarComponente(entidadRegistrar).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","","No se pudo guardar su información",()=>{});
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


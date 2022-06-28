import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalRegistroPerfilComponent } from '../../modales/modal-registro-perfil/modal-registro-perfil.component';
import { ModalAsignacionMenuComponent } from '../../modales/modal-asignacion-menu/modal-asignacion-menu.component';
import { ModalAsignacionComponentesComponent } from '../../modales/modal-asignacion-componentes/modal-asignacion-componentes.component';

import { Perfiles } from 'src/app/services/models/mantenimiento/perfil/perfil.model';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';



@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {

  campoBusqueda: string = "";
  bsModalRef!: BsModalRef;
  totalPerfiles: number = 0;
  arregloPerfil: any = [];
  response: any;
  config: any;
  paginaActual: number = 1;
  nomUsuario = sessionStorage.getItem("Usuario");
  constructor(private modalService: BsModalService, private funciones: Funciones, private fs: MantenimientoPerfilService) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  ListadoPrincipal() {
    let pEnvio = {
      descripcion: this.campoBusqueda.toUpperCase()
    }
    this.fs.listarPerfiles(pEnvio).subscribe(
      (data:any) => {
        this.response = data;
        if (this.response != null) {
          this.arregloPerfil = this.response;
          this.totalPerfiles = this.response.length;
        } else {
          this.arregloPerfil = [];
          this.totalPerfiles = 0;
        }
      }
    )
  }

  buscarConsultaPrincipal() {
    this.ListadoPrincipal();
  }
  modalAsignacionMenu(idPerfil:any) {
    this.config = {
      ignoreBackdropClick: true,
      class: "modal-lg",
      keyboard: false,
      initialState: {
        idPerfil: idPerfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalAsignacionMenuComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
      }
    )
  }

  modalAsignacionComponente(idPerfil:any) {
    this.config = {
      ignoreBackdropClick: true,
      class: "modal-lg",
      keyboard: false,
      initialState: {
        idPerfil: idPerfil
      }
    };
    this.bsModalRef = this.modalService.show(ModalAsignacionComponentesComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
       
      }
    )
  }

  modalEditarPerfil(obj:any) {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistroPerfilComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.ListadoPrincipal();
      }
    )
  }
  mostrarAlerta(codigo:any) {
    this.funciones.Mensaje("question", "Deseas eliminar el siguiente registro?", "", (respuesta:any) => {
      if (respuesta.value) {
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo:any) {
    let entidadEliminar = new Perfiles();
    entidadEliminar.id_perfil = codigo;
    entidadEliminar.usuario_eliminacion = this.nomUsuario!;
    this.fs.anularPerfil(entidadEliminar).subscribe(
      (data: any) => {
        if (data.id_perfil > 0) {
          this.funciones.Mensaje("success", "Se eliminó el perfil!", "", ()=>{});
          this.ListadoPrincipal();
        }
        else {
          this.funciones.Mensaje("error", "Ocurrio un error al momento eliminar el perfil", "", ()=>{});
        }
      }
    )
  }
  modalAgregarPerfil() {
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistroPerfilComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.ListadoPrincipal();
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'node_modules/ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalRegistrarComponenteComponent } from '../../modales/modal-registrar-componente/modal-registrar-componente.component';
import { Funciones } from 'src/app/modules/shared/funciones';
import { Componente } from 'src/app/services/models/mantenimiento/componente/componente.model';
import { MantenimientoComponenteService } from 'src/app/services/mantenimiento/componente.service';

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.scss']
})
export class ComponentesComponent implements OnInit {

  campoBusqueda:string = "";
  bsModalRef!: BsModalRef;
  totalComponentes:number =0;
  arregloComponente:any = [];
  lstParametros:any=[];
  response:any;
  config:any;
  paginaActual:number =1;
  numero_pagina: number =0;
  total_filas: number =10;
  constructor(private modalService: BsModalService, private funciones : Funciones, private fs : MantenimientoComponenteService) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  ListadoPrincipal(){
    let envio = {
      nombre_componente: this.campoBusqueda,
      limit: this.total_filas,
      offset: this.numero_pagina
    }
    this.fs.listaComponentes(envio).subscribe(
      (data:any) =>{
          this.response = data;
          if(this.response != ""){
            if(this.response[0].cantidad_componentes != 0){
              this.arregloComponente = this.response[0].componentes;
              this.totalComponentes = this.response[0].cantidad_componentes
            }else{
              this.arregloComponente = [];
              this.totalComponentes = 0;
            };
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          }
      }
    )
  }
  cambiarPagina(pagina:any){
    this.numero_pagina = (pagina.page * 10) - 10;
    let envio = {
      nombre_componente: this.campoBusqueda == null?"":this.campoBusqueda,
      skip: this.total_filas,
      take: this.numero_pagina
    }
    this.fs.listaComponentes(envio).subscribe(
      (data:any) => {
        this.response = data;
        if(this.response != ""){
          if(this.response[0].cantidad_perfiles != 0){
            this.arregloComponente = this.response[0].componentes;
            this.totalComponentes = this.response[0].cantidad_componentes
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          };
        }else{
          this.arregloComponente = [];
          this.totalComponentes = 0;
        }
      }
    )
  }
  busqueda(){
    let envio = {
      nombre_componente: this.campoBusqueda == null?"":this.campoBusqueda,
      skip: this.total_filas,
      take: this.numero_pagina
    }
    this.fs.listaComponentes(envio).subscribe(
      (data:any) => {
        this.response = data;        
        if(this.response != ""){
          if(this.response[0].cantidad_componentes != 0){
            this.arregloComponente = this.response[0].componentes;
            this.totalComponentes = this.response[0].cantidad_componentes;
          }else{
            this.arregloComponente = [];
            this.totalComponentes = 0;
          }
        }else{
          this.arregloComponente = [];
          this.totalComponentes = 0;
        }
      }
    )
  }

  modalEditarComponente(obj:any){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-registrar-componente",
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistrarComponenteComponent,this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }

  mostrarAlerta(codigo:any){
    this.funciones.Mensaje("question","Deseas eliminar el siguiente registro?","",(respuesta:any) =>{
      if(respuesta.value){
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo:any){
    let entidadEliminar = new Componente();
    entidadEliminar.id_componente = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario")!;
    this.fs.anularComponente(entidadEliminar).subscribe(
      (data: any) => {        
        if(data.id_componente > 0){
            this.funciones.Mensaje("success","","Se eliminó el componente!",()=>{});
            this.busqueda();
        }
        else{
            this.funciones.Mensaje("error","","Ocurrio un error al momento eliminar el componente",()=>{});
        }
      }
    )
  }
  modalAgregarComponente(){
    this.config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-registrar-componente",
      initialState: {
        entidadEditar: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistrarComponenteComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        let pagina = {page:this.paginaActual}
        this.cambiarPagina(pagina);
      }
    )
  }
}

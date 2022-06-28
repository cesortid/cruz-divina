import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';

@Component({
  selector: 'app-modal-agregar-componente',
  templateUrl: './modal-agregar-componente.component.html',
  styleUrls: ['./modal-agregar-componente.component.scss']
})
export class ModalAgregarComponenteComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  idDetallePerfilMenu!:number;
  arregloDetalleComponente:any = [];
  arregloEnvio:any = [];
  response:any;
  ocultarRegistrar:boolean = true;
  todos:boolean = false;

  campoBusqueda:string = "";

  constructor(public modalRef: BsModalRef, private fs : MantenimientoPerfilService,  private funciones: Funciones) { }

  ngOnInit() {
    this.ListadoPrincipal();
  }

  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }

  ComponentesTodo(){
    if(this.todos){
      let check: NodeList = document.getElementsByName("componente") as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element:any = check[index];
        element["checked"] = true;
      }
      this.arregloDetalleComponente.forEach((element:any) => {
        this.arregloEnvio.push({visible: true, id_componente: element.id_componente, id_detalle_perfil_menu : this.idDetallePerfilMenu, usuario_creacion : sessionStorage.getItem("Usuario")});
      });
      /*let ckbtodo: NodeList = document.getElementsByClassName("ckbtodo") as NodeList;
      for (let index = 0; index < ckbtodo.length; index++) {
        const element = ckbtodo[index];
        element["style"] = "font-size: 11px";
      }*/
    }else{
      let check: NodeList = document.getElementsByName("componente") as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element:any = check[index];
        element["checked"] = false;
      }
      this.arregloEnvio = [];
      /*let ckbtodo: NodeList = document.getElementsByClassName("ckbtodo") as NodeList;
      for (let index = 0; index < ckbtodo.length; index++) {
        const element = ckbtodo[index];
        element["style"] = "display:none;font-size: 11px";
      }*/
    }
    if(this.arregloEnvio.length == 0){
      this.ocultarRegistrar = true;
    }else{
      this.ocultarRegistrar=false;
    }
  }

  asignarVisible(codigo:any,componente:any){
    let check: NodeList = document.getElementsByName(componente) as NodeList;
    this.arregloEnvio.forEach((element:any) => {
      if(element.id_componente == codigo){        
        for (let index = 0; index < check.length; index++) {
          const valor:any = check[index];
          element.visible = valor["checked"];
        }
      }
    });
  }

  asignarComponente(codigo:any,componente:any){
    let existe = this.arregloEnvio.find((x:any) => x.id_componente === codigo);
    if(existe == undefined){
      this.arregloEnvio.push({visible: true, id_componente: codigo, id_detalle_perfil_menu : this.idDetallePerfilMenu, usuario_creacion : sessionStorage.getItem("Usuario")});
      let check: NodeList = document.getElementsByName(componente) as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element:any = check[index];
        element["style"] = "";
      }
      let span: HTMLElement = document.getElementById(componente) as HTMLElement;
      span.setAttribute("style","font-size: 11px;");
    }else{
      var eliminar = this.arregloEnvio.indexOf(existe);
      if(eliminar != -1) {
        this.arregloEnvio.splice(eliminar, 1);
      }      
      let check: NodeList = document.getElementsByName(componente) as NodeList;
      for (let index = 0; index < check.length; index++) {
        const element:any = check[index];
        element["style"] = "display:none";
      }
      let span: HTMLElement = document.getElementById(componente) as HTMLElement;
      span.setAttribute("style","display:none;font-size: 11px;");
    }
    if(this.arregloEnvio.length == 0){
      this.ocultarRegistrar = true;
    }else{
      this.ocultarRegistrar=false;
    }
  }

  ListadoPrincipal(){
    let envio={"id_detalle_perfil_menu":this.idDetallePerfilMenu,"nombre":this.campoBusqueda};
    this.fs.ListarComponentePendiente(envio).subscribe(
      (data:any) =>{

          this.response = data;
          if(this.response != ""){
            if(this.response.length != 0){
              this.arregloDetalleComponente = this.response;
            }else{
              this.arregloDetalleComponente = [];
            };
          }else{
            this.arregloDetalleComponente = [];
          }
      }
    )
  }

  guardarAsignacionComponente(){
    this.fs.procesarDetallePerfilMenuComponente(this.arregloEnvio).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","","No fue posible completar la operación",()=>{});
        }
        else{
          this.funciones.Mensaje("success","","Información guardada",()=>{});

          this.retornoValores.emit(0);
          this.modalRef.hide();
        }
      }
    )
  }


  busqueda(){
    let envio={
      nombre: this.campoBusqueda == null?"":this.campoBusqueda,
      id_detalle_perfil_menu:this.idDetallePerfilMenu
    }
    this.fs.ListarComponentePendiente(envio).subscribe(
      (data:any) =>{

          this.response = data;
          if(this.response !=null){
            if(this.response.length != 0){
              this.arregloDetalleComponente = this.response;
            }else{
              this.arregloDetalleComponente = [];
            };
          }else{
            this.arregloDetalleComponente = [];
          }
      }
    )
  }

}

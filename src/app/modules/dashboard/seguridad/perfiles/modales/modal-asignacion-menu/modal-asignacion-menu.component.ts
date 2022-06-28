import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeviewItem, DownlineTreeviewItem, TreeviewEventParser, OrderDownlineTreeviewEventParser } from 'ngx-treeview';
//import { FacadeService } from 'src/app/core/patterns/facade.service';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';
import { ModalAsignacion } from 'src/app/services/models/mantenimiento/perfil/perfil.model';

@Component({
  selector: 'app-modal-asignacion-menu',
  templateUrl: './modal-asignacion-menu.component.html',
  styleUrls: ['./modal-asignacion-menu.component.scss'],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }
  ]
})
export class ModalAsignacionMenuComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  entidadModal! : ModalAsignacion;
  idPerfil!:number;
  menus:any;
  totalDetalle:number =0;
  arregloDetalle = [];
  paginaActual:number =1;
  response:any;
  arregloMemoria:any = [];
  arregloTreeview: TreeviewItem[] = [];
  config:any;
  values!: number[];
  arreglomenusenvio:any =[];
  //arreglomenusenvio
  ocultarregistrar:boolean = true;
  
  ListadoSistemas:any=[];
  id_modulo:number=null!;


  constructor(public modalRef: BsModalRef, private fs : MantenimientoPerfilService, private funciones: Funciones) { }

  ngOnInit() {
    this.entidadModal = new ModalAsignacion();
    //this.ListadoPrincipalDetalle();
    this.ObtenerMenu();
    this.config = {
      hasAllCheckBox: true,
      hasFilter: false,
      hasCollapseExpand: false,
      decoupleChildFromParent: false,
      maxHeight: 800
   };
  }

  ObtenerMenu(){
    let envio={"id_perfil":this.idPerfil};
     this.fs.listarDetalleMenu(envio).subscribe(
       (data:any) =>{
         this.response = data;
         this.arregloMemoria = data;
         this.response.forEach((element:any) => {
           if(element.nivel == 0){
             let hijos = this.obtenerHijos(this.response,element.id_menu);
             if(hijos.length != 0){
               this.arregloTreeview.push(new TreeviewItem({text: element.nombre_menu, value: element.id_menu, children: hijos}));
             }else{
               this.arregloTreeview.push(new TreeviewItem({text: element.nombre_menu, value: element.id_menu, checked: element.estado_menu}));
             }
           }
         });
       }
     )
   }


  obtenerHijos(arreglo:any,idmenu:any){
    let array:any = [] ;
    arreglo.forEach((element:any) => {
      if(element.id_menu_padre == idmenu){
        let array_hijo = [];
        array_hijo = this.obtenerHijos(arreglo,element.id_menu);
        array.push({text: element.nombre_menu, value: element.id_menu, checked: element.estado_menu, children: array_hijo});
      }
    });
    return array;
  }

  onSelectedChange(evento: DownlineTreeviewItem[]){
    if(evento.length != 0){
      this.arreglomenusenvio = [];
      evento.forEach(element => {
        let entidad = this.arregloMemoria.find((x:any) => x.id_menu == element.item.value);
        this.arreglomenusenvio.push({ id_detalle_perfil_menu : entidad.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.item.value, usuario_creacion:sessionStorage.getItem("Usuario"), activo: true});
        if(element.parent != null){
          let entidadSub = this.arregloMemoria.find((x:any) => x.id_menu == element.parent.item.value);
          let existente = this.arreglomenusenvio.find((x:any) => x.id_menu == element.parent.item.value);
          if(existente == undefined){
            this.arreglomenusenvio.push({id_detalle_perfil_menu : entidadSub.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.parent.item.value, usuario_creacion:sessionStorage.getItem("Usuario"), activo: true});
          }          
        }
      });
    }else{
      this.arreglomenusenvio = [];
    }
    this.arregloMemoria.forEach((element:any) => {
      if(element.id_detalle_perfil_menu != 0){
        let existe = this.arreglomenusenvio.find((x:any) => x.id_detalle_perfil_menu == element.id_detalle_perfil_menu);
        if(existe == undefined){
          this.arreglomenusenvio.push({id_detalle_perfil_menu : element.id_detalle_perfil_menu, id_perfil: this.idPerfil, id_menu: element.id_menu, usuario_creacion: sessionStorage.getItem("Usuario"), activo: false});
        }
      }      
    });
    if(this.arreglomenusenvio.length == 0){
      this.ocultarregistrar = true;
    }else{
      this.ocultarregistrar = false;
    }
  }
  closeModal() {
    this.retornoValores.emit(0);
    this.modalRef.hide();
  }
  guardarAsignacion(){ 
    this.fs.insertarDetallePerfilMenu(this.arreglomenusenvio).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","No se pudo completar la operacion","",()=>{});
        }
        else{
          this.entidadModal.id_menu = null!;
          this.funciones.Mensaje("success","Información guardada","",()=>{});
          this.closeModal();
        }
      }
    )
  }

  CargarTreeView(e:any){
    this.arregloTreeview=[];
    if(e===undefined){
      this.id_modulo=null!;
    }
    else{
      this.id_modulo=e.id_modulo;
      this.ObtenerMenu();
    }
  }
  //this.ObtenerMenu()
}

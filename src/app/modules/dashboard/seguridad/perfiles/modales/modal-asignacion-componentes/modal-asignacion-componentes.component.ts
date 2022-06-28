import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { BsModalRef } from 'ngx-bootstrap/modal';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { ModalAgregarComponenteComponent } from './modal-agregar-componente/modal-agregar-componente.component';
// //import { FacadeService } from 'src/app/core/patterns/facade.service';
// import { Funciones } from 'src/app/modules/shared/funciones';
// import { AsignacionComponente } from 'src/app/services/models/mantenimiento/perfil/perfil.model';
// import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeviewItem, DownlineTreeviewItem, TreeviewEventParser, OrderDownlineTreeviewEventParser } from 'ngx-treeview';
//import { FacadeService } from 'src/app/core/patterns/facade.service';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoPerfilService } from 'src/app/services/mantenimiento/perfil.service';
import { ModalAsignacion, ModalAsignacionComponente } from 'src/app/services/models/mantenimiento/perfil/perfil.model';



@Component({
  selector: 'app-modal-asignacion-componentes',
  templateUrl: './modal-asignacion-componentes.component.html',
  styleUrls: ['./modal-asignacion-componentes.component.scss'],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }
  ]
})
export class ModalAsignacionComponentesComponent implements OnInit {

  // @Output() retornoValores = new EventEmitter();
  // idPerfil!: number;
  // bsModalRef!: BsModalRef;
  // menuDetalles: any;
  // totalDetalleComponente: number = 0;
  // arregloDetalleComponente: any = [];
  // paginaActual: number = 1;
  // campoBusqueda!: number;
  // response: any;
  // config: any;
  // mostrarRegistrar: boolean = true;
  // //campos de busqueda
  // paginas: any;
  // modulos: any;
  // seccion: any;
  // nombreComponentes: any;

  // constructor(private modalService: BsModalService, public modalRef: BsModalRef, private fs: MantenimientoPerfilService, private funciones: Funciones) { }

  // ngOnInit() {
  //   this.listarMenus();
  // }
  // listarMenus() {
  //   let envio={"id_perfil":this.idPerfil};
  //   this.fs.listarDetallePerfilMenu(envio).subscribe(
  //      (data:any) => {
  //        this.menuDetalles = data;
  //      }
  //    );
  // }
  // closeModal() {
  //   this.retornoValores.emit(0);
  //   this.modalRef.hide();
  // }
  // habilitar(evento:any) {
  //   if (evento == null || evento == undefined) {
  //     this.mostrarRegistrar = true;
  //     this.paginas = null;
  //     this.modulos = null;
  //     this.nombreComponentes = null;
  //     this.seccion = null;
  //   } else {
  //     this.mostrarRegistrar = false;
  //     this.BusquedaDetalleComponente();
  //   }
  // }
  // BusquedaDetalleComponente() {
  //   this.paginaActual = 1;
  //   let pagina = this.paginas == null ? "" : this.paginas;
  //   let secciones = this.seccion == null ? "" : this.seccion;
  //   let modulo = this.modulos == null ? "" : this.modulos;
  //   let componente = this.nombreComponentes == null ? "" : this.nombreComponentes;
  //   let skip = 5;
  //   let take = 0;
  //   let envio={"id_detalle_perfil_menu":this.campoBusqueda,"pagina":pagina,"seccion":secciones,"modulo":modulo,"nombre_componente":componente,"limit":skip,"offset":take};
  //    this.fs.listarDetallePerfilMenuComponente(envio).subscribe(
  //      (data:any) => {
  //        this.response = data;
  //        if (this.response != "") {
  //          if (this.response[0].cantidad_detalle != 0) {
  //            this.arregloDetalleComponente = this.response[0].detalle_perfil_menu_componente;
  //            this.totalDetalleComponente = this.response[0].cantidad_detalle
  //          } else {
  //            this.arregloDetalleComponente = [];
  //            this.totalDetalleComponente = 0;
  //          };
  //        } else {
  //          this.arregloDetalleComponente = [];
  //         this.totalDetalleComponente = 0;
  //        }
  //      }
  //    )
  // }
  // cambiarPagina(pagina:any) {
  //   this.paginaActual = pagina.page;
  //   let pag = this.paginas == null ? "" : this.paginas;
  //   let secciones = this.seccion == null ? "" : this.seccion;
  //   let modulo = this.modulos == null ? "" : this.modulos;
  //   let componente = this.nombreComponentes == null ? "" : this.nombreComponentes;
  //   let skip = 5;
  //   let take = (pagina.page * 5) - 5;
  //   let envio={"id_detalle_perfil_menu":this.campoBusqueda,"pagina":pag,"seccion":secciones,"modulo":modulo,"nombre_componente":componente,"limit":skip,"offset":take};
  //    this.fs.listarDetallePerfilMenuComponente(envio).subscribe(
  //      (data:any) => {
  //        this.response = data;
  //        if (this.response != "") {
  //          if (this.response[0].cantidad_detalle != 0) {
  //            this.arregloDetalleComponente = this.response[0].detalle_perfil_menu_componente;
  //            this.totalDetalleComponente = this.response[0].cantidad_detalle
  //          } else {
  //            this.arregloDetalleComponente = [];
  //            this.totalDetalleComponente = 0;
  //          };
  //        } else {
  //          this.arregloDetalleComponente = [];
  //          this.totalDetalleComponente = 0;
  //        }
  //      }
  //    )
  // }
  // modalAgregarMenuComponente(idDetallePerfilMenu:any) {
  //   this.config = {
  //     ignoreBackdropClick: true,
  //     class: "modal-lg",
  //     keyboard: false,
  //     initialState: {
  //       idDetallePerfilMenu: idDetallePerfilMenu
  //     }
  //   };
  //    this.bsModalRef = this.modalService.show(ModalAgregarComponenteComponent, this.config);
  //    this.bsModalRef.content.retornoValores.subscribe(
  //      (data:any) => {
  //        let pagina = { page: this.paginaActual }
  //        this.cambiarPagina(pagina);
  //      }
  //    )
  // }

  // mostrarAlerta(codigo:any) {
  //   this.funciones.Mensaje("question", "Deseas eliminar el siguiente registro?", "", (respuesta:any) => {
  //     if (respuesta.value) {
  //       this.eliminar(codigo);
  //     }
  //   })
  // }
  // eliminar(codigo:any) {
  //   let entidadEliminar = new AsignacionComponente();
  //   entidadEliminar.id_detalle_perfil_menu_componente = codigo;
  //   entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario")!;
  //    this.fs.anularDetallePerfilMenuComponente(entidadEliminar).subscribe(
  //      (data:any) => {
  //        if (data.id_detalle_perfil_menu_componente>0) {
  //          this.funciones.Mensaje("success", "Se eliminó el registro!", "", ()=>{});
  //          this.BusquedaDetalleComponente();
  //        }
  //        else {
  //          this.funciones.Mensaje("error", "Ocurrio un error al momento eliminar el registro", "", ()=>{});
  //        }
  //      }
  //    );
  // }

  // estado(evento:any, objActivar:any) {
  //   let envioActivar = new AsignacionComponente();
  //   envioActivar.visible = evento;
  //   envioActivar.id_detalle_perfil_menu_componente = objActivar.id_detalle_perfil_menu_componente;
  //   envioActivar.usuario_modificacion = sessionStorage.getItem("Usuario")!;
  //    this.fs.ModificarDetallePerfilMenuComponente(envioActivar).subscribe(
  //      (data:any) => {
  //        if (data.id_detalle_perfil_menu_componente >0) {
  //          if (evento) {
  //            this.funciones.Mensaje("success", "Se habilitó el componente!", "", ()=>{});
  //          } else {
  //            this.funciones.Mensaje("success", "Se deshabilitó el componente!", "", ()=>{});
  //          }

  //          this.BusquedaDetalleComponente();
  //        }
  //        else {
  //          this.funciones.Mensaje("error", "Ocurrio un problema al deshabilitar el componente", "", ()=>{});
  //        }
  //      }
  //    );
  // }


  @Output() retornoValores = new EventEmitter();
  entidadModal! : ModalAsignacionComponente;
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
    this.entidadModal = new ModalAsignacionComponente();
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
     this.fs.listarDetalleComponente(envio).subscribe(
       (data:any) =>{
         this.response = data;
         this.arregloMemoria = data;
         this.response.forEach((element:any) => {
           //if(element.nivel == 0){
             //let hijos = this.obtenerHijos(this.response,element.id_menu);
             //let hijos:any =[];
            //  if(hijos.length != 0){
            //    this.arregloTreeview.push(new TreeviewItem({text: element.nombre_menu, value: element.id_menu, children: hijos}));
            //  }else{



               this.arregloTreeview.push(new TreeviewItem({text: element.nombre_componente, value: element.id_componente, checked: element.estado_componente}));
             //}
           //}
         });
       }
     )
   }


  // obtenerHijos(arreglo:any,idmenu:any){
  //   let array:any = [] ;
  //   arreglo.forEach((element:any) => {
  //     if(element.id_menu_padre == idmenu){
  //       let array_hijo = [];
  //       array_hijo = this.obtenerHijos(arreglo,element.id_menu);
  //       array.push({text: element.nombre_menu, value: element.id_menu, checked: element.estado_menu, children: array_hijo});
  //     }
  //   });
  //   return array;
  // }

              // estado_componente: false
            // id_componente: 257
            // id_detalle_perfil_componente: 0
            // nombre_componente: "btn_guardar_visual"

  onSelectedChange(evento: DownlineTreeviewItem[]){
    if(evento.length != 0){
      this.arreglomenusenvio = [];
      evento.forEach(element => {
        let entidad = this.arregloMemoria.find((x:any) => x.id_componente == element.item.value);
        this.arreglomenusenvio.push({ id_detalle_perfil_componente : entidad.id_detalle_perfil_componente, id_perfil: this.idPerfil, id_componente: element.item.value, usuario_creacion:sessionStorage.getItem("Usuario"), activo: true});
        // if(element.parent != null){
        //   let entidadSub = this.arregloMemoria.find((x:any) => x.id_componente == element.parent.item.value);
        //   let existente = this.arreglomenusenvio.find((x:any) => x.id_componente == element.parent.item.value);
        //   if(existente == undefined){
        //     this.arreglomenusenvio.push({id_detalle_perfil_componente : entidadSub.id_detalle_perfil_componente, id_perfil: this.idPerfil, id_componente: element.parent.item.value, usuario_creacion:sessionStorage.getItem("Usuario"), activo: true});
        //   }          
        // }
      });
    }else{
      this.arreglomenusenvio = [];
    }this.arregloMemoria.forEach((element:any) => {
      if(element.id_detalle_perfil_componente != 0){
        let existe = this.arreglomenusenvio.find((x:any) => x.id_detalle_perfil_componente == element.id_detalle_perfil_componente);
        if(existe == undefined){
          this.arreglomenusenvio.push({id_detalle_perfil_componente : element.id_detalle_perfil_componente, id_perfil: this.idPerfil, id_componente: element.id_componente, usuario_creacion: sessionStorage.getItem("Usuario"), activo: false});
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
    this.fs.insertarDetallePerfilComponente(this.arreglomenusenvio).subscribe(
      (data:any)=>{
        if(data == 0){
          this.funciones.Mensaje("error","No se pudo completar la operacion","",()=>{});
        }
        else{
          this.entidadModal.id_componente = null!;
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

}

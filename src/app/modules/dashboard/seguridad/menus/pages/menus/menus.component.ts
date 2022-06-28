import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'node_modules/ngx-bootstrap/modal';
import { BsModalRef } from 'node_modules/ngx-bootstrap/modal';
import { ModalRegistrarMenuComponent } from '../../modales/modal-registrar-menu/modal-registrar-menu.component';
import { Subscription } from 'rxjs/internal/Subscription';

import { MenuModal, Menu } from 'src/app/services/models/mantenimiento/menu/menu.model';
import { Funciones } from 'src/app/modules/shared/funciones';
import { MantenimientoMenuService } from 'src/app/services/mantenimiento/menu.service';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})

export class MenusComponent implements OnInit, OnDestroy {

  campoBusqueda: number = 0;
  bsModalRef!: BsModalRef;
  totalMenu: number = 0;
  arregloMenu = [];
  lstParametros:any=[];
  response:any;

  menus:any;
  paginaActual: number = 1;
  menu_seleccionado: number=0;
  nombreUsuario: string = "";
  Suscripciones:Subscription= new Subscription();

  constructor(private modalService: BsModalService, private fs: MantenimientoMenuService, private funciones: Funciones) { }
  ngOnDestroy(): void {
    this.Suscripciones.unsubscribe();
  }

  ngOnInit() {
    this.listarMenus();
    this.ListadoPrincipal();
    this.nombreUsuario!=sessionStorage.getItem("Usuario");
  }
  listarMenus() {
    this.fs.listarMenuCombo().subscribe(
      (data:any) => {
        this.menus = data;
      }
    ) 
  }
  ListadoPrincipal() {
    let envio = {
      id_menu_padre: this.campoBusqueda == null ? 0 : this.campoBusqueda
    }
    this.fs.listarMenu(envio).subscribe(
      (data: any) => {
        this.response = data;
        if (this.response != null) {
          this.arregloMenu = this.response;
          this.totalMenu = this.arregloMenu.length;
          this.construirListadoPrincipal(this.arregloMenu);
        } else {
          this.arregloMenu = [];
          this.totalMenu = 0;
        }
        this.campoBusqueda = this.campoBusqueda == 0 ? 0 : this.campoBusqueda;
      }
    )
  }
  lstParametrosHijoParametro:any = [];
  beParametroMenu!: MenuModal;
  construirListadoPrincipal(pListadoMenu:any) {
    this.lstParametrosHijoParametro = [];
    if (pListadoMenu != null) {
      if (pListadoMenu.length > 0) {
        pListadoMenu.forEach((d:any) => {
          if (d.nivel == 0) {
            this.lstParametrosHijoParametro.push(d);
            this.beParametroMenu = new MenuModal();
            this.beParametroMenu = d;
            this.agregarHijo(this.beParametroMenu, pListadoMenu, this.lstParametrosHijoParametro);
          }
        });
      }
    }
  }
  agregarHijo(beParametro: MenuModal, lstParametros:any, lstParametrosHijoParametro:any) {
    let beHijo: MenuModal;
    let list:any = [];

    lstParametros.forEach((x:any) => {
      if (x.id_menu_padre == beParametro.id_menu) {
        list.push(x);
      }
    });

    let concatena = "";
    if (list.length > 0) {
      for (let x = 0; x <= list[0].nivel - 1; x++) {
        concatena = concatena + "      ";
      }
    }

    list.forEach((d:any) => {
      beHijo = new MenuModal();
      beHijo = d;
      d.nombre_menu = concatena + d.nombre_menu;
      lstParametrosHijoParametro.push(d);
      this.agregarHijo(beHijo, lstParametros, lstParametrosHijoParametro);
    });
    return lstParametrosHijoParametro;
  }
  busqueda() {
    let envio = {
      id_menu_padre: this.campoBusqueda == null ? 0 : this.campoBusqueda
    }

    this.fs.listarMenu(envio).subscribe(
      (data:any) => {
        this.response = data;
        if (this.response != "") {
          this.arregloMenu = this.response;
          this.totalMenu = this.arregloMenu.length;
          this.construirListadoPrincipal(this.arregloMenu);
        } else {
          this.arregloMenu = [];
          this.totalMenu = 0;
        }
        this.campoBusqueda = this.campoBusqueda == 0 ? 0 : this.campoBusqueda;
      }
    )
  }
  modalAgregarMenuPadre(objpadre:any) {
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-registrar-menu",
      initialState: {
        entidadEditar: null,
        entidadPadre: objpadre
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistrarMenuComponent, config);
    this.Suscripciones.add(this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.busqueda();
      }
    ));
  }

  modalEditarMenu(obj:any) {
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-registrar-menu",
      initialState: {
        entidadEditar: obj
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistrarMenuComponent, config);
    this.Suscripciones.add(this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.busqueda();
      }
    ));
  }
  mostrarAlerta(codigo:any) {
    this.funciones.Mensaje("question", "Deseas eliminar el siguiente registro?", "", (respuesta:any) => {
      if (respuesta.value) {
        this.eliminar(codigo);
      }
    })
  }
  eliminar(codigo:any) {
    let entidadEliminar = new Menu();
    entidadEliminar.id_menu = codigo;
    entidadEliminar.usuario_anulacion = this.nombreUsuario; //sessionStorage.getItem("Usuario");
    this.fs.anularMenu(entidadEliminar).subscribe(
      (data: any) => {
        if (data.id_menu > 0) {
          this.funciones.Mensaje("success","", "Se deshabilitó el menú!",()=>{});
          this.busqueda();
        }
        else {
          this.funciones.Mensaje("error","", "Ocurrio un error al momento deshabilitar el menú",()=>{});
        }
      }
    )
  }
  modalAgregarMenu() {
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-registrar-menu modal-app",
      initialState: {
        entidadEditar: null
        //,ListadoSistemas: this.ListadoSistemas
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistrarMenuComponent, config);
    this.Suscripciones.add(this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.busqueda();
      }
    ));
  }

  CargarListadoMenus(item: any): void {

    if (item != undefined) {
      this.busqueda();
    }
    else {
      this.menus = [];
    }
  }
}


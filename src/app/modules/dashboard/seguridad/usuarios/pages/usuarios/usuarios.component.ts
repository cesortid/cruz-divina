import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalRegistroUsuarioComponent } from '../../modales/modal-registro-usuario/modal-registro-usuario.component';
import { Router } from '@angular/router';
import { Funciones } from 'src/app/modules/shared/funciones';
import { FiltroMantenimientoUsuario,UsuarioResetearClave } from 'src/app/services/models/mantenimiento/usuario/usuario.model';
import { UsuarioService } from 'src/app/services/mantenimiento/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  config:any;
  bsModalRef!: BsModalRef;
  lstUsuario:any = [];
  lstUsuarioMostrar:any = [];
  totalUsuarios:number=0;

  cantidadRegistros:number=0;

  beFiltroMantenimientoUsuario!: FiltroMantenimientoUsuario;
  lstPerfiles = [];
  id_perfil: number = 0;
  id_usuario: number = 0;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 10;
  paginaActiva: number = 0;
  entidadResetearClave!: UsuarioResetearClave;
  modalRef!: BsModalRef;
  nombre_usuario: string = "";
  constructor(private modalService: BsModalService, private fs: UsuarioService, public funciones: Funciones, private router: Router) { }

  ngOnInit() {
    this.entidadResetearClave = new UsuarioResetearClave();
    this.nombre_usuario = sessionStorage.getItem("Usuario")!;
    this.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil")!);
    this.id_usuario = parseInt(sessionStorage.getItem("IdUsuario")!);
    this.beFiltroMantenimientoUsuario = new FiltroMantenimientoUsuario();
    this.listarControles();
    this.listarUsuarios();
  }

  listarControles() {
    let envio = {
      id_perfil: this.id_perfil,
      id_usuario:this.id_usuario
    };
    this.fs.listarCombo(envio).subscribe(
      (data:any) => {
        let response = data as any;
        if (data != null && data != "") {
          this.lstPerfiles = response.perfil;
        }
      }
    );
  }

  listarUsuarios() {
    let envio = {
        limit: this.beFiltroMantenimientoUsuario.num_filas
      , offset: this.beFiltroMantenimientoUsuario.num_pagina
      , id_perfil: this.beFiltroMantenimientoUsuario.id_perfil
      , persona: this.beFiltroMantenimientoUsuario.persona
      , dni: this.beFiltroMantenimientoUsuario.dni
      , id_padre: this.id_usuario
    };
    this.fs.listarUsuarioAsignado(envio).subscribe(
      (data:any) => {
        let response = data as any;
        this.lstUsuarioMostrar = [];
        if (response.usuario != null && response.usuario != "") {
          this.lstUsuario = response.usuario;
          this.totalUsuarios = response.cantidad_registro;
          this.construirInformacionGrillaUsuarios(this.lstUsuario);


        } else {
          this.totalUsuarios = 0;
          this.lstUsuario = [];
        }
      }
    );
  }

  construirInformacionGrillaUsuarios(pListado:any) {
    let correos: string = "";
    let telefonos: string = "";
    pListado.forEach((e:any) => {
      if (e.correo != null) {
        e.correo.forEach((element:any,index:number) => {
          if(index == 0){
            correos = correos + "- " + element.correo_electronico;
          }else{
            correos = correos + "\n" + "- " + element.correo_electronico;
          }
          
        });
      }
      if (e.telefono != null) {
        e.telefono.forEach((element:any,index:number) => {
          if(index==0){
            telefonos = telefonos + "- " + element.numero_telefono;
          }else{
            telefonos = telefonos + "\n" + "- " + element.numero_telefono;
          }
        });
      }

      e.correos = correos;
      e.telefonos = telefonos;
      this.lstUsuarioMostrar.push(e);
      correos = "";
      telefonos = "";
    });
  }

  modalNuevoUsuario() {
    this.config = {
      ignoreBackdropClick: true,
      class: "modal-lg",
      keyboard: false,
      initialState: {
        beUsuario: null
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistroUsuarioComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.buscarUsuario();
        //this.emitEventListadoTransferencias.emit(true);
      }
    )
  }

  buscarUsuario() {
    this.listarUsuarios();
  }
  modificarEstado(model:any) {
    //let check = event.target.checked;
    this.funciones.Mensaje("question", "¿Está seguro de eliminar el usuario?", "", (respuesta:any) => {
      if (respuesta.value) {
        let strData = {
          "id_usuario": model.id_usuario,
          //"activo": check,
          "usuario_eliminacion": this.nombre_usuario
        };

        this.fs.anularUsuarioSMV(strData).subscribe(
          (data: any) => {
            if (data != null) {
              if(data.hasOwnProperty('id_usuario')){
                //let mensaje = (check ? "El proceso de activación de usuario fue realizado satisfactoriamente " : "El proceso de desactivación de usuario fue realizado satisfactoriamente ");
                let mensaje = "El registro ha sido realizado satisfactoriamente.";
                this.funciones.Mensaje("success","", mensaje,()=>{});
                this.listarUsuarios();
                // if (check) {
                //   let parametroCorreo = data;
                //   this.fs.usuarioService.notificarUsuario(parametroCorreo).subscribe(
                //     data => {
                //       //this.funciones.alertaSimple("success", "", "El proceso de Solicitud de Acceso fue realizado satisfactoriamente, será notificado a su correo electrónico", ()=>{});
                //       this.funciones.mensaje("success","El proceso de Solicitud de Acceso fue realizado satisfactoriamente, será notificado a su correo electrónico");
                //     }
                //   );
                // }
              }
              else{
                //event.target.checked =false;
                this.funciones.Mensaje("error","","No fue posible eliminar el registro",()=>{});
              }
            }
            else {
              this.funciones.Mensaje("error","","Registro eliminado",()=>{});
            }
          }
        )
      } else {
        //event.target.checked = !event.target.checked;
      }
    });
  }

  openEditarUsuario(item:any) {
    this.config = {
      ignoreBackdropClick: true,
      class: "modal-lg",
      //class: "modal-lg registro-personal",
      animated: true,
      keyboard: false,
      initialState: {
        beUsuario: item
      }
    };
    this.bsModalRef = this.modalService.show(ModalRegistroUsuarioComponent, this.config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any) => {
        this.buscarUsuario();
        //this.emitEventListadoTransferencias.emit(true);
      }
    )
  }
  openVerUbigeoUsuario(ubigeo:any) {
    // this.config = {
    //   ignoreBackdropClick: true,
    //   class: "modal-lg registro-solicitudes-recursos",
    //   keyboard: false,
    //   initialState: {
    //     arregloUbigeoUsuario: ubigeo
    //   }
    // };
    // this.bsModalRef = this.modalService.show(ModalVerUbigeoUsuarioComponent, this.config);
  }

  cambiarPagina(pagina:any) {
    this.paginaActiva = ((pagina.page - 1) * this.beFiltroMantenimientoUsuario.num_filas);
    this.numero_Pagina = this.paginaActiva;
    this.listarUsuarios();
  }

  cambiarContrasena(template: TemplateRef<any>, pIdUsuario: number) {
    this.entidadResetearClave.id_usuario = pIdUsuario;
    let config;
    config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      }
    };
    this.modalRef = this.modalService.show(template,config);
  }
  RegistrarReseteo() {
    if (this.entidadResetearClave.repetirClave != this.entidadResetearClave.nuevaClave) {
      this.funciones.Mensaje("warning","","Deben de coincidir las contraseñas",()=>{});
      return;
    } else {
      // let pEnvio = {
      //   intIdUsuario: this.entidadResetearClave.id_usuario,
      //   strClave: this.entidadResetearClave.nuevaClave,
      //   strCambioClave: true
      // }
      this.fs.actualizarContrasenia(this.entidadResetearClave.id_usuario,this.entidadResetearClave.nuevaClave,"true").subscribe(
        (data:any) => {
          let respuesta = data as any;
          if (respuesta != null) {
            if (respuesta.id_usuario > 0) {
              //this.funciones.mensaje("success", this.funciones.mostrarMensaje("insertar", ""));
              //this.funciones.alertaSimpleTimer("success", "", "El cambio de contraseña fue realizado satisfactoriamente.", x => { })
              this.funciones.Mensaje("success","","El cambio de contraseña fue realizado satisfactoriamente.",()=>{});
              this.modalRef.hide();
            }
          }
        }
      );
    }
  }
}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { Usuario, Correo, Telefono, Departamento } from 'src/app/shared/models/mantenimiento/usuario/usuario.model';

import { Funciones } from 'src/app/modules/shared/funciones';
import { UsuarioService } from 'src/app/services/mantenimiento/usuario.service';
import { Usuario, Correo, Telefono, Departamento, Perfiles } from 'src/app/services/models/mantenimiento/usuario/usuario.model';


@Component({
  selector: 'app-modal-registro-usuario',
  templateUrl: './modal-registro-usuario.component.html',
  styleUrls: ['./modal-registro-usuario.component.scss']
})
export class ModalRegistroUsuarioComponent implements OnInit {

  cambiarEditar: boolean = true;
  formUsuario!: FormGroup;
  //lstColegio = [];
  departamento: any;
  unidad_ejecutora: any = [];
  lstDep: any = [];
  lstTelefonos: any = [];
  lstCorreos: any = [];
  @Output() retornoValores = new EventEmitter();
  isResponsableZonal: boolean = false;
  lstPerfiles: any = [];
  id_perfil: number = 0;
  id_usuario: number = 0;
  foto: string = "";
  beUsuario!: Usuario;
  beUsuarioRegistro!: Usuario;
  bRegistro: boolean = true;
  bMostrarDepartamento: boolean = true;
  bMostrarUnidadEjecutora: boolean = true;
  lstDepartamentoUpdate: any = [];
  lstDepartamentoAsignar: any = [];
  lstMatch: any = [];
  lstFinal: any = [];
  file: any;
  nombre_usuario: string = sessionStorage.getItem("Usuario")!;
  codigoDepartamento: any = [];
  bMostrar: boolean = false;
  EsValidoReniec: boolean = false;
  MultiplePerfiles: any = [];
  BeforeUpdatePerfil: any = [];
  constructor(public modalRef: BsModalRef, private formBuilder: FormBuilder, public funciones: Funciones, private fs: UsuarioService) { }

  ngOnInit() {
    this.nombre_usuario = sessionStorage.getItem("Usuario")!;
    if (this.beUsuario == null) {
      this.bRegistro = true
    } else {
      this.bRegistro = false
    }
    this.id_perfil = parseInt(sessionStorage.getItem("Id_Perfil")!);
    this.id_usuario = parseInt(sessionStorage.getItem("IdUsuario")!);


    this.codigoDepartamento = [];//JSON.parse(JSON.parse(sessionStorage.getItem("Departamento")).toString());
    this.cargarForm();
    this.cargarCombos();
    this.setPerfil();

  }

  cargarForm() {
    if (this.bRegistro) { //Registro Nuevo
      this.formUsuario = this.formBuilder.group({
        dni: [null, Validators.required],
        nombre: [null, Validators.required],
        apellido_paterno: [null, Validators.required],
        apellido_materno: [null, Validators.required],
        cip: [null],
        departamento: [null],
        valCorreo: [null, Validators.compose([Validators.required, Validators.email])],
        valTelefono: [null, Validators.compose([Validators.required, Validators.minLength(7)])],
        correo: new FormArray([]),
        telefono: new FormArray([]),
        id_perfil: [null, Validators.required],
        id_padre: sessionStorage.IUsuario,
        id_perfil_padre: this.id_perfil,
        doc_designacion: null,
        id_usuario: 0,
        usuario: null,
        usuario_creacion: this.nombre_usuario,
        foto: null,
        activo: true,
        perfiles: new FormArray([]),
      });
      // let ru_nombre: HTMLInputElement = document.getElementById("ru_nombre") as HTMLInputElement;
      // ru_nombre.readOnly = true;
      // let ru_apaterno: HTMLInputElement = document.getElementById("ru_apaterno") as HTMLInputElement;
      // ru_apaterno.readOnly = true;
      // let ru_amaterno: HTMLInputElement = document.getElementById("ru_amaterno") as HTMLInputElement;
      // ru_amaterno.readOnly = true;
    } else {
      this.formUsuario = this.formBuilder.group({
        dni: this.beUsuario.dni,
        nombre: this.beUsuario.nombre,
        apellido_paterno: this.beUsuario.apellido_paterno,
        apellido_materno: this.beUsuario.apellido_materno,
        departamento: this.beUsuario.departamento,
        valCorreo: [null, Validators.compose([Validators.required, Validators.email])],
        valTelefono: [null, Validators.compose([Validators.required, Validators.minLength(7)])],
        correo: new FormArray([]),
        telefono: new FormArray([]),
        id_perfil: this.beUsuario.id_perfil,
        id_perfil_padre: this.id_perfil,
        id_padre: this.beUsuario.id_padre,
        id_usuario: this.beUsuario.id_usuario,
        usuario: this.beUsuario.usuario,
        usuario_modificacion: this.nombre_usuario,
        foto: this.beUsuario.foto,
        activo: this.beUsuario.activo,
        perfiles: new FormArray([])
      });
      this.foto = this.beUsuario.foto;
      let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
      imagen.src = this.beUsuario.foto;
      this.beUsuario.correo.forEach((element: any) => {
        this.lstCorreos.push(element.correo_electronico);
      });
      this.beUsuario.telefono.forEach((element: any) => {
        this.lstTelefonos.push(element.numero_telefono);
      });
      if (this.beUsuario.departamento != null) {
        this.beUsuario.departamento.forEach((element: any) => {
          if (this.lstDep.indexOf(element.coddepa) == -1) {
            this.lstDep.push(element.coddepa);
          }
        });
      }
      let ru_dni: HTMLInputElement = document.getElementById("dni") as HTMLInputElement;
      ru_dni.readOnly = true;
      // let ru_nombre: HTMLInputElement = document.getElementById("ru_nombre") as HTMLInputElement;
      // ru_nombre.readOnly = true;
      // let ru_apaterno: HTMLInputElement = document.getElementById("ru_apaterno") as HTMLInputElement;
      // ru_apaterno.readOnly = true;
      // let ru_amaterno: HTMLInputElement = document.getElementById("ru_amaterno") as HTMLInputElement;
      // ru_amaterno.readOnly = true;

      this.updateListaCorreos();
      this.updateListaTelefonos();
      //this.lstDepartamentoUpdate = this.beUsuario.departamento;
    };
  }

  cargarCombos() {
    let envio = {
      id_perfil: this.id_perfil,
      id_usuario: this.id_usuario
    };

    this.fs.listarCombo(envio).subscribe(
      (data: any) => {
        if (data != null && data != "") {
          this.lstPerfiles = data.perfil;

          //this.lstColegio = data.colegioprofesional;
          this.departamento = data.departamento;
          this.asignarUbigeoDepartamento();
          if (this.beUsuario != null) {
            //this.MultiplePerfiles=[9,11];
            let asd: any = [];
            this.beUsuario.perfiles.forEach((ele: any, index: number) => {
              asd.push(ele.id_perfil);
            });
            this.BeforeUpdatePerfil = JSON.parse(JSON.stringify(this.beUsuario.perfiles));
            this.MultiplePerfiles = asd;
          }

        }
      }
    );
  }
  asignarUbigeoDepartamento() {
    if (this.departamento != null) {
      let strCodDepa = "";
      this.codigoDepartamento.forEach((element: any, index: number) => {
        this.lstDepartamentoAsignar.push(element.CodDepa);
        if (index == 0) {
          strCodDepa = strCodDepa + element.CodDepa;
        } else {
          strCodDepa = strCodDepa + "," + element.CodDepa;
        }
      });
    } else {
      this.departamento = [];
    }
  }
  closeModal() {
    this.modalRef.hide();
  }

  updateListaCorreos() {
    let correo: FormArray = <FormArray>this.formUsuario.get("correo");
    if (this.beUsuario.correo != null) {
      for (let i = 0; i < this.beUsuario.correo.length; i++) {
        correo.push(this.formBuilder.group({
          correo_electronico: this.beUsuario.correo[i].correo_electronico,
          id_usuario_correo: this.beUsuario.correo[i].id_usuario_correo,
          usuario_modificacion: this.nombre_usuario,
          estado: true
        }
        ));
      }
    }
    return correo;
  }

  updateListaTelefonos() {
    let telefono: FormArray = <FormArray>this.formUsuario.get("telefono");
    if (this.beUsuario.telefono != null) {
      for (let i = 0; i < this.beUsuario.telefono.length; i++) {
        telefono.push(this.formBuilder.group({
          numero_telefono: this.beUsuario.telefono[i].numero_telefono,
          id_usuario_telefono: this.beUsuario.telefono[i].id_usuario_telefono,
          usuario_modificacion: this.nombre_usuario,
          estado: true
        }
        ));
      }
    }
    return telefono;
  }

  agregarCorreo() {
    let valCorreo = this.formUsuario.get("valCorreo")!.value;
    if (valCorreo.trim() == "" || valCorreo == null) {
      document.getElementById("txtCorreo")!.focus();
      this.funciones.Mensaje("info", "", "Debe ingresar un correo.", () => { });
    } else {
      if (this.lstCorreos.find((x: any) => x == valCorreo) != null) {
        this.funciones.Mensaje("info", "", "El correo electrónico ya fue ingresado.", () => { });
        return;
      }

      this.lstCorreos.push(valCorreo);
      this.construirListadoCorreo();
      this.formUsuario.patchValue({ valCorreo: null });
    }
  }

  construirListadoCorreo(): void {
    let correo: FormArray = <FormArray>this.formUsuario.get("correo");
    if (this.bRegistro) {
      while (correo.length !== 0) {
        correo.removeAt(0)
      }
      if (this.lstCorreos != null) {
        for (let i = 0; i < this.lstCorreos.length; i++) {
          correo.push(this.formBuilder.group({
            correo_electronico: this.lstCorreos[i],
            id_usuario_correo: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          }
          ));
        }
      }
    } else {
      correo.push(this.formBuilder.group({
        correo_electronico: this.formUsuario.get("valCorreo")!.value,
        id_usuario_correo: 0,
        usuario_creacion: this.nombre_usuario,
        estado: true
      }
      ));
    }
  }

  eliminarCorreo(index: number) {
    if (this.lstCorreos != null) {
      this.lstCorreos.splice(index, 1);
      let correo: FormArray = <FormArray>this.formUsuario.get("correo");
      if (this.bRegistro) {
        correo.removeAt(index);
      } else {
        correo.value[index].id_usuario_correo == 0 ? correo.removeAt(index) : correo.value[index].estado = false;
      }
    }
  }

  agregarTelefono() {
    let valTelefono = this.formUsuario.get("valTelefono")!.value;
    if (valTelefono.trim() == "" || valTelefono == null) {
      document.getElementById("txtTelefono")!.focus();
      this.funciones.Mensaje("info", "", "Debe ingresar el número de teléfono.", () => { });
    } else {

      if (this.lstTelefonos.find((x: any) => x == valTelefono.trim()) != null) {
        this.funciones.Mensaje("info", "", "El número de Teléfono ya fue ingresado.", () => { });
        return;
      }

      this.lstTelefonos.push(valTelefono);
      this.construirListadoTelefono();
      this.formUsuario.patchValue({ valTelefono: null });
    }
  }

  construirListadoTelefono(): void {
    let telefono: FormArray = <FormArray>this.formUsuario.get("telefono");
    if (this.bRegistro) {
      while (telefono.length !== 0) {
        telefono.removeAt(0)
      }
      if (this.lstTelefonos != null) {
        for (let i = 0; i < this.lstTelefonos.length; i++) {
          telefono.push(this.formBuilder.group({
            numero_telefono: this.lstTelefonos[i],
            id_usuario_telefono: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          }));
        }
      }
    } else {
      telefono.push(this.formBuilder.group({
        numero_telefono: this.formUsuario.get("valTelefono")!.value,
        id_usuario_telefono: 0,
        usuario_creacion: this.nombre_usuario,
        estado: true
      }
      ));
    }
  }

  eliminarTelefono(index: number) {
    if (this.lstTelefonos != null) {
      this.lstTelefonos.splice(index, 1);
      let telefono: FormArray = <FormArray>this.formUsuario.get("telefono");
      if (this.bRegistro) {
        telefono.removeAt(index);
      } else {
        telefono.value[index].id_usuario_telefono == 0 ? telefono.removeAt(index) : telefono.value[index].estado = false;
      }
    }
  }

  guardar() {
    if (this.bRegistro) {
      this.setearParametrosEnvioInformacion(this.formUsuario.value);
      if (this.validarControles()) {

        if (this.beUsuarioRegistro.usuario == null) {
          this.beUsuarioRegistro.usuario = this.beUsuarioRegistro.dni;
        }
        this.bMostrar = true;
        this.fs.insertarUsuario(this.beUsuarioRegistro).subscribe(
          (data: any) => {
            let respuesta = data as any;
            if (respuesta != null) {
              if (respuesta.id_usuario > 0) {
                this.funciones.Mensaje("success", "", "El proceso de registro de usuario fue realizado satisfactoriamente.", () => { });
                this.modalRef.hide();
                this.retornoValores.emit(true);
              } else {
                this.funciones.Mensaje("info", "", respuesta.error, () => { });

              }
            }
            this.bMostrar = false;
          }
        );
      }
    } else {
      this.setearParametrosEnvioInformacion(this.formUsuario.value);
      if (this.validarControles()) {

        this.fs.modificarUsuario(this.beUsuarioRegistro).subscribe(
          (data: any) => {
            let respuesta = data as any;
            if (respuesta != null) {
              if (respuesta.id_usuario > 0) {
                this.funciones.Mensaje("success", "", "Los datos de usuario fueron actualizados satisfactoriamente en el sistema.", () => { });
                this.modalRef.hide();
                this.retornoValores.emit(true);
              } else {
                this.funciones.Mensaje("info", "", respuesta.error, () => { });
              }
            }
          }
        );
      }
    }
  }

  validarControles() {


    // if (this.beUsuarioRegistro.id_perfil == null) {
    //   this.funciones.Mensaje("info","","Debe ingresar un perfil.",()=>{});
    //   return false
    // }

    if (this.MultiplePerfiles.length == 0) {
      this.funciones.Mensaje("info", "", "Debe ingresar un perfil.", () => { });
      return false
    }


    if (this.beUsuarioRegistro.dni == null) {
      this.funciones.Mensaje("info", "", "Debe ingresar DNI.", () => { });
      return false
    }
    if (this.beUsuarioRegistro.apellido_paterno == null || this.beUsuarioRegistro.apellido_materno == null || this.beUsuarioRegistro.nombre == null) {
      this.funciones.Mensaje("info", "", "Debe ingresar el nombre completo del usuario", () => { });
      return false
    }
    if ((this.formUsuario.get("valCorreo")!.value == null || this.formUsuario.get("valCorreo")!.value == '') &&
      this.lstCorreos.length == 0) {
      this.funciones.Mensaje("info", "", "Debe ingresar un correo.", () => { });
      return false
    }

    if ((this.formUsuario.get("valCorreo")!.value != null && this.formUsuario.get("valCorreo")!.value != '')) {
      if (!this.validarEmail(this.formUsuario.get("valCorreo")!.value)) {
        this.funciones.Mensaje("info", "", "Debe ingresar un correo eléctronico valido.", () => { });
        return false;
      }
    }

    if ((this.formUsuario.get("valTelefono")!.value == null || this.formUsuario.get("valTelefono")!.value == '') &&
      this.lstTelefonos.length == 0) {
      this.funciones.Mensaje("info", "", "Debe ingresar un telefono.", () => { });
      return false
    }

    if ((this.formUsuario.get("valTelefono")!.value != null && this.formUsuario.get("valTelefono")!.value != '')) {
      let telefono: string = this.formUsuario.get("valTelefono")!.value;
      if (telefono.length < 7) {
        this.funciones.Mensaje("info", "", "El Nro de Teléfono debe contener al menos 7 Dígitos.", () => { });
        return false;
      }
    }



    return true;

  }

  setearParametrosEnvioInformacion(pFormulario: any) {

    this.beUsuarioRegistro = new Usuario();
    this.beUsuarioRegistro.dni = pFormulario.dni;
    this.beUsuarioRegistro.apellido_paterno = pFormulario.apellido_paterno;
    this.beUsuarioRegistro.apellido_materno = pFormulario.apellido_materno;
    this.beUsuarioRegistro.nombre = pFormulario.nombre;
    this.beUsuarioRegistro.usuario = pFormulario.usuario;
    this.beUsuarioRegistro.usuario_creacion = this.nombre_usuario;
    this.beUsuarioRegistro.usuario_modificacion = this.nombre_usuario;
    this.beUsuarioRegistro.id_usuario = pFormulario.id_usuario;
    this.beUsuarioRegistro.id_padre = this.id_usuario;
    this.beUsuarioRegistro.id_perfil = pFormulario.id_perfil; //Perfil
    this.beUsuarioRegistro.id_perfil_padre = pFormulario.id_perfil_padre; //Perfil
    this.beUsuarioRegistro.foto = "@foto1"; //this.foto;
    this.beUsuarioRegistro.activo = pFormulario.activo;
    this.beUsuarioRegistro.correo = new Array<Correo>();
    this.beUsuarioRegistro.telefono = new Array<Telefono>();
    this.beUsuarioRegistro.departamento = new Array<Departamento>();
    this.beUsuarioRegistro.perfiles = new Array<Perfiles>();

    let _perfiles: any = [];

    if (this.bRegistro) {
      this.MultiplePerfiles.forEach((element: any) => {
        let _perf: any = {
          id_detalle_perfil_usuario: 0,
          id_perfil: element,
          activo: true,
          usuario_creacion: sessionStorage.getItem("Usuario"),
          usuario_modificacion: sessionStorage.getItem("Usuario"),
          usuario_eliminacion: sessionStorage.getItem("Usuario")
        }
        _perfiles.push(_perf);
      });
    }
    else{
      let AntiguosPerfiles:any=[]; //son los que vienen registrados con anterioridad
      this.BeforeUpdatePerfil.forEach((ele:any) => {
        AntiguosPerfiles.push(ele.id_perfil);
      });
      //this.MultiplePerfiles // son los que se ha seleccionado
      let se_mantienen=AntiguosPerfiles.filter((el:any) => this.MultiplePerfiles.includes(el));
      se_mantienen.forEach((element: any) => {
        let hijo=this.BeforeUpdatePerfil.find((x:any)=>x.id_perfil==element);
        let _perf: any = {
          id_detalle_perfil_usuario: hijo.id_detalle_perfil_usuario,
          id_perfil: element,
          activo: true,
          usuario_creacion:sessionStorage.getItem("Usuario"),
          usuario_modificacion: sessionStorage.getItem("Usuario"),
          usuario_eliminacion: sessionStorage.getItem("Usuario")
        }
        _perfiles.push(_perf);
      });


      let se_eliminan=AntiguosPerfiles.filter((el:any) => !this.MultiplePerfiles.includes(el));
      se_eliminan.forEach((element: any) => {
        let hijo=this.BeforeUpdatePerfil.find((x:any)=>x.id_perfil==element);
        let _perf: any = {
          id_detalle_perfil_usuario: hijo.id_detalle_perfil_usuario,
          id_perfil: element,
          activo: false,
          usuario_creacion: sessionStorage.getItem("Usuario"),
          usuario_modificacion: sessionStorage.getItem("Usuario"),
          usuario_eliminacion: sessionStorage.getItem("Usuario")
        }
        _perfiles.push(_perf);
      });

      let nuevos=this.MultiplePerfiles.filter((el:any) => !AntiguosPerfiles.includes(el));
      nuevos.forEach((element: any) => {
        let _perf: any = {
          id_detalle_perfil_usuario: 0,
          id_perfil: element,
          activo: true,
          usuario_creacion: sessionStorage.getItem("Usuario"),
          usuario_modificacion: sessionStorage.getItem("Usuario"),
          usuario_eliminacion: sessionStorage.getItem("Usuario")
        }
        _perfiles.push(_perf);
      });



    }

    this.beUsuarioRegistro.perfiles = _perfiles;


    if (this.bRegistro) {//Registro Nuevo
      if (pFormulario.correo == null) {
        let correo = pFormulario.valCorreo;
        if (correo != null && correo != "") {
          this.beUsuarioRegistro.correo.push({
            correo_electronico: correo,
            id_usuario_correo: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      } else {
        if (pFormulario.correo.length == 0) {
          let correo = pFormulario.valCorreo;
          if (correo != null && correo != "") {
            this.beUsuarioRegistro.correo.push({
              correo_electronico: correo,
              id_usuario_correo: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            });
          }
        } else {

          let correo = pFormulario.valCorreo;
          if (correo != null && correo != "") {
            this.beUsuarioRegistro.correo.push({
              correo_electronico: correo,
              id_usuario_correo: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            });
          }

          pFormulario.correo.forEach((element: any) => {
            this.beUsuarioRegistro.correo.push({
              correo_electronico: element.correo_electronico,
              id_usuario_correo: element.id_usuario_correo,
              usuario_creacion: this.nombre_usuario,
              estado: element.estado
            })
          });
        }
      }

      if (pFormulario.telefono == null) {
        let telefono = pFormulario.valTelefono;
        if (telefono != null && telefono != "") {
          this.beUsuarioRegistro.telefono.push({
            numero_telefono: telefono,
            id_usuario_telefono: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          })
        }
      } else {
        if (pFormulario.telefono.length == 0) {
          let telefono = pFormulario.valTelefono;
          if (telefono != null && telefono != "") {
            this.beUsuarioRegistro.telefono.push({
              numero_telefono: telefono,
              id_usuario_telefono: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }
        } else {

          let telefono = pFormulario.valTelefono;
          if (telefono != null && telefono != "") {
            this.beUsuarioRegistro.telefono.push({
              numero_telefono: telefono,
              id_usuario_telefono: 0,
              usuario_creacion: this.nombre_usuario,
              estado: true
            })
          }

          pFormulario.telefono.forEach((element: any) => {
            this.beUsuarioRegistro.telefono.push({
              numero_telefono: element.numero_telefono,
              id_usuario_telefono: element.id_usuario_telefono,
              usuario_creacion: this.nombre_usuario,
              estado: element.estado
            })
          });
        }
      }
      //if (this.codigoDepartamento == null) {
      if (pFormulario.departamento != null) {
        pFormulario.departamento.forEach((element: any) => {
          if (pFormulario.provincia != null) {
            pFormulario.provincia.forEach((e: any) => {
              if (e.substring(0, 2) == element) {
                this.beUsuarioRegistro.departamento.push({
                  coddepa: element,
                  codprov: e,
                  usuario_creacion: this.nombre_usuario
                });
              }
            });
          } else {
            this.beUsuarioRegistro.departamento.push({
              coddepa: element,
              codprov: null!,
              usuario_creacion: this.nombre_usuario
            });
          }
        });
      }

    } else {
      pFormulario.correo.forEach((element: any) => {
        this.beUsuarioRegistro.correo.push({
          correo_electronico: element.correo_electronico,
          id_usuario_correo: element.id_usuario_correo,
          usuario_creacion: this.nombre_usuario,
          estado: element.estado
        })
      });

      if (this.lstCorreos.length == 0) {
        let correo = pFormulario.valCorreo;
        if (correo != null && correo != "") {
          this.beUsuarioRegistro.correo.push({
            correo_electronico: correo,
            id_usuario_correo: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      }

      let correo = pFormulario.valCorreo;
      if (correo != null && correo != "") {
        if (this.beUsuarioRegistro.correo.find((x: any) => x.correo_electronico == correo) == null) {
          this.beUsuarioRegistro.correo.push({
            correo_electronico: correo,
            id_usuario_correo: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          });
        }
      }


      pFormulario.telefono.forEach((element: any) => {
        this.beUsuarioRegistro.telefono.push({
          numero_telefono: element.numero_telefono,
          id_usuario_telefono: element.id_usuario_telefono,
          usuario_creacion: this.nombre_usuario,
          estado: element.estado
        })
      });

      if (this.lstTelefonos.length == 0) {
        let telefono = pFormulario.valTelefono;
        if (telefono != null && telefono != "") {
          this.beUsuarioRegistro.telefono.push({
            numero_telefono: telefono,
            id_usuario_telefono: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          })
        }
      }

      let telefono = pFormulario.valTelefono;
      if (telefono != null && telefono != "") {
        if (this.beUsuarioRegistro.telefono.find((x: any) => x.numero_telefono == telefono) == null) {
          this.beUsuarioRegistro.telefono.push({
            numero_telefono: telefono,
            id_usuario_telefono: 0,
            usuario_creacion: this.nombre_usuario,
            estado: true
          })
        }
      }

      //if (this.codigoDepartamento == null) {
      if (pFormulario.departamento != null) {
        pFormulario.departamento.forEach((element: any) => {
          let item = this.beUsuario.departamento.find((c: any) => c.coddepa == element);
          if (item == undefined) {
            this.beUsuarioRegistro.departamento.push({
              id_detalle_perfil_usuario: 0,
              coddepa: element,
              codprov: null!,
              activo: true,
              usuario_creacion: this.nombre_usuario
            });
          } else {
            this.beUsuarioRegistro.departamento.push({
              id_detalle_perfil_usuario: item.id_detalle_perfil_usuario,
              coddepa: element,
              codprov: null!,
              activo: true,
              usuario_modificacion: this.nombre_usuario
            });
          }
        });

        this.beUsuario.departamento.forEach((element: any) => {
          let item = pFormulario.departamento.find((c: any) => c == element.coddepa.toString());
          if (item == undefined) {
            this.beUsuarioRegistro.departamento.push({
              id_detalle_perfil_usuario: element.id_detalle_perfil_usuario,
              coddepa: element.coddepa,
              codprov: null!,
              activo: false,
              usuario_modificacion: this.nombre_usuario
            });
          }
        });
      }
    }







  }

  setPerfil() {

    this.bMostrarDepartamento = false;
    this.formUsuario.patchValue({
      departamento: []
    });

    this.formUsuario.controls["departamento"].clearValidators();
    this.formUsuario.controls["departamento"].updateValueAndValidity();

  }

  validarDNI() {
    // let valDni = this.formUsuario.get("dni")!.value;
    // if (valDni.length == 8) {
    //   //this.ValidarInformacionReniec();
    // } else {
    //   this.formUsuario.patchValue({
    //     nombre: null,
    //     apellido_paterno: null,
    //     apellido_materno: null,
    //     usuario: null
    //   });
    //   let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
    //   imagen.src = "";
    // }
  }

  ValidarInformacionReniec() {
    //   let ru_nombre:HTMLInputElement=document.getElementById("ru_nombre") as HTMLInputElement;
    //   ru_nombre.readOnly=true;
    //   let ru_apaterno:HTMLInputElement=document.getElementById("ru_apaterno") as HTMLInputElement;
    //   ru_apaterno.readOnly=true;
    //   let ru_amaterno:HTMLInputElement=document.getElementById("ru_amaterno") as HTMLInputElement;
    //   ru_amaterno.readOnly=true;
    //   let valDni = this.formUsuario.get("dni")!.value;
    //   if (valDni == "" || valDni == null) {
    //     document.getElementById("txtDni")!.focus();
    //     this.funciones.Mensaje("info","","Debe ingresar el N° de DNI a validar.",()=>{});
    //   } else {
    //     this.fs.validarUsuarioActivo(valDni).subscribe(
    //       (validarUsuario: any) => {
    //         if (!validarUsuario.existe) {
    //           this.fs.dataExternaService.consultarInformacionReniec(valDni).subscribe(
    //             (data:any) => {
    //               let response = data as any;
    //               if (data != null && data != "") {
    //                 if(response.strnombres == ""){
    //                   this.funciones.Mensaje("info","","No se encontró información del DNI ingresado.",()=>{});
    //                   this.formUsuario.patchValue({
    //                     nombre: null,
    //                     apellido_paterno: null,
    //                     apellido_materno: null,
    //                     usuario: null
    //                   });
    //                   let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
    //                   imagen.src = "";
    //                   this.EsValidoReniec=false;
    //                 }else{
    //                   this.formUsuario.patchValue({
    //                     nombre: response.strnombres,
    //                     apellido_paterno: response.strapellidopaterno,
    //                     apellido_materno: response.strapellidomaterno,
    //                     usuario: this.formUsuario.value.dni
    //                   });
    //                   this.foto = response.strfoto;
    //                   let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
    //                   // imagen.src = "data:image/jpg;base64," + response.strfoto;
    //                   imagen.src = response.strfoto;
    //                   this.EsValidoReniec=true;
    //                 }

    //               } else {
    //                 this.EsValidoReniec=false;
    //                 this.funciones.Mensaje("info","","No se encontró información del DNI ingresado.",()=>{});
    //                 this.formUsuario.patchValue({
    //                   nombre: null,
    //                   apellido_paterno: null,
    //                   apellido_materno: null,
    //                   usuario: null
    //                 });
    //                 let imagen: HTMLImageElement = document.getElementsByName("imgFoto")[0] as HTMLImageElement;
    //                 imagen.src = "";
    //               }
    //             },
    //             ()=>{
    //               this.EsValidoReniec=false;
    //               let ru_nombre:HTMLInputElement=document.getElementById("ru_nombre") as HTMLInputElement;
    //               ru_nombre.readOnly=false;
    //               let ru_apaterno:HTMLInputElement=document.getElementById("ru_apaterno") as HTMLInputElement;
    //               ru_apaterno.readOnly=false;
    //               let ru_amaterno:HTMLInputElement=document.getElementById("ru_amaterno") as HTMLInputElement;
    //               ru_amaterno.readOnly=false;
    //             }
    //           );
    //         } else {
    //           this.funciones.Mensaje("info","", "El DNI ingresado ya se encuentra registrado en el sistema.",()=>{});
    //         }
    //       }
    //     );
    //   }
  }

  validarEmail(telefono: string): boolean {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (emailRegex.test(telefono)) {
      return true;
    } else {
      return false;
    }
  }

  validarTelefono() {
    if (this.formUsuario.value.valTelefono != "") {
      this.formUsuario.controls["telefono"].clearValidators();
      this.formUsuario.controls["telefono"].updateValueAndValidity();

    } else {

    }
  }
}
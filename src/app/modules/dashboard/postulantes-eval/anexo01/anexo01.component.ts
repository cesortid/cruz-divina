import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Funciones } from 'src/app/modules/shared/funciones';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-anexo01',
  templateUrl: './anexo01.component.html',
  styleUrls: ['./anexo01.component.scss']
})
export class Anexo01Component implements OnInit {
  OBJETO_EDITAR: any = null;

  cboTipoDocumento?: any = [];
  cboSexo: any = [];
  lstClase: any = [];
  cboCategoria: any = [];
  lstCondicion: any = [];
  cboEstadoCivil: any = [];
  cboGradoInstruccion: any = [];
  cboDepartamentoNac: any = [];
  cboProvinciaNac: any = [];
  cboDistritoNac: any = [];

  cboDepartamentoDir: any = [];
  cboPrinvinciaDir: any = [];
  cboDistritoDir: any = [];
  cboPaises: any = [];


  @ViewChild('ddlSexo') ddlSexo!: NgSelectComponent;

  @ViewChild('ddlDepartamentoNac') ddlDepartamentoNac!: NgSelectComponent;
  @ViewChild('ddlTipoDocumento') ddlTipoDocumento!: NgSelectComponent;
  @ViewChild('ddlProvinciaDir') ddlProvinciaDir!: NgSelectComponent;
  @ViewChild('ddlDistritoNac') ddlDistritoNac!: NgSelectComponent;

  @ViewChild('ddlDepartamentoDir') ddlDepartamentoDir!: NgSelectComponent;
  @ViewChild('ddlProvinciaNac') ddlProvinciaNac!: NgSelectComponent;
  @ViewChild('ddlDistritoDir') ddlDistritoDir!: NgSelectComponent;

  @ViewChild('ddlEstadoCivil') ddlEstadoCivil!: NgSelectComponent;
  @ViewChild('ddlCategoria') ddlCategoria!: NgSelectComponent;
  @ViewChild('ddlPaises') ddlPaises!: NgSelectComponent;
  @Output() retornoValores = new EventEmitter();


  @ViewChild('template', { read: TemplateRef }) template!:TemplateRef<any>;

  FORMULARIOS_INCOMPLETOS:boolean=true;
  objFM = {
    "id_ficha_medica_snc": 0,
    "numero_informe": null,
    "numero_snc": null,
    "fecha_informe": "",
    "fecha_inicio_evaluacion": "",
    "hora_inicio_evaluacion": null,
    "fecha_termino_evaluacion": "",
    "hora_termino_evaluacion": null,
    "id_resultado_test_palanca": 0,
    "id_tipo_documento": 1,
    "numero_documento": null,
    "apellido_paterno": null,
    "apellido_materno": null,
    "nombres": null,
    "id_sexo": 1,
    "telefono": null,
    "direccion": "",
    "iddpto": null,
    "idprov": null,
    "iddist": null,
    "id_grado_instruccion": null,
    "otro_grado_instruccion": "----",
    "id_estado_civil": null,
    "ocupacion": null,
    "id_clase": null,
    "id_categoria": null,
    "id_condicion": null,
    "hora_inicio": null,
    "hora_fin": null,
    "filiacion": null,
    "activo": true,
    "usuario_creacion": sessionStorage.getItem("Usuario"),
    "usuario_modificacion": sessionStorage.getItem("Usuario"),
    idprov_dir: null,
    fecha_nacimiento: null,
    edad: 0,
    iddist_dir: null,
    iddpto_dir: null,
    origen_nac: null,
    id_pais: null,
    re_numero_documento:""
  };
  formValido: boolean = false;


  modalRefHijo: BsModalRef=new BsModalRef();


  constructor(public modalRef: BsModalRef, private servicio: FichaMedicaService, private funciones:Funciones,private modalService: BsModalService) { }

  ngOnInit(): void {
    let this_paranet = this;
    this.CargarCombo();

  }
  CargarCombo() {
    this.servicio.listarFichaMedicaControl().subscribe((data: any) => {
      this.cboTipoDocumento = data.resulttipodocumento;
      this.cboSexo = data.resultsexo;
      this.lstClase = data.resultclase;
      this.cboCategoria = data.resultcategoria;
      this.lstCondicion = data.resultcondicion;
      this.cboEstadoCivil = data.resultestadocivil;
      this.cboGradoInstruccion = data.resultgradoinstruccion;
      this.cboDepartamentoNac = data.resultdepartamento;
      //this.cboDepartamentoDir=data.resultdepartamento;

      let DepartamentosCobertura: any = [];
      this.cboDepartamentoNac.forEach((element: any) => {
        if (element.iddpto == "07" || element.iddpto == "15") {
          DepartamentosCobertura.push(element);
        }
      });
      this.cboDepartamentoDir = DepartamentosCobertura;
      this.cboPaises = data.resultpais;

      if (this.OBJETO_EDITAR != null) {




        if(this.OBJETO_EDITAR.iddpto!=null){
          let origen_nac:any=1;
          this.objFM.origen_nac=origen_nac;
          let param = { "iddpto": this.OBJETO_EDITAR.iddpto };
          this.servicio.listarProvincia(param).subscribe((data: any) => {
            this.cboProvinciaNac = data;

            let param_ = { "iddpto": this.OBJETO_EDITAR.iddpto, "idprov": this.OBJETO_EDITAR.idprov };
            this.servicio.listarDistrito(param_).subscribe((data_: any) => {
              this.cboDistritoNac = data_;
              this.CargarComboEdicionDomicilio();
            });
          });
        }
        if(this.OBJETO_EDITAR.id_pais!=null){
          let origen_nac:any=2;
          this.objFM.origen_nac=origen_nac;
          let param = { "iddpto": this.OBJETO_EDITAR.iddpto };

            this.CargarComboEdicionDomicilio();

        }

      }else{
        let hoy_=new Date();
        let hoy= hoy_.getFullYear()+"-"+('0'+(hoy_.getMonth()+1)).slice(-2)+'-'+hoy_.getDate();
        this.objFM.fecha_inicio_evaluacion=hoy;
        this.objFM.fecha_termino_evaluacion=hoy;
        this.objFM.fecha_informe=hoy;
      }

    });
  }
  CargarComboEdicionDomicilio(){
    let param = { "iddpto": this.OBJETO_EDITAR.iddpto_dir };
    this.servicio.listarProvincia(param).subscribe((data: any) => {
      this.cboPrinvinciaDir = data;
      let param_ = { "iddpto": this.OBJETO_EDITAR.iddpto_dir, "idprov": this.OBJETO_EDITAR.idprov_dir };
      this.servicio.listarDistrito(param_).subscribe((data_: any) => {
        this.cboDistritoDir = data_;
        setTimeout(() => {this.SetearEdicion();}, 1);
      });
    });
  }


  CargarProvinciaNac(e: any) {
    this.cboProvinciaNac = [];
    this.objFM.idprov = null;
    this.ddlProvinciaNac.clearAllText;
    this.cboDistritoNac = [];
    this.objFM.iddist = null;
    this.ddlDistritoNac.clearAllText;
    if (e === null || e === undefined) {
    }
    else {
      let param = { "iddpto": e.iddpto };
      this.servicio.listarProvincia(param).subscribe((data: any) => {
        this.cboProvinciaNac = data;
      });
    }
  }
  CargarDistritoNac(e: any) {
    this.cboDistritoNac = [];
    this.objFM.iddist = null;
    this.ddlDistritoNac.clearAllText;
    if (e === null || e === undefined) {
    }
    else {
      let param = { "iddpto": e.iddpto, "idprov": e.idprov };
      this.servicio.listarDistrito(param).subscribe((data: any) => {
        this.cboDistritoNac = data;
      });
    }
  }
  CargarProvinciaDir(e: any) {

    this.cboPrinvinciaDir = [];
    this.objFM.idprov_dir = null;
    this.ddlProvinciaDir.clearAllText;
    this.cboDistritoDir = [];
    this.objFM.iddist_dir = null;
    this.ddlDistritoDir.clearAllText;
    if (e === null || e === undefined) {
    }
    else {
      let param = { "iddpto": e.iddpto };
      this.servicio.listarProvincia(param).subscribe((data: any) => {
        this.cboPrinvinciaDir = data;
      });
    }
  }
  CargarDistritoDir(e: any) {
    this.cboDistritoDir = [];
    this.objFM.iddist_dir = null;
    this.ddlDistritoDir.clearAllText;
    if (e === null || e === undefined) {

    }
    else {
      let param = { "iddpto": e.iddpto, "idprov": e.idprov };
      this.servicio.listarDistrito(param).subscribe((data: any) => {
        this.cboDistritoDir = data;
      });
    }
  }
  AutocompletarCondicion(){
    let casos=[
      {id_categoria:1,id_condicion:1},
      {id_categoria:2,id_condicion:2},
      {id_categoria:3,id_condicion:2},
      {id_categoria:4,id_condicion:2},
      {id_categoria:5,id_condicion:2},
      {id_categoria:6,id_condicion:2},
      {id_categoria:7,id_condicion:2},
      {id_categoria:8,id_condicion:1},
      {id_categoria:9,id_condicion:1},
      {id_categoria:10,id_condicion:1},
      {id_categoria:11,id_condicion:2}
    ];
    let condicion:any=casos.find(x=>x.id_categoria==this.objFM.id_categoria);
    this.objFM.id_condicion=condicion.id_condicion;
  }
  Validar(): boolean {
    if(this.objFM.origen_nac==1){
      this.objFM.id_pais=null;

      try{
        this.ddlPaises.clearAllText;      
       }catch(e){}
    }
    if(this.objFM.origen_nac==2){
      this.objFM.iddpto=null;
      this.objFM.idprov=null;
      this.objFM.iddist=null;

      try{
       this.ddlDepartamentoNac.clearAllText;
      this.ddlProvinciaNac.clearAllText;
      this.ddlDistritoNac.clearAllText;       
      }catch(e){}


      this.cboProvinciaNac=[];
      this.cboDistritoNac=[];
    }

    // if (this.objFM.numero_informe == "" || this.objFM.numero_informe == null) {
    //   this.Mensaje("info", "Digite N° de Informe", () => {
    //     document.getElementById("objFM.numero_informe")?.focus();
    //   })
    //   return false;
    // }
    // if (this.objFM.fecha_informe == "" || this.objFM.fecha_informe == null) {
    //   this.Mensaje("info", "Seleccione fecha de Informe", () => {
    //     document.getElementById("objFM.fecha_informe")?.focus();
    //   })
    //   return false;
    // }
    if (this.objFM.fecha_inicio_evaluacion == "" || this.objFM.fecha_inicio_evaluacion == null) {
      this.Mensaje("info", "Seleccione fecha de Inicio de la Evaluación Médica", () => {
        document.getElementById("objFM.fecha_inicio_evaluacion")?.focus();
      })
      return false;
    }
    // if (this.objFM.fecha_termino_evaluacion == "" || this.objFM.fecha_termino_evaluacion == null) {
    //   this.Mensaje("info", "Seleccione fecha de Término de la Evaluación Médica", () => {
    //     document.getElementById("objFM.fecha_termino_evaluacion")?.focus();
    //   })
    //   return false;
    // }

    if (this.objFM.hora_inicio_evaluacion == "" || this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "00:00" ) {
      // this.Mensaje("info", "Digite la hora de Inicio de la Evaluación Médica", () => {
      //   document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
      // })
      // return false;
      this.objFM.hora_inicio_evaluacion=null;
    
    }

    if (this.OBJETO_EDITAR != null) {
      // if (this.objFM.hora_termino_evaluacion == "" || this.objFM.hora_termino_evaluacion == null) {
      //   this.Mensaje("info", "Digite la hora de Término de la Evaluación Médica", () => {
      //     document.getElementById("objFM.hora_termino_evaluacion")?.focus();
      //   })
      //   return false;
      // }      
    }

    if (this.objFM.id_tipo_documento == 0 || this.objFM.id_tipo_documento == null) {
      this.Mensaje("info", "Seleccione tipo de documento", () => {
        document.getElementById("objFM.id_tipo_documento")?.focus();
        this.ddlTipoDocumento.focus();
      })
      return false;
    }
    if (this.objFM.numero_documento == "" || this.objFM.numero_documento == null) {
      this.Mensaje("info", "Digite número de Documento", () => {
        document.getElementById("objFM.numero_documento")?.focus();
      })
      return false;
    }

    if (this.objFM.apellido_paterno == "" || this.objFM.apellido_paterno == null) {
      this.Mensaje("info", "Digite Apellido Paterno del postulante", () => {
        document.getElementById("objFM.apellido_paterno")?.focus();
      })
      return false;
    }
    if (this.objFM.apellido_materno == "" || this.objFM.apellido_materno == null) {
      this.Mensaje("info", "Digite Apellido Materno del postulante", () => {
        document.getElementById("objFM.apellido_materno")?.focus();
      })
      return false;
    }
    if (this.objFM.nombres == "" || this.objFM.nombres == null) {
      this.Mensaje("info", "Digite Nombre del postulante", () => {
        document.getElementById("objFM.nombres")?.focus();
      })
      return false;
    }
    if (this.objFM.fecha_nacimiento == "" || this.objFM.fecha_nacimiento == null) {
      this.Mensaje("info", "Seleccione la fecha de nacimiento del postulante", () => {
        document.getElementById("objFM.fecha_nacimiento")?.focus();
      })
      return false;
    }

    if (this.objFM.id_sexo == 0 || this.objFM.id_sexo == null) {
      this.Mensaje("info", "Seleccione campo sexo", () => {
        this.ddlSexo.focus();
      })
      return false;
    }
    if (this.objFM.telefono == 0 || this.objFM.telefono == null) {
      this.Mensaje("info", "Digite teléfono", () => {
        document.getElementById("objFM.telefono")?.focus();
      })
      return false;
    }


    //SI ES PERUANO

    //PREGUNTAMOS LA PAIS DE NACIMIENTO (PERU O EXTRANJERO)
    // SI ES PERU ENTONCES VALIDAR DEP, PROV, DIST
    // SI ES EXTRANEJROI NO VALIDAD, VALIDAD EL PAIS
    if (this.objFM.origen_nac == 0 || this.objFM.origen_nac == null) {
      this.Mensaje("info", "Seleccione pais de nacimiento", () => {

        document.getElementById("optPaisNacimiento")?.focus();
      })
      return false;
    }
    if (this.objFM.origen_nac == 1) {
      if (this.objFM.iddpto == "" || this.objFM.iddpto == null) {
        this.Mensaje("info", "Seleccione departamento de nacimiento", () => {
          this.ddlDepartamentoNac.focus();
        })
        return false;
      }
      if (this.objFM.idprov == "" || this.objFM.idprov == null) {
        this.Mensaje("info", "Seleccione provincia de nacimiento", () => {
          this.ddlProvinciaNac.focus();
        })
        return false;
      }
      if (this.objFM.iddist == "" || this.objFM.iddist == null) {
        this.Mensaje("info", "Seleccione distrito de nacimiento", () => {
          this.ddlDistritoNac.focus();
        })
        return false;
      }
    }


    if (this.objFM.origen_nac == 2) {
      //validad qeu se haya seleccionada el pais
      if (this.objFM.id_pais == 0 || this.objFM.id_pais == null) {
        this.Mensaje("info", "Seleccione pais de nacimiento", () => {
          this.ddlPaises.focus();
        });
        return false;
      }
    }


    if (this.objFM.direccion == "" || this.objFM.direccion == null) {
      this.Mensaje("info", "Digite la dirección del postulante", () => {
        document.getElementById("objFM.direccion")?.focus();
      })
      return false;
    }


    if (this.objFM.iddpto_dir == "" || this.objFM.iddpto_dir == null) {
      this.Mensaje("info", "Seleccione departamento de domicilio", () => {
        this.ddlDepartamentoDir.focus();
      })
      return false;
    }
    if (this.objFM.idprov_dir == "" || this.objFM.idprov_dir == null) {
      this.Mensaje("info", "Seleccione provincia de domicilio", () => {
        this.ddlProvinciaDir.focus();
      })
      return false;
    }
    if (this.objFM.iddist_dir == "" || this.objFM.iddist_dir == null) {
      this.Mensaje("info", "Seleccione distrito de domicilio", () => {
        this.ddlDistritoDir.focus();
      })
      return false;
    }
    if (this.objFM.id_grado_instruccion == 0 || this.objFM.id_grado_instruccion == null) {
      this.Mensaje("info", "Seleccione Grado de Instrucción", () => {
        document.getElementById("objFM.id_grado_instruccion")?.focus();
      })
      return false;
    }
    if (
      (this.objFM.id_grado_instruccion == 4 || this.objFM.id_grado_instruccion == 5) 
      &&
      (this.objFM.otro_grado_instruccion== "" || this.objFM.otro_grado_instruccion== null)
      )
       {
      this.Mensaje("info", "Digite Profesión", () => {
        document.getElementById("objFM.otro_grado_instruccion")?.focus();
      })
      return false;
    }

    if (this.objFM.id_estado_civil == 0 || this.objFM.id_estado_civil == null) {
      this.Mensaje("info", "Seleccione Estado Civil", () => {
        // document.getElementById("objFM.id_grado_instruccion")?.focus();
        this.ddlEstadoCivil.focus();
      })
      return false;
    }
    if (this.objFM.ocupacion == "" || this.objFM.ocupacion == null) {
      this.Mensaje("info", "Digite Ocupación", () => {
        document.getElementById("objFM.ocupacion")?.focus();
      })
      return false;
    }


    if (this.objFM.id_clase == "" || this.objFM.id_clase == null) {
      this.Mensaje("info", "Seleccione clase", () => {
        // document.getElementById("objFM.numero_documento")?.focus();
      })
      return false;
    }
    if (this.objFM.id_categoria == 0 || this.objFM.id_categoria == null) {
      this.Mensaje("info", "Seleccione categoría", () => {
        this.ddlCategoria.focus();
      })
      return false;
    }
    if (this.objFM.id_condicion == 0 || this.objFM.id_condicion == null) {
      this.Mensaje("info", "Seleccione condición", () => {
        // document.getElementById("objFM.numero_documento")?.focus();
      })
      return false;
    }


    //aca va lña validacion y mensajes

    return true;
  }
  Guardar() {



    if (this.Validar()) {
      

      if (this.OBJETO_EDITAR == null) {
        this.servicio.insertarFichamedica(this.objFM).subscribe((data: any) => {
          this.modalRef.hide();
          this.funciones.Mensaje("success","Mensaje del sistema","Se registró a postulante",()=>{
            this.retornoValores.emit(true);
          });
        });
      }
      else {
        this.servicio.Modificarfichamedica(this.objFM).subscribe((data: any) => {
          this.modalRef.hide();
          this.funciones.Mensaje("success","Mensaje del sistema","Información guardada",()=>{
            this.retornoValores.emit(true);
          });
        });
      }
    }

  };
  AbrirModalValidarDocumento(){
    this.objFM.re_numero_documento="";
    if (this.Validar()) {
      let config = {
        ignoreBackdropClick: false,
        keyboard: true,
        class: 'modal-sm modal-dialog-centered'
      };
      this.modalRefHijo = this.modalService.show(this.template,config);   
    }
  }
  ValidarDocumento(){
    if(this.objFM.numero_documento==this.objFM.re_numero_documento){
      this.modalRefHijo.hide();
      this.Guardar();
    }
    else{
      this.funciones.Mensaje("info","","Digite correctamente el DNI",()=>{})
    }
  }

  SetearEdicion() {

    this.objFM.id_ficha_medica_snc = this.OBJETO_EDITAR.id_ficha_medica_snc;
    this.objFM.numero_informe = this.OBJETO_EDITAR.numero_informe;
    this.objFM.numero_snc = this.OBJETO_EDITAR.numero_snc;

    // this.objFM.fecha_informe = this.getFecha(this.OBJETO_EDITAR.fecha_informe);
    // this.objFM.fecha_inicio_evaluacion = this.getFecha(this.OBJETO_EDITAR.fecha_inicio_evaluacion);

    this.objFM.fecha_informe = this.getDatePeruToUSA(this.OBJETO_EDITAR.fecha_informe);
    this.objFM.fecha_inicio_evaluacion = this.getDatePeruToUSA(this.OBJETO_EDITAR.fecha_inicio_evaluacion);
    this.objFM.fecha_termino_evaluacion = this.getDatePeruToUSA(this.OBJETO_EDITAR.fecha_termino_evaluacion);

    
    //this.objFM.hora_inicio_evaluacion = this.getHora(this.OBJETO_EDITAR.hora_inicio_evaluacion);
    this.objFM.hora_inicio_evaluacion = this.OBJETO_EDITAR.hora_inicio_evaluacion;
    //this.objFM.hora_termino_evaluacion = this.getHora(this.OBJETO_EDITAR.hora_termino_evaluacion);
    this.objFM.hora_termino_evaluacion = this.OBJETO_EDITAR.hora_termino_evaluacion;
    this.objFM.id_tipo_documento = this.OBJETO_EDITAR.id_tipo_documento;
    this.objFM.numero_documento = this.OBJETO_EDITAR.numero_documento;
    this.objFM.apellido_paterno = this.OBJETO_EDITAR.apellido_paterno;
    this.objFM.apellido_materno = this.OBJETO_EDITAR.apellido_materno;
    this.objFM.nombres = this.OBJETO_EDITAR.nombres;
    this.objFM.id_sexo = this.OBJETO_EDITAR.id_sexo;
    this.objFM.telefono = this.OBJETO_EDITAR.telefono;
    this.objFM.direccion = this.OBJETO_EDITAR.direccion;
    this.objFM.iddpto = this.OBJETO_EDITAR.iddpto;
    this.objFM.idprov = this.OBJETO_EDITAR.idprov;
    this.objFM.iddist = this.OBJETO_EDITAR.iddist;
    this.objFM.id_grado_instruccion = this.OBJETO_EDITAR.id_grado_instruccion;

    this.objFM.otro_grado_instruccion = this.OBJETO_EDITAR.otro_grado_instruccion;
    this.objFM.id_estado_civil = this.OBJETO_EDITAR.id_estado_civil;
    this.objFM.ocupacion = this.OBJETO_EDITAR.ocupacion;
    this.objFM.id_clase = this.OBJETO_EDITAR.id_clase; //<<<<------------------
    this.objFM.id_categoria = this.OBJETO_EDITAR.id_categoria;
    this.objFM.id_condicion = this.OBJETO_EDITAR.id_condicion; //<<---------------
    // this.objFM.hora_inicio = this.getHora(this.OBJETO_EDITAR.hora_inicio);
    // this.objFM.hora_fin =this.getHora(this.OBJETO_EDITAR.hora_fin);


    this.objFM.filiacion = this.OBJETO_EDITAR.filiacion;
    this.objFM.iddpto_dir = this.OBJETO_EDITAR.iddpto_dir;
    this.objFM.idprov_dir = this.OBJETO_EDITAR.idprov_dir;
    this.objFM.fecha_nacimiento =  this.getFecha(this.OBJETO_EDITAR.fecha_nacimiento);
    this.objFM.edad = this.OBJETO_EDITAR.edad;
    this.objFM.iddist_dir = this.OBJETO_EDITAR.iddist_dir;
    this.objFM.id_pais = this.OBJETO_EDITAR.id_pais;

    this.servicio.obtenerFichaMedica({ "id_ficha_medica_snc": this.objFM.id_ficha_medica_snc }).subscribe((data: any) => {
      let OBJ_HORA = data.objhoraevaluacion;
      if (
        (OBJ_HORA.hora_termino_evaluacion_an_lab != null) &&
        (OBJ_HORA.hora_termino_evaluacion_evaps != null) &&
        (OBJ_HORA.hora_termino_evaluacion_evis != null) &&
        (OBJ_HORA.hora_termino_evaluacion_evaud != null) &&
        (OBJ_HORA.hora_termino_evaluacion_evacl != null)
      ){
        this.FORMULARIOS_INCOMPLETOS=false;
      }
      else{
        this.FORMULARIOS_INCOMPLETOS=true;
      }

      //this.ValidacionCondicion();
    });

  }
  Mensaje(tipo: any, mensaje: any, condicion: any) {
    Swal.fire({
      title: 'Mensaje del sistema',
      text: mensaje,
      icon: tipo,
      confirmButtonText: 'Ok',
      returnFocus: false
    }).then(condicion);
  }
  getEdad(fecha: any) {

    let dateString = fecha.target.value;
    let hoy = new Date();
    let fechaNacimiento = new Date(dateString);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    this.objFM.edad = edad;
    //return edad;
  }
  getFecha(fechastring: any):any {
    let fecha = new Date(fechastring);
    return fecha.getFullYear() + "-" + (this.zfill(fecha.getMonth() + 1,2)) + "-" + this.zfill(fecha.getDate(),2);
  }
  getHora(fechastring: any):any {

    let fecha = new Date(fechastring);
    return  fecha.getHours() + ':' + fecha.getMinutes();
  }
  zfill(number: any, width: any) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return ("-" + numberOutput.toString());
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
      } else {
        return ((zero.repeat(width - length)) + numberOutput.toString());
      }
    }
  }
  Disabled_Profesion:boolean=true;
  GradoInstruccionSeleccionado(e:any){
    if(
      this.objFM.id_grado_instruccion==null 
      || this.objFM.id_grado_instruccion==1
      || this.objFM.id_grado_instruccion==2
      || this.objFM.id_grado_instruccion==3
      ){
        this.objFM.otro_grado_instruccion="----";
        this.Disabled_Profesion=true;
      }
      else{
        this.objFM.otro_grado_instruccion="";
        this.Disabled_Profesion=false;
      }
  }
  FechaInicioSeleccionada(){
    this.objFM.fecha_informe=this.objFM.fecha_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion=this.objFM.fecha_inicio_evaluacion;
  }
  SetearReDocumento(digito:string){
    this.objFM.re_numero_documento=this.objFM.re_numero_documento+""+digito;
  }
  LimpiarReDocumento(){
    this.objFM.re_numero_documento="";
  }
  getDatePeruToUSA(ddmmyyyy:string):string{
    let partes=ddmmyyyy.split("/");
    return partes[2]+"-"+partes[1]+"-"+partes[0];
  }
  Imprimir(){
    window.print();
  }

}

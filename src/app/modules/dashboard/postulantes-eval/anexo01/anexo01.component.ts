import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import Swal from 'sweetalert2'
import { HomonimosComponent } from '../modales/homonimos/homonimos.component';


@Component({
  selector: 'app-anexo01',
  templateUrl: './anexo01.component.html',
  styleUrls: ['./anexo01.component.scss']
})
export class Anexo01Component implements OnInit {
  OBJETO_EDITAR: any = null;

  cboTipoDocumento?: any = [];
  cboSexo: any = [];
  lstTramite: any = [];
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
  cboClase: any = [];
  cboProfesion:any=[];
  cboOcupacion:any=[];

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

  @ViewChild('ddlProfesion') ddlProfesion!: NgSelectComponent;
  @ViewChild('ddlOcupacion') ddlOcupacion!: NgSelectComponent;
  @ViewChild('ddlClase') ddlClase!: NgSelectComponent;

  
  

  @Output() retornoValores = new EventEmitter();


  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  FORMULARIOS_INCOMPLETOS: boolean = true;
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
    "id_tramite": null,
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
    re_numero_documento: "",
    id_clase: null,
    id_profesion:null,
    id_ocupacion:null,
    otro_profesion:"",
    otro_ocupacion:"",
    validar_edad:true
  };
  formValido: boolean = false;


  modalRefHijo: BsModalRef = new BsModalRef();
  BsModalRef_hijo!:BsModalRef;
  filtro_edad:any;

  es_nacional:boolean=false;
  sede_depa:any=[];


  constructor(public modalRef: BsModalRef, private servicio: FichaMedicaService, public funciones: Funciones, private modalService: BsModalService,
    private crypto: CryptoService) { }

  ngOnInit(): void {
    let this_paranet = this;
    this.CargarCombo();
    this.es_nacional=(String(this.crypto.desencriptar(sessionStorage.getItem("Org_1")!)).toUpperCase()=="TRUE")?true:false;
    this.sede_depa=JSON.parse(this.crypto.desencriptar(sessionStorage.getItem("Org_2")!));

    console.log(this.es_nacional);
    console.log(this.sede_depa);
  }
  CargarCombo() {
    this.servicio.listarFichaMedicaControl().subscribe((data: any) => {
      this.cboTipoDocumento = data.resulttipodocumento;
      this.cboSexo = data.resultsexo;
      this.lstTramite = data.resulttramite;
      this.cboCategoria = data.resultcategoria;
      this.lstCondicion = data.resultcondicion;
      this.cboEstadoCivil = data.resultestadocivil;
      this.cboGradoInstruccion = data.resultgradoinstruccion;
      this.cboDepartamentoNac = data.resultdepartamento;
      this.filtro_edad=data.resultedad[0];
      //this.cboDepartamentoDir=data.resultdepartamento;

      let DepartamentosCobertura: any = [];




      this.cboDepartamentoNac.forEach((element: any) => {

        if(this.es_nacional){
          DepartamentosCobertura.push(element);
        }
        else{
          // [{"Id_Sede_Ubigeo":"1","CodDepa":"15","CodProv":"1501"},{"Id_Sede_Ubigeo":"2","CodDepa":"07","CodProv":"0701"}]
          let existe=this.sede_depa.filter((x:any)=>x.CodDepa==element.iddpto);
          if(existe.length>0){
            DepartamentosCobertura.push(element);
          }        
        }
      });
      this.cboDepartamentoDir = DepartamentosCobertura;
      if(this.OBJETO_EDITAR==null){
        this.objFM.iddpto_dir=this.sede_depa[0].CodDepa;
        let param = { "iddpto": this.objFM.iddpto_dir };
        this.servicio.listarProvincia(param).subscribe((data: any) => {
          this.cboPrinvinciaDir = data;

 
            let num_prov:any=String(this.sede_depa[0].CodDepa+"01");
            this.objFM.idprov_dir=num_prov;//;
            let param_ = { "iddpto": this.objFM.iddpto_dir, "idprov": this.objFM.idprov_dir };
            this.servicio.listarDistrito(param_).subscribe((data_: any) => {
              this.cboDistritoDir = data_;
              let num_dist:any=String(this.sede_depa[0].CodDepa+"0101");
              this.objFM.iddist_dir=num_dist;//;
            });            


        });
      }



      this.cboPaises = data.resultpais;
      this.cboProfesion=data.resultprofesion;
      this.cboOcupacion=data.resultocupacion;

      if (this.OBJETO_EDITAR != null) {




        if (this.OBJETO_EDITAR.iddpto != null) {
          let origen_nac: any = 1;
          this.objFM.origen_nac = origen_nac;
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
        if (this.OBJETO_EDITAR.id_pais != null) {
          let origen_nac: any = 2;
          this.objFM.origen_nac = origen_nac;
          let param = { "iddpto": this.OBJETO_EDITAR.iddpto };

          this.CargarComboEdicionDomicilio();

        }

      } else {
        let hoy_ = new Date();
        let hoy = hoy_.getFullYear() + "-" + ('0' + (hoy_.getMonth() + 1)).slice(-2) + '-' + hoy_.getDate();
        this.objFM.fecha_inicio_evaluacion = hoy;
        //this.objFM.fecha_termino_evaluacion = hoy;
       // this.objFM.fecha_informe = hoy;
      }

    });
  }
  CargarComboEdicionDomicilio() {
    let param = { "iddpto": this.OBJETO_EDITAR.iddpto_dir };
    this.servicio.listarProvincia(param).subscribe((data: any) => {
      this.cboPrinvinciaDir = data;
      let param_ = { "iddpto": this.OBJETO_EDITAR.iddpto_dir, "idprov": this.OBJETO_EDITAR.idprov_dir };
      this.servicio.listarDistrito(param_).subscribe((data_: any) => {
        this.cboDistritoDir = data_;
        setTimeout(() => { this.SetearEdicion(); }, 1);
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
  AutocompletarCondicion() {



    let casos = [
      { id_clase:1, id_categoria: 3, id_condicion: 1 },
      { id_clase:1, id_categoria: 4, id_condicion: 2 },
      { id_clase:1, id_categoria: 5, id_condicion: 2 },
      { id_clase:1, id_categoria: 6, id_condicion: 2 },
      { id_clase:1, id_categoria: 7, id_condicion: 2 },
      { id_clase:1, id_categoria: 8, id_condicion: 2 },
      { id_clase:1, id_categoria: 9, id_condicion: 2 },

      { id_clase:2, id_categoria: 10, id_condicion: 1 },
      { id_clase:2, id_categoria: 11, id_condicion: 1 },
      { id_clase:2, id_categoria: 12, id_condicion: 1 },
      { id_clase:2, id_categoria: 13, id_condicion: 2 },


    ];
    let condicion: any = casos.find(x => x.id_categoria == this.objFM.id_categoria);
    this.objFM.id_condicion = condicion.id_condicion;
  }
  Validar(): boolean {
    if (this.objFM.origen_nac == 1) {
      this.objFM.id_pais = null;

      try {
        this.ddlPaises.clearAllText;
      } catch (e) { }
    }
    if (this.objFM.origen_nac == 2) {
      this.objFM.iddpto = null;
      this.objFM.idprov = null;
      this.objFM.iddist = null;

      try {
        this.ddlDepartamentoNac.clearAllText;
        this.ddlProvinciaNac.clearAllText;
        this.ddlDistritoNac.clearAllText;
      } catch (e) { }


      this.cboProvinciaNac = [];
      this.cboDistritoNac = [];
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

    if (this.objFM.hora_inicio_evaluacion == "" || this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "00:00") {
      // this.Mensaje("info", "Digite la hora de Inicio de la Evaluación Médica", () => {
      //   document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
      // })
      // return false;
      this.objFM.hora_inicio_evaluacion = null;

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
    // if (this.objFM.fecha_nacimiento == "" || this.objFM.fecha_nacimiento == null) {
    //   this.Mensaje("info", "Seleccione la fecha de nacimiento del postulante", () => {
    //     document.getElementById("objFM.fecha_nacimiento")?.focus();
    //   })
    //   return false;
    // }







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
    let obtener_primer_numero=String(String(this.objFM.telefono).substring(0,1));

    if (obtener_primer_numero=="9") {
      if (String(this.objFM.telefono).length!=9) {
        this.Mensaje("info", "Formato de número de teléfono incorrecto", () => {
          document.getElementById("objFM.telefono")?.focus();
        })
        return false;
      }
    }
    if (obtener_primer_numero!="9") {
      if (String(this.objFM.telefono).length!=8) {
        this.Mensaje("info", "Formato de número de teléfono incorrecto", () => {
          document.getElementById("objFM.telefono")?.focus();
        })
        return false;
      }
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
      (this.objFM.id_profesion  == null)
    ) {
      this.Mensaje("info", "Seleccione Profesión", () => {
        this.ddlProfesion.focus()
      })
      return false;
    }
    if (
      (this.objFM.id_grado_instruccion == 4 || this.objFM.id_grado_instruccion == 5)
      &&
      (this.objFM.id_profesion  == 8)
      &&
      (this.objFM.otro_profesion  == "")
    ) {
      this.Mensaje("info", "Digite Profesión", () => {
        document.getElementById("objFM.otro_profesion")?.focus();
      })
      return false;
    }


    if (this.objFM.id_estado_civil == 0 || this.objFM.id_estado_civil == null) {
      this.Mensaje("info", "Seleccione Estado Civil", () => {
        // document.getElementById("objFM.id_grado_instruccion")?.focus();
        this.ddlEstadoCivil.focus();
      });
      return false;
    }



    if (this.objFM.id_ocupacion==null) {
      this.Mensaje("info", "Seleccione Ocupación", () => {
        this.ddlOcupacion.focus();
      });
      return false;
    }

    if (this.objFM.id_ocupacion==2 && this.objFM.otro_ocupacion=="" ) {
      this.Mensaje("info", "Digite Ocupación", () => {
        document.getElementById("objFM.otro_ocupacion")?.focus();
      });
      return false;
    }


    if (this.objFM.id_tramite == "" || this.objFM.id_tramite == null) {
      this.Mensaje("info", "Seleccione trámite", () => {
        // document.getElementById("objFM.numero_documento")?.focus();
      });
      return false;
    }
    if (this.objFM.id_clase ==  null) {
      this.Mensaje("info", "Seleccione clase", () => {
        this.ddlClase.focus()
      });
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
   // if(this.objFM.validar_edad){
    //}

    //aca va lña validacion y mensajes

    return true;
  }
  Guardar() {

    if(this.objFM.edad==null){
      this.Mensaje("info", "Seleccione fecha de nacimiento", () => {
        document.getElementById("objFM.fecha_nacimiento")?.focus();
      })
    }
    else{
      if ((Number(this.objFM.edad) < Number(this.filtro_edad.edad_minima)) || (Number(this.objFM.edad) > Number(this.filtro_edad.edad_maxima))) {
        this.funciones.Mensaje("question","Aviso del sistema","El postulante no cumple con la edad requerida ¿Está seguro que desea continuar con el registro?",(respuesta:any) => {
          if(respuesta.value){
            if (this.Validar()) {          
              this.Guardar2();
            }
          }
        });
      }      
    }





  };

  Guardar2(){
    if (this.OBJETO_EDITAR == null) {
      this.servicio.insertarFichamedica(this.objFM).subscribe((data: any) => {
        this.modalRef.hide();
        this.funciones.Mensaje("success", "Mensaje del sistema", "Se registró a postulante", () => {
          this.retornoValores.emit(true);
        });
      });
    }
    else {
      this.servicio.Modificarfichamedica(this.objFM).subscribe((data: any) => {
        this.modalRef.hide();
        this.funciones.Mensaje("success", "Mensaje del sistema", "Información guardada", () => {
          this.retornoValores.emit(true);
        });
      });
    }
  }
  AbrirModalValidarDocumento() {
    this.objFM.re_numero_documento = "";
    if (this.Validar()) {
      let config = {
        ignoreBackdropClick: false,
        keyboard: true,
        class: 'modal-sm modal-dialog-centered'
      };
      this.modalRefHijo = this.modalService.show(this.template, config);
    }
  }
  ValidarDocumento() {
    if (this.objFM.numero_documento == this.objFM.re_numero_documento) {
      this.modalRefHijo.hide();
      this.Guardar();
    }
    else {
      this.funciones.Mensaje("info", "", "Digite correctamente el DNI", () => { })
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
    this.objFM.id_tramite = this.OBJETO_EDITAR.id_tramite; //<<<<------------------
    this.objFM.id_categoria = this.OBJETO_EDITAR.id_categoria;
    this.objFM.id_condicion = this.OBJETO_EDITAR.id_condicion; //<<---------------
    // this.objFM.hora_inicio = this.getHora(this.OBJETO_EDITAR.hora_inicio);
    // this.objFM.hora_fin =this.getHora(this.OBJETO_EDITAR.hora_fin);


    this.objFM.filiacion = this.OBJETO_EDITAR.filiacion;
    this.objFM.iddpto_dir = this.OBJETO_EDITAR.iddpto_dir;
    this.objFM.idprov_dir = this.OBJETO_EDITAR.idprov_dir;
    this.objFM.fecha_nacimiento = this.getFecha(this.OBJETO_EDITAR.fecha_nacimiento);
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
      ) {
        this.FORMULARIOS_INCOMPLETOS = false;
      }
      else {
        this.FORMULARIOS_INCOMPLETOS = true;
      }

      //this.ValidacionCondicion();
    });

    

    this.objFM.id_profesion=this.OBJETO_EDITAR.id_profesion;
    this.objFM.id_ocupacion=this.OBJETO_EDITAR.id_ocupacion;
    this.objFM.otro_profesion=this.OBJETO_EDITAR.otro_profesion;
    this.objFM.otro_ocupacion=this.OBJETO_EDITAR.otro_ocupacion;




    this.CargarClase(Number(this.objFM.id_tramite)).then((rpta:any)=>{
      this.objFM.id_clase=this.OBJETO_EDITAR.id_clase;
      this.CargarCategoria().then(()=>{
        this.objFM.id_categoria=this.OBJETO_EDITAR.id_categoria;

      });
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
  getEdad(fecha: any,input:any=null) {
    let dateString = (input==null)?fecha.target.value:input;
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
  getFecha(fechastring: any): any {
    let fecha = new Date(fechastring);
    return fecha.getFullYear() + "-" + (this.zfill(fecha.getMonth() + 1, 2)) + "-" + this.zfill(fecha.getDate(), 2);
  }
  getHora(fechastring: any): any {

    let fecha = new Date(fechastring);
    return fecha.getHours() + ':' + fecha.getMinutes();
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
  Disabled_Profesion: boolean = true;
  GradoInstruccionSeleccionado(e: any) {
    if (
      this.objFM.id_grado_instruccion == null
      || this.objFM.id_grado_instruccion == 1
      || this.objFM.id_grado_instruccion == 2
      || this.objFM.id_grado_instruccion == 3
    ) {
      this.objFM.otro_grado_instruccion = "----";
      this.Disabled_Profesion = true;
    }
    else {
      this.objFM.otro_grado_instruccion = "";
      this.Disabled_Profesion = false;
    }
  }
  FechaInicioSeleccionada() {
    this.objFM.fecha_informe = this.objFM.fecha_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = this.objFM.fecha_inicio_evaluacion;
  }
  SetearReDocumento(digito: string) {
    this.objFM.re_numero_documento = this.objFM.re_numero_documento + "" + digito;
  }
  LimpiarReDocumento() {
    this.objFM.re_numero_documento = "";
  }
  getDatePeruToUSA(ddmmyyyy: string): string {
    let partes = ddmmyyyy.split("/");
    return partes[2] + "-" + partes[1] + "-" + partes[0];
  }
  Imprimir() {
    window.print();
  }

  CargarClase(id_tramite: number): Promise<any> {
    let promesa = new Promise((resolve) => {
      let param = { "id_tramite": id_tramite };
      this.servicio.listarClase(param).subscribe((data: any) => {
        
        this.objFM.id_clase=null;
        this.cboCategoria=[];
        this.objFM.id_categoria=null;

        this.cboClase = data.listaclase;
        resolve(true);
      });
    });
    return promesa;
  }
  CargarCategoria(): Promise<any> {
    let promesa = new Promise((resolve) => {

      if(Number(this.objFM.id_clase)==0){
        this.objFM.id_categoria=null;
        this.cboCategoria=[];
        resolve(true);
      }
      else{
      let param = { "id_tramite": Number(this.objFM.id_tramite), "id_clase": Number(this.objFM.id_clase) };
      this.servicio.listarCategoria(param).subscribe((data: any) => {
        this.objFM.id_categoria=null;
        this.cboCategoria=data.listacategoria;
        resolve(true);
      });        
      }

    });
    return promesa;
  }
  TramiteSeleccionado() {
    this.CargarClase(Number(this.objFM.id_tramite));
  }
  ProfesionSeleccionada(){
   if(this.objFM.id_profesion!=8){
    this.objFM.otro_profesion="";
   }
  }
  OcupacionSeleccionada(){
   if(this.objFM.id_ocupacion!=2){
    this.objFM.otro_ocupacion="";
   }
  }
  ValidarDNIHistorial(){
    let param={"id_tipo_documento":this.objFM.id_tipo_documento,"numero_documento":this.objFM.numero_documento};
    this.servicio.validarPostulanteDni(param).subscribe((data:any)=>{

      if(data.resultpostulante.length>0){

        this.SetearInfoPersona(data.resultpostulante[0]);
       //
      }
    });
  }
  ValidarNombre():Promise<any>{
    let param={"apellido_paterno":this.objFM.apellido_paterno,"apellido_materno":this.objFM.apellido_materno,"nombres":this.objFM.nombres};
    let promesa=new Promise((resolve)=>{
      this.servicio.validarPostulanteNombre(param).subscribe((data:any)=>{

          if(data.resultpostulantes.length==0){
            //no cuenta con homonimos
            alert("no hay homonimia");
          }
          else{
            //abrir Modal para elegir y cuando haga click, se completará la informacion como si de diera click en validar persona
            //luego guardar2()
            let config={
              ignoreBackdropClick: true,
              keyboard: false,
              class: 'modal-xl modal-anexo01',
              initialState: {
                lstHomonimos: data.resultpostulantes
              }
            }
            this.BsModalRef_hijo = this.modalService.show(HomonimosComponent,config);
            this.BsModalRef_hijo.content.retornoValores.subscribe(
              (data:any) => {
                if(typeof(data)=="boolean"){
                }
                else{
                  this.SetearInfoPersona(data).then(()=>{
                  });
                }
              }
            )
          }
        resolve(data);
      });
    });

    return promesa;
  }
  SetearInfoPersona(info:any):Promise<any>{
    let promesa=new Promise((resolve)=>{
    this.objFM.apellido_paterno=info.apellido_paterno;
    this.objFM.apellido_materno=info.apellido_materno;
    this.objFM.nombres=info.nombres;
    this.objFM.fecha_nacimiento=this.getFecha(info.fecha_nacimiento);
    this.objFM.telefono=info.telefono;
    this.objFM.direccion=info.direccion;
    this.objFM.id_sexo=info.id_sexo;


    this.objFM.id_pais = info.id_pais;
    this.objFM.iddpto_dir = info.iddpto_dir;
    this.objFM.idprov_dir = info.idprov_dir;


    this.objFM.iddpto = info.iddpto;
    this.objFM.idprov= info.idprov;


    if (this.objFM.iddpto != null) {
      let origen_nac: any = 1;
      this.objFM.origen_nac = origen_nac;
      let param = { "iddpto": this.objFM.iddpto };
      this.servicio.listarProvincia(param).subscribe((data: any) => {
        this.cboProvinciaNac = data;

        let param_ = { "iddpto": info.iddpto, "idprov": info.idprov };
        this.servicio.listarDistrito(param_).subscribe((data_: any) => {
          this.cboDistritoNac = data_;
            this.objFM.iddist= info.iddist;



            let param__ = { "iddpto": info.iddpto_dir };
            this.servicio.listarProvincia(param__).subscribe((data: any) => {
              this.cboPrinvinciaDir = data;
              let param___ = { "iddpto": info.iddpto_dir, "idprov": info.idprov_dir };
              this.servicio.listarDistrito(param___).subscribe((data_: any) => {
                this.cboDistritoDir = data_;
                this.objFM.iddist_dir = info.iddist_dir;

                setTimeout(() => {
                  //termina
                  resolve(true)
                }, 200);

              });
            });
            
            let inn:HTMLInputElement= document.getElementById("objFM.fecha_nacimiento")as HTMLInputElement;
            setTimeout(() => {
              this.getEdad(null,inn.value);
            }, 100);
        });
      });
    }
    if (this.objFM.id_pais != null) {
      let origen_nac: any = 2;
      this.objFM.origen_nac = origen_nac;
    }


  });
  return promesa;
  }
}
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-psicologico',
  templateUrl: './psicologico.component.html',
  styleUrls: ['./psicologico.component.scss']
})
export class PsicologicoComponent implements OnInit {
  PUEDE_REGISTRAR:boolean=false;
  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;
  cboApto = [];
  objFM = {
    "id_evaluacion_psicologica": 0,
    "id_ficha_medica_snc": 0,
    "fecha_inicio_evaluacion": null,
    "hora_inicio_evaluacion": null,
    "fecha_termino_evaluacion": null,
    "hora_termino_evaluacion": null,
    "id_resultado_test_palanca": 0,
    "id_resultado_reactimetro": 0,
    "id_resultado_test_punteo": 0,
    "wechsler": 0,
    "id_resultado_benton_formac": 0,
    "test_matrices_progresivas": 0,
    "test_dominios_anstey": 0,
    "id_resultado_test_otis": 0,
    "id_resultado_test_proyectivo": 0,
    "test_npf": 0,
    "id_resultado_inventario_personalidad": 0,
    "id_resultado_test_audit": 0,
    "cuestionario_inventario_cambios": 0,
    "id_resultado_test_personaarma": 0,
    "resultado_prueba": true,
    "observacion": "NINGUNA",
    "activo": true, //
    "usuario_creacion": sessionStorage.getItem("Usuario"),
    "usuario_modificacion": sessionStorage.getItem("Usuario")
  };

  objH = {
    "id_historia_clinica": 0,
    "id_ficha_medica_snc": 0,
    "fecha_inicio_evaluacion": null,
    "hora_inicio_evaluacion": null,
    "fecha_termino_evaluacion": null,
    "hora_termino_evaluacion": null,
    "historia_familiar": null,
    "antecedentes_psicopaticos_personales": null,
    "habitos": null,
    "incidentes_accidentes_transito": null,
    "consumo_farmacos_sustancias": null,
    "id_resultado_presentacion": 0,
    "id_resultado_postura": 0,
    "id_resultado_actitud": 0,

    "id_resultado_orientacion_tiempo": 0,
    "id_resultado_orientacion_espacio": 0,
    "id_resultado_orientacion_persona": 0,
    "proceso_cognitivo_atencion_concentracion": "",
    "proceso_cognitivo_percepcion": "",
    "id_resultado_memoria ": null,
    "id_resultado_memoria_corto": 0,
    "id_resultado_memoria_mediano": 0,
    "id_resultado_memoria_largo": 0,
    "id_resultado_lenguaje_ritmo": 0,
    "id_resultado_lenguaje_tono": 0,
    "id_resultado_lenguaje_articulacion": 0,
    "id_resultado_pensamiento_curso": 0,
    otro_pensamiento_curso: "",
    "id_resultado_pensamiento_contenido": 0,
    otro_pensamiento_contenido: "",
    "id_resultado_afecto": 0,
    otro_resultado_afecto: "",
    "id_resultado_senso_percepcion": 0,
    alterada_senso_percepcion: "",
    "id_resultado_apetito_conducta_alimentaria": 0,
    "id_resultado_ciclo_suenio_vigilia": 0,
    alterado_suenio_vigilia: "",
    "conclusiones_area_cognitiva": "",
    "conclusiones_area_emocional": "",
    "recomendacion": "APTO",
    "resultado_prueba": true,
    "activo": true,
    "usuario_creacion": sessionStorage.getItem("Usuario")
  };


  control: any = {
    resultactitud: [],
    resultafecto: [],
    resultapetitoconductaalimentaria: [],
    resultciclosueniovigilia: [],
    resultlenguajearticulacion: [],
    resultlenguajeritmo: [],
    resultlenguajetono: [],
    resultmemoria: [],
    resultorientacion: [],
    resultpensamientocontenido: [],
    resultpensamientocurso: [],
    resultpostura: [],
    resultpresentacion: [],
    resultsensopercepcion: []
  };
  fecha_evaluacion:string="";


  constructor(private crypto: CryptoService, private servicio: FichaMedicaService, private rutaActual: ActivatedRoute, private helper: Funciones) { }

  ngOnInit(): void {


    if (this.rutaActual.snapshot.paramMap.get('id') != null) {
      let ccc: string;
      ccc = this.rutaActual.snapshot.params.id;
      this.ID_FICHA_MEDICA_SNC = Number(this.crypto.desencriptar(ccc));
      this.objFM.id_ficha_medica_snc = this.ID_FICHA_MEDICA_SNC;
      this.objH.id_ficha_medica_snc = this.ID_FICHA_MEDICA_SNC;
      this.CargarConfiguracion(this.ID_FICHA_MEDICA_SNC).then(() => {


        this.CargarComboEvaluacionPsicologia();

        this.ComprobarExistente().then((rptaExiste: any) => {
          this.CargarComboEvaluacionPsicologia().then((rptaCombos: any) => {
            if (rptaCombos && rptaExiste.existe) {
              this.ValidarHoraLaboratorio();
              this.Setear(rptaExiste.data);
            }
            else{
              this.ValidarHoraLaboratorio();
              this.SetearPorCondicion();
            }
          });

        });

        this.ComprobarExisteHistorial().then((rptaExiste: any) => {
          // this.CargarComboHistorialPsicologia();
          this.CargarComboHistorialPsicologia().then((rptaCombos: any) => {
            this.SetearControlesPorCondicion();
            if (rptaCombos && rptaExiste.existe) {
              this.SetearHijo(rptaExiste.data);
            }
            else{
              this.SetearPorCondicionH();
            }
          });

        });
      });
    }

  }
  ComprobarExistente(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      this.servicio.listaEvalPsicologica(param).subscribe((data: any) => {

        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaaevaluacionpsicologica[0] });
        }
      }, () => {
        reject({ existe: false, data: null })
      });
    });
    return promise;
  }


  CargarComboEvaluacionPsicologia(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarEvaluacionPsicologicaControl().subscribe((data: any) => {
        this.cboApto = data.resultpsicologico;
        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;
  }
  CargarConfiguracion(id_ficha_medica_snc: number): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.objFM.id_ficha_medica_snc = id_ficha_medica_snc;
      let param = { "id_ficha_medica_snc": id_ficha_medica_snc };
      this.servicio.obtenerFichaMedica(param).subscribe((data: any) => {
        this.OBJ_FICHA_MEDICA = data.objfichamedica;
        this.OBJ_HORA=data.objhoraevaluacion;
        this.OBJ_FICHA_MEDICA.fecha_nac_string = this.getFechaString(this.OBJ_FICHA_MEDICA.fecha_nacimiento);
        this.OBJ_FICHA_MEDICA.sexo_string=(this.OBJ_FICHA_MEDICA.sexo=="M")?"MASCULINO":"FEMENINO";


        this.fecha_evaluacion= this.getFechaString(this.OBJ_FICHA_MEDICA.fecha_inicio_evaluacion);
        resolve(true);

      });
    });
    return promise;
  }



  ValidarFromulario00(): boolean {

    if (this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "") {
      this.Mensaje("info", "Complete la Hora de ingreso de la evaluación", () => {
        document.getElementById('objFM.hora_inicio_evaluacion')?.focus();
      });
      return false;
    }

    if (this.objFM.hora_termino_evaluacion == null || this.objFM.hora_termino_evaluacion == "") {
      this.Mensaje("info", "Complete la Hora de salida de la evaluación", () => {
        document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      });
      return false;
    }
    else{
      if(this.OBJ_FICHA_MEDICA.id_condicion==1){
        if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"01:08")==false){
          this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Psicología</b> debe ser <b>mínimo de 1 hora con 8 minutos</b>",()=>{
            //document.getElementById("objFM.hora_termino_evaluacion")!.focus();
          });
          return false;
        }        
      }
      if(this.OBJ_FICHA_MEDICA.id_condicion==2){
        if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"01:11")==false){
          this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Psicología</b> debe ser <b>mínimo de 1 hora con 11 minutos</b>",()=>{
            //document.getElementById("objFM.hora_termino_evaluacion")!.focus();
          });
          return false;
        }        
      }
    }

    if (!this.helper.ValidarHoraTermino(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion)) {
      this.Mensaje("error", "La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
        document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      });
      return false;
    }
    return true;
  }
  disabled_resultado_test_palanca: boolean = false;
  disabled_resultado_reactimetro: boolean = false;
  disabled_resultado_test_punteo: boolean = false;
  disabled_wechsler: boolean = true;
  disabled_test_matrices_progresivas: boolean = true;
  disabled_test_dominios_anstey: boolean = true;
  disabled_test_npf: boolean = true;
  disabled_cuestionario_inventario_cambios: boolean = true;

  SetearPorCondicion() {
    //SI LA CONDICION ES NO PROFESIONAL

    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.objFM.id_resultado_test_palanca = 3;
      this.objFM.id_resultado_reactimetro = 3;
      this.objFM.id_resultado_test_punteo = 3;
      this.objFM.wechsler = 3;
      this.objFM.id_resultado_benton_formac = 1;
      this.objFM.test_matrices_progresivas = 3;
      this.objFM.test_dominios_anstey = 3;
      this.objFM.id_resultado_test_otis = 1;
      this.objFM.id_resultado_test_proyectivo = 1;
      this.objFM.test_npf = 3;
      this.objFM.id_resultado_inventario_personalidad = 1;
      this.objFM.id_resultado_test_audit = 1;
      this.objFM.cuestionario_inventario_cambios = 3;
      this.objFM.id_resultado_test_personaarma = 1;
      this.objFM.resultado_prueba = true;
    }
    //SI LA CONDICION ES PROFESIONAL
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      this.objFM.id_resultado_test_palanca = 1;
      this.objFM.id_resultado_reactimetro = 1;
      this.objFM.id_resultado_test_punteo = 1;
      this.objFM.wechsler = 3;
      this.objFM.id_resultado_benton_formac = 1;
      this.objFM.test_matrices_progresivas = 3;
      this.objFM.test_dominios_anstey = 3;
      this.objFM.id_resultado_test_otis = 1;
      this.objFM.id_resultado_test_proyectivo = 1;
      this.objFM.test_npf = 3;
      this.objFM.id_resultado_inventario_personalidad = 1;
      this.objFM.id_resultado_test_audit = 1;
      this.objFM.cuestionario_inventario_cambios = 3;
      this.objFM.id_resultado_test_personaarma = 1;

      this.objFM.resultado_prueba = true;
    }
  }
  SetearControlesPorCondicion(){
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.disabled_resultado_test_palanca = true;
      this.disabled_resultado_reactimetro = true;
      this.disabled_resultado_test_punteo = true;
    }
  }


  SetearPorCondicionH(){
    this.objH.id_resultado_presentacion=1;
    this.objH.id_resultado_postura=1;
    this.objH.id_resultado_actitud=1;
    this.objH.id_resultado_orientacion_tiempo=1;
    this.objH.id_resultado_orientacion_espacio=1;
    this.objH.id_resultado_orientacion_persona=1;
    this.objH.proceso_cognitivo_atencion_concentracion="PROCESOS COGNITIVOS CONSERVADOS";
    this.objH.proceso_cognitivo_percepcion="SIN ALTERACIONES";
    this.objH.id_resultado_memoria_corto=1;
    this.objH.id_resultado_memoria_mediano=1;
    this.objH.id_resultado_memoria_largo=1;
    this.objH.id_resultado_lenguaje_ritmo=3;
    this.objH.id_resultado_lenguaje_tono=2;
    this.objH.id_resultado_lenguaje_articulacion=2;
    this.objH.id_resultado_pensamiento_curso=1;
    this.objH.id_resultado_pensamiento_contenido=1;
    this.objH.id_resultado_afecto=1;
    this.objH.id_resultado_senso_percepcion=1;
    this.objH.id_resultado_apetito_conducta_alimentaria=1;
    this.objH.id_resultado_ciclo_suenio_vigilia=1;
    this.objH.conclusiones_area_cognitiva="PROMEDIO APTO";
    this.objH.conclusiones_area_emocional="ESTABLE APTO";
    //id_resultado_apetito_conducta_alimentaria
  }
  ValidarNegocio00() {
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      if (
        this.objFM.id_resultado_test_palanca == 3 &&
        this.objFM.id_resultado_reactimetro == 3 &&
        this.objFM.id_resultado_test_punteo == 3 &&
        this.objFM.wechsler == 3 &&
        this.objFM.id_resultado_benton_formac == 1 &&
        this.objFM.test_matrices_progresivas == 3 &&
        this.objFM.test_dominios_anstey == 3 &&
        this.objFM.id_resultado_test_otis == 1 &&
        this.objFM.id_resultado_test_proyectivo == 1 &&
        this.objFM.test_npf == 3 &&
        this.objFM.id_resultado_inventario_personalidad == 1 &&
        this.objFM.id_resultado_test_audit == 1 &&
        this.objFM.cuestionario_inventario_cambios == 3 &&
        this.objFM.id_resultado_test_personaarma == 1
      ) {
        this.objFM.resultado_prueba = true;
      }
      else {
        this.objFM.resultado_prueba = false;
      }
    }
    //SI LA CONDICION ES PROFESIONAL
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      if (
        this.objFM.id_resultado_test_palanca == 1 &&
        this.objFM.id_resultado_reactimetro == 1 &&
        this.objFM.id_resultado_test_punteo == 1 &&
        this.objFM.wechsler == 3 &&
        this.objFM.id_resultado_benton_formac == 1 &&
        this.objFM.test_matrices_progresivas == 3 &&
        this.objFM.test_dominios_anstey == 3 &&
        this.objFM.id_resultado_test_otis == 1 &&
        this.objFM.id_resultado_test_proyectivo == 1 &&
        this.objFM.test_npf == 3 &&
        this.objFM.id_resultado_inventario_personalidad == 1 &&
        this.objFM.id_resultado_test_audit == 1 &&
        this.objFM.cuestionario_inventario_cambios == 3 &&
        this.objFM.id_resultado_test_personaarma == 1
      ) {
        this.objFM.resultado_prueba = true;
      }
      else {
        this.objFM.resultado_prueba = false;
      }
    }
  }

  GuardarEvaluacionPsicologica() {
    if (this.ValidarFromulario00()) {

      if (this.objFM.id_evaluacion_psicologica == 0 || this.objFM.id_evaluacion_psicologica == null) {
        this.servicio.insertarEvaluacionPsicologica(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Psicológica fue guardada", () => {
            location.reload();
          });
        });
      }
      else {
        this.servicio.modificarEvalPsico(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Psicológica fue guardada", () => {
            location.reload();
          });
        });
      }

    }
  }
  Mensaje(tipo: any, mensaje: any, condicion: any) {
    Swal.fire({
      title: 'Mensaje del sistema',
      text: mensaje,
      icon: tipo,
      confirmButtonText: 'Ok',
      returnFocus: false
    }).then(condicion);;
  }

  ComprobarExisteHistorial(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      this.servicio.listaHistoriaClinica(param).subscribe((data: any) => {

        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listahistoriaclinica[0] });
        }
      }, () => {
        reject({ existe: false, data: null })
      });
    });
    return promise;
  }
  CargarComboHistorialPsicologia(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarHistoriaClinicaControl().subscribe((data: any) => {
        this.control = data;
        //this.cboApto=data.resultpsicologico;
        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;
  }

  PensamientoCursoChange(e: any) {
    if (this.objH.id_resultado_pensamiento_curso != 3) {
      this.objH.otro_pensamiento_curso = "";
    }
    this.ValidarEstandar();
  }
  PensamientoCursoOtroChange(e: any) {
    this.objH.id_resultado_pensamiento_curso = 3;
    this.ValidarEstandar();
  }

  PensamientoContenidoChange(e: any) {
    if (this.objH.id_resultado_pensamiento_contenido != 2) {
      this.objH.otro_pensamiento_contenido = "";
    }
    this.ValidarEstandar();
  }
  PensamientoContenidoOtroChange(e: any) {
    this.objH.id_resultado_pensamiento_contenido = 2;
    this.ValidarEstandar();
  }
  AfectoChange(e: any) {
    if (this.objH.id_resultado_afecto != 2) {
      this.objH.otro_resultado_afecto = "";
    }
    this.ValidarEstandar();
  }
  AfectoOtroChange(e: any) {
    this.objH.id_resultado_afecto = 2;
    this.ValidarEstandar();
  }
  SensoChange(e: any) {
    if (this.objH.id_resultado_senso_percepcion != 2) {
      this.objH.alterada_senso_percepcion = "";
    }
    this.ValidarEstandar();
  }
  SensoOtroChange(e: any) {
    this.objH.id_resultado_senso_percepcion = 2;
    this.ValidarEstandar();
  }

  CicloChange(e: any) {
    if (this.objH.id_resultado_ciclo_suenio_vigilia != 2) {
      this.objH.alterado_suenio_vigilia = "";
    }
    this.ValidarEstandar();
  }
  CicloOtroChange(e: any) {
    this.objH.id_resultado_ciclo_suenio_vigilia = 2;
    this.ValidarEstandar();
  }

  ValidarFromularioHP(): boolean {
    return true;
  }
  GuardarHistorialPsicologico() {
    this.objH.resultado_prueba=(this.objH.recomendacion=="APTO")?true:false;



    if (this.ValidarFromularioHP()) {

      if((this.CumpleEstandar()==false) && (this.objH.resultado_prueba==true)){
        this.helper.Mensaje("question","Aviso","El postulante <b>No cumple</b> con los característica estándar.<br>¿Desea continuar y registrar como <b>APTO</b> al postulante?",(rpta:any)=>{
          if(rpta.value){
            if (this.objH.id_historia_clinica == 0 || this.objH.id_historia_clinica == null) {
              this.servicio.insertarHistoriaClinica(this.objH).subscribe((data: any) => {
                this.objFM.resultado_prueba= this.objH.resultado_prueba;
                this.GuardarEvaluacionPsicologica();
              });
            }
            else {
              this.servicio.modificarHistoriaClinica(this.objH).subscribe((data: any) => {
                this.objFM.resultado_prueba= this.objH.resultado_prueba;
                this.GuardarEvaluacionPsicologica();
              });
            }
          }
        });
      }
      if((this.CumpleEstandar()==true) && (this.objH.resultado_prueba==false)){
        this.helper.Mensaje("question","Aviso","El postulante <b>Si cumple</b> con los característica estándar.<br>¿Desea continuar y registrar como <b>NO APTO</b> al postulante?",(rpta:any)=>{
          if(rpta.value){
            if (this.objH.id_historia_clinica == 0 || this.objH.id_historia_clinica == null) {
              this.servicio.insertarHistoriaClinica(this.objH).subscribe((data: any) => {
                this.objFM.resultado_prueba= this.objH.resultado_prueba;
                this.GuardarEvaluacionPsicologica();
              });
            }
            else {
              this.servicio.modificarHistoriaClinica(this.objH).subscribe((data: any) => {
                this.objFM.resultado_prueba= this.objH.resultado_prueba;
                this.GuardarEvaluacionPsicologica();
              });
            }
          }
        });
      }

      if((this.CumpleEstandar()==true) && (this.objH.resultado_prueba==true)){
        if (this.objH.id_historia_clinica == 0 || this.objH.id_historia_clinica == null) {
          this.servicio.insertarHistoriaClinica(this.objH).subscribe((data: any) => {
            this.objFM.resultado_prueba= this.objH.resultado_prueba;
            this.GuardarEvaluacionPsicologica();
          });
        }
        else {
          this.servicio.modificarHistoriaClinica(this.objH).subscribe((data: any) => {
            this.objFM.resultado_prueba= this.objH.resultado_prueba;
            this.GuardarEvaluacionPsicologica();
          });
        }
      }
    }
  }
  Setear(data: any) {
    this.objFM.id_evaluacion_psicologica = data.id_evaluacion_psicologica;
    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objFM.id_resultado_test_palanca = data.id_resultado_test_palanca;
    this.objFM.id_resultado_reactimetro = data.id_resultado_reactimetro
    this.objFM.id_resultado_test_punteo = data.id_resultado_test_punteo;
    this.objFM.wechsler = data.wechsler;
    this.objFM.id_resultado_benton_formac = data.id_resultado_benton_formac;
    this.objFM.test_matrices_progresivas = data.test_matrices_progresivas;
    this.objFM.test_dominios_anstey = data.test_dominios_anstey;
    this.objFM.id_resultado_test_otis = data.id_resultado_test_otis;
    this.objFM.id_resultado_test_proyectivo = data.id_resultado_test_proyectivo;
    this.objFM.test_npf = data.test_npf;
    this.objFM.id_resultado_inventario_personalidad = data.id_resultado_inventario_personalidad;
    this.objFM.id_resultado_test_audit = data.id_resultado_test_audit;
    this.objFM.cuestionario_inventario_cambios = data.cuestionario_inventario_cambios;
    this.objFM.id_resultado_test_personaarma = data.id_resultado_test_personaarma;
    this.objFM.resultado_prueba = data.resultado_prueba;
    this.objFM.observacion = data.observacion;
    this.ValidarHoraIngreso();
  }
  getFecha(fechastring: any): any {
    let fecha = new Date(fechastring);
    return fecha.getFullYear() + "-" + (this.zfill(fecha.getMonth() + 1, 2)) + "-" + this.zfill(fecha.getDate(), 2);
  }
  getFechaString(fechastring: any): any {
    let fecha = new Date(fechastring);
    return this.zfill(fecha.getDate(), 2) + "/" + (this.zfill(fecha.getMonth() + 1, 2)) + "/" + fecha.getFullYear();
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
  SetearHijo(data: any) {
    this.objH.id_historia_clinica = data.id_historia_clinica;
    this.objH.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objH.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objH.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objH.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objH.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objH.historia_familiar = data.historia_familiar;
    this.objH.antecedentes_psicopaticos_personales = data.antecedentes_psicopaticos_personales;
    this.objH.habitos = data.habitos;
    this.objH.incidentes_accidentes_transito = data.incidentes_accidentes_transito;
    this.objH.consumo_farmacos_sustancias = data.consumo_farmacos_sustancias;
    this.objH.id_resultado_presentacion = data.id_resultado_presentacion;
    this.objH.id_resultado_postura = data.id_resultado_postura;
    this.objH.id_resultado_actitud = data.id_resultado_actitud;
    this.objH.id_resultado_orientacion_tiempo = data.id_resultado_orientacion_tiempo;
    this.objH.id_resultado_orientacion_espacio = data.id_resultado_orientacion_espacio;
    this.objH.id_resultado_orientacion_persona = data.id_resultado_orientacion_persona;
    this.objH.proceso_cognitivo_atencion_concentracion = data.proceso_cognitivo_atencion_concentracion;
    this.objH.proceso_cognitivo_percepcion = data.proceso_cognitivo_percepcion;
    // this.objH.id_resultado_memoria ":null,
    this.objH.id_resultado_memoria_corto = data.id_resultado_memoria_corto;
    this.objH.id_resultado_memoria_mediano = data.id_resultado_memoria_mediano;
    this.objH.id_resultado_memoria_largo = data.id_resultado_memoria_largo;
    this.objH.id_resultado_lenguaje_ritmo = data.id_resultado_lenguaje_ritmo;
    this.objH.id_resultado_lenguaje_tono = data.id_resultado_lenguaje_tono;
    this.objH.id_resultado_lenguaje_articulacion = data.id_resultado_lenguaje_articulacion;
    this.objH.id_resultado_pensamiento_curso = data.id_resultado_pensamiento_curso;
    this.objH.otro_pensamiento_curso = data.otro_pensamiento_curso;
    this.objH.id_resultado_pensamiento_contenido = data.id_resultado_pensamiento_contenido;
    this.objH.otro_pensamiento_contenido = data.otro_pensamiento_contenido;
    this.objH.id_resultado_afecto = data.id_resultado_afecto;
    this.objH.otro_resultado_afecto = data.otro_resultado_afecto;
    this.objH.id_resultado_senso_percepcion = data.id_resultado_senso_percepcion;
    this.objH.alterada_senso_percepcion = data.alterada_senso_percepcion;
    this.objH.id_resultado_apetito_conducta_alimentaria = data.id_resultado_apetito_conducta_alimentaria; //verificar texto
    this.objH.id_resultado_ciclo_suenio_vigilia = data.id_resultado_ciclo_suenio_vigilia;
    this.objH.alterado_suenio_vigilia = data.alterado_suenio_vigilia;
    this.objH.conclusiones_area_cognitiva = data.conclusiones_area_cognitiva;
    this.objH.conclusiones_area_emocional = data.conclusiones_area_emocional;
    this.objH.recomendacion = data.recomendacion;
    this.objH.resultado_prueba = data.resultado_prueba;



    // : null
    // id_resultado_motivo_evaluacion: null
    // : 1

  }
  Imprimir01() {
    window.print();
  }
  ValidarHoraIngreso(){

      if(!this.helper.ValidarHoraIngreso(
        this.OBJ_HORA.hora_termino_evaluacion_an_lab,
        this.objFM.hora_inicio_evaluacion
      )){
        this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+(this.OBJ_HORA.hora_termino_evaluacion_an_lab)+"</b>",()=>{
          document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
        });
      }

  }
  ValidarHoraLaboratorio(){

    if(this.OBJ_HORA.hora_termino_evaluacion_an_lab!=null){
      this.PUEDE_REGISTRAR=true;
    }
    else{
      this.helper.Mensaje("error","Aviso","Aún no se concluye la Evaluación en Analisis de Laboratorio",()=>{
      });
      this.PUEDE_REGISTRAR=false;
    }
  }
  
  ValidarEstandar(){
    // if(
    //   (this.objH.id_resultado_presentacion==1) &&
    //   (this.objH.id_resultado_postura==1) &&
    //   (this.objH.id_resultado_actitud==1) &&
    //   (this.objH.id_resultado_orientacion_tiempo==1) &&
    //   (this.objH.id_resultado_orientacion_espacio==1) &&
    //   (this.objH.id_resultado_orientacion_persona==1) &&
    //   // (this.objH.proceso_cognitivo_atencion_concentracion=="PROCESOS COGNITIVOS CONSERVADOS")&&
    //   // (this.objH.proceso_cognitivo_percepcion=="SIN ALTERACIONES")&&
    //   (this.objH.id_resultado_memoria_corto==1) &&
    //   (this.objH.id_resultado_memoria_mediano==1) &&
    //   (this.objH.id_resultado_memoria_largo==1) &&
    //   (this.objH.id_resultado_lenguaje_ritmo==3) &&
    //   (this.objH.id_resultado_lenguaje_tono==2) &&
    //   (this.objH.id_resultado_lenguaje_articulacion==2) &&
    //   (this.objH.id_resultado_pensamiento_curso==1) &&
    //   (this.objH.id_resultado_pensamiento_contenido==1) &&
    //   (this.objH.id_resultado_afecto==1) &&
    //   (this.objH.id_resultado_senso_percepcion==1) &&
    //   (this.objH.id_resultado_apetito_conducta_alimentaria==1) &&
    //   (this.objH.id_resultado_ciclo_suenio_vigilia==1) //&&
    //   // (this.objH.conclusiones_area_cognitiva=="PROMEDIO APTO") &&
    //   // (this.objH.conclusiones_area_emocional=="ESTABLE APTO") 
    //   //(this.objH.resultado_prueba==true)
    // ){
    //   //quitar mensaje
    //   document.getElementById("objH.id_resultado_presentacion")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_postura")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_actitud")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_orientacion_tiempo")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_orientacion_espacio")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_orientacion_persona")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_memoria_corto")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_memoria_mediano")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_memoria_largo")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_lenguaje_ritmo")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_lenguaje_tono")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_lenguaje_articulacion")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_pensamiento_curso")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_pensamiento_contenido")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_afecto")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_senso_percepcion")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_apetito_conducta_alimentaria")!.classList.add("d-none");
    //   document.getElementById("objH.id_resultado_ciclo_suenio_vigilia")!.classList.add("d-none");
    // }
    // else{
    //   //agregar o quitar mwensajes
    //   if(
    //     (this.objH.id_resultado_presentacion==1)
    //   ){
    //     document.getElementById("objH.id_resultado_presentacion")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_presentacion")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_postura==1)
    //   ){
    //     document.getElementById("objH.id_resultado_postura")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_postura")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_actitud==1)
    //   ){
    //     document.getElementById("objH.id_resultado_actitud")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_actitud")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_orientacion_tiempo==1)
    //   ){
    //     document.getElementById("objH.id_resultado_orientacion_tiempo")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_orientacion_tiempo")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_orientacion_espacio==1)
    //   ){
    //     document.getElementById("objH.id_resultado_orientacion_espacio")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_orientacion_espacio")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_orientacion_persona==1)
    //   ){
    //     document.getElementById("objH.id_resultado_orientacion_persona")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_orientacion_persona")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_memoria_corto==1)
    //   ){
    //     document.getElementById("objH.id_resultado_memoria_corto")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_memoria_corto")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_memoria_mediano==1)
    //   ){
    //     document.getElementById("objH.id_resultado_memoria_mediano")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_memoria_mediano")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_memoria_largo==1)
    //   ){
    //     document.getElementById("objH.id_resultado_memoria_largo")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_memoria_largo")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_lenguaje_ritmo==3)
    //   ){
    //     document.getElementById("objH.id_resultado_lenguaje_ritmo")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_lenguaje_ritmo")!.classList.remove("d-none");
    //   }
    //   if(
    //     (this.objH.id_resultado_lenguaje_tono==2)
    //   ){
    //     document.getElementById("objH.id_resultado_lenguaje_tono")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_lenguaje_tono")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_lenguaje_articulacion==2)
    //   ){
    //     document.getElementById("objH.id_resultado_lenguaje_articulacion")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_lenguaje_articulacion")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_pensamiento_curso==1)
    //   ){
    //     document.getElementById("objH.id_resultado_pensamiento_curso")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_pensamiento_curso")!.classList.remove("d-none");
    //   }
  
    //   if(
    //     (this.objH.id_resultado_pensamiento_contenido==1)
    //   ){
    //     document.getElementById("objH.id_resultado_pensamiento_contenido")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_pensamiento_contenido")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_afecto==1)
    //   ){
    //     document.getElementById("objH.id_resultado_afecto")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_afecto")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_senso_percepcion==1)
    //   ){
    //     document.getElementById("objH.id_resultado_senso_percepcion")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_senso_percepcion")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_apetito_conducta_alimentaria==1)
    //   ){
    //     document.getElementById("objH.id_resultado_apetito_conducta_alimentaria")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_apetito_conducta_alimentaria")!.classList.remove("d-none");
    //   }

    //   if(
    //     (this.objH.id_resultado_ciclo_suenio_vigilia==1)
    //   ){
    //     document.getElementById("objH.id_resultado_ciclo_suenio_vigilia")!.classList.add("d-none");
    //   } else {
    //     document.getElementById("objH.id_resultado_ciclo_suenio_vigilia")!.classList.remove("d-none");
    //   }
    // }

  }

  CumpleEstandar(){
    if(
      (this.objH.id_resultado_presentacion==1) &&
      (this.objH.id_resultado_postura==1) &&
      (this.objH.id_resultado_actitud==1) &&
      (this.objH.id_resultado_orientacion_tiempo==1) &&
      (this.objH.id_resultado_orientacion_espacio==1) &&
      (this.objH.id_resultado_orientacion_persona==1) &&
      // (this.objH.proceso_cognitivo_atencion_concentracion=="PROCESOS COGNITIVOS CONSERVADOS")&&
      // (this.objH.proceso_cognitivo_percepcion=="SIN ALTERACIONES")&&
      (this.objH.id_resultado_memoria_corto==1) &&
      (this.objH.id_resultado_memoria_mediano==1) &&
      (this.objH.id_resultado_memoria_largo==1) &&
      (this.objH.id_resultado_lenguaje_ritmo==3) &&
      (this.objH.id_resultado_lenguaje_tono==2) &&
      (this.objH.id_resultado_lenguaje_articulacion==2) &&
      (this.objH.id_resultado_pensamiento_curso==1) &&
      (this.objH.id_resultado_pensamiento_contenido==1) &&
      (this.objH.id_resultado_afecto==1) &&
      (this.objH.id_resultado_senso_percepcion==1) &&
      (this.objH.id_resultado_apetito_conducta_alimentaria==1) &&
      (this.objH.id_resultado_ciclo_suenio_vigilia==1) //&&
      // (this.objH.conclusiones_area_cognitiva=="PROMEDIO APTO") &&
      // (this.objH.conclusiones_area_emocional=="ESTABLE APTO") 
      //(this.objH.resultado_prueba==true)
    ){
      //quitar mensaje
      return true;
    }
    else{
      return false;
    }

  }
}

// this.OBJ_HORA.hora_termino_evaluacion_an_lab,
// this.objFM.hora_inicio_evaluacion
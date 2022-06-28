import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';

@Component({
  selector: 'app-clinico',
  templateUrl: './clinico.component.html',
  styleUrls: ['./clinico.component.scss']
})
export class ClinicoComponent implements OnInit {

  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;

  objFM = {
    id_evaluacion_clinica: 0,
    id_ficha_medica_snc: 0,
    fecha_inicio_evaluacion: null,
    hora_inicio_evaluacion: null,
    fecha_termino_evaluacion: null,
    hora_termino_evaluacion: null,
    anaminesis: "",
    antecedentes: [],
    activo: true,
    usuario_creacion: sessionStorage.getItem("Usuario"),
    usuario_modificacion: sessionStorage.getItem("Usuario")
  };
  lstAntecedentes: any = [];

  //VARIABLES PARA ANALISIS CLINOCO II Y III

  cboFRespiratorio: any = [];
  cboPulsoximetro: any = [];
  cboCVentolatoria: any = [];

  cboFMuscular: any = [];
  cboLocomotor: any = [];

  cboPIndice: any = [];
  cboRomberg: any = [];
  cboMovReflejos: any = [];
  cboTMuscular: any = [];
  cboNociones: any = [];

  cboOrofaringe: any = [];
  cboPerimetro: any = [];
  cboEscala: any = [];
  cboObservaciones: any = [];
  objAntro = {
    id_antropometria: 0,
    id_ficha_medica_snc: 0,
    fecha_inicio_evaluacion: "",
    hora_inicio_evaluacion: null,
    fecha_termino_evaluacion: "",
    hora_termino_evaluacion: null,
    antropometria_peso: 50,
    antropometria_talla: 160,
    antropometria_imc: 19.5,
    presion_arterial_diastolica: 70,
    presion_arterial_sistolica: 120,
    id_frecuencia_respiratoria_reposo: 4,
    frecuencia_pulso_reposo: 80,
    id_pulsoximetria: 5,
    id_resultado_capacidad_ventilatoria: 0,
    id_resultado_fuerza_muscular: 0,
    id_resultado_ausencia: 0,
    id_resultado_rango: 0,
    id_resultado_les_vertebra: 0,
    id_resultado_les_extremidades: 0,
    id_resultado_prueba_indice: 0,
    id_resultado_romber_prueba_na: 0,
    id_resultado_romberg: 0,
    id_resultado_movimientos_reflejos: 0,
    id_resultado_tono_muscular: 0,
    id_resultado_nociones_temporoespaciales: 0,
    id_resultado_ref_osteo: 2,
    indice_masa_corporal: "",
    presion_arterial_sistolica_diastolica: "",
    id_resultado_orofaringe_clasificacion: 0,
    id_resultado_perimetro_cuello: 0,
    id_resultado_escala_somnolencia: 0,
    ronquido_intenso: "",
    resultado_mon: "APTO",
    resultado_evaluacion_clinica: true,
    id_observacion_clinica: 0,
    observacion: "",
    activo: true,
    usuario_creacion: sessionStorage.getItem("Usuario"),
    usuario_modificacion: sessionStorage.getItem("Usuario")
  };

  constructor(private crypto: CryptoService, private rutaActual: ActivatedRoute, private servicio: FichaMedicaService, private helper: Funciones) { }

  ngOnInit(): void {
    if (this.rutaActual.snapshot.paramMap.get('id') != null) {
      let ccc: string;
      ccc = this.rutaActual.snapshot.params.id;
      this.ID_FICHA_MEDICA_SNC = Number(this.crypto.desencriptar(ccc));
      this.CargarConfiguracion(this.ID_FICHA_MEDICA_SNC).then(() => {
        this.ComprobarExistenteEvaluacionClinicaI().then((rptaExiste: any) => {
          //cargamos los combos  si no existe info de antecedentes
          if (rptaExiste.existe) {
            this.SetearEvaliacionClinicaI(rptaExiste.data);
          }
          else {
            this.CargarControlesEvaluacionClinicaI().then((rptaCombos: any) => {

            });
          }
        });
        this.ComprobarExistenteEvaluacionClinicaIIyIII().then((rptaExiste: any) => {
          this.CargarControlesEvaluacionClinicaIIyIII().then((rptaCombos: any) => {
            this.SetearControlesPorCondicion();
            if (rptaExiste.existe) {
              this.SetearEvaliacionClinicaIIyIII(rptaExiste.data);
            }
            else {
              this.SetearDefecto();
            }
          });


          // else{
          //   this.CargarControlesEvaluacionClinicaI().then((rptaCombos:any)=>{

          //   });
          // }
        });
      });
    }
  }
  CargarConfiguracion(id_ficha_medica_snc: number): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.objFM.id_ficha_medica_snc = id_ficha_medica_snc;
      this.objAntro.id_ficha_medica_snc = id_ficha_medica_snc;
      let param = { "id_ficha_medica_snc": id_ficha_medica_snc };
      //obtener informacion del registro postulante
      this.servicio.obtenerFichaMedica(param).subscribe((data: any) => {
        this.OBJ_FICHA_MEDICA = data.objfichamedica;
        this.OBJ_HORA = data.objhoraevaluacion;

        //admamos texto para anaminesis
        let sexo = (this.OBJ_FICHA_MEDICA.id_sexo == 1) ? "HOMBRE DE " : "MUJER DE ";
        let anios = this.OBJ_FICHA_MEDICA.edad + " AÑOS DE EDAD, ACUDE A EXAMEN MEDICO PARA LICENCIA DE CONDUCIR\n ASINTOMATICO"

        this.objFM.anaminesis = sexo + anios;
        //this.ValidacionCondicion();
        resolve(true);
      });
    });
    return promise;
  }
  ComprobarExistenteEvaluacionClinicaI(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      //para traer el ultimo registro asociado a la postulacion
      this.servicio.listarEvaluacionClinica(param).subscribe((data: any) => {
        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaevaluacionclinica[0] });
        }
      }, () => {
        reject({ existe: false, data: null });
      });
    });
    return promise;
  }
  CargarControlesEvaluacionClinicaI(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarEvaluacionClinicaControl().subscribe((data: any) => {
        this.lstAntecedentes = data.resultantecpersonal;
        this.lstAntecedentes.forEach((ele: any) => {
          ele.observacion = null;
          ele.respuesta = false;
          ele.id_evalcli_anteper = 0;
        });

        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;
  }
  GuardarEvaliacionclinicaI(con_mensaje: boolean = true) {
    if (this.ValidarFormularioI()) {
      let lstAntecedentesInsert: any = [];

      this.lstAntecedentes.forEach((ele: any) => {
        let objAntecedenteInsertar: any = null;
        objAntecedenteInsertar = ele;
        objAntecedenteInsertar.activo = true;
        objAntecedenteInsertar.usuario_creacion = sessionStorage.getItem("Usuario");
        objAntecedenteInsertar.usuario_modificacion = sessionStorage.getItem("Usuario");

        lstAntecedentesInsert.push(ele);
      });
      this.objFM.antecedentes = lstAntecedentesInsert;

      if (this.objFM.id_evaluacion_clinica == 0 || this.objFM.id_evaluacion_clinica == null) {
        this.servicio.insertarEvaluacionClinica(this.objFM).subscribe((data: any) => {
          this.GuardarEvaliacionclinicaIIyIII(con_mensaje);
          // this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Clínica fue guardada", () => {
          //   location.reload();
          // });
        });
      }
      else {
        this.servicio.modificarEvalClinica(this.objFM).subscribe((data: any) => {
          // this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Clínica fue guardada", () => {
          //   location.reload();
          // });
          this.GuardarEvaliacionclinicaIIyIII(con_mensaje);

        });
      }
    }
  }
  SetearEvaliacionClinicaI(data: any) {
    this.objFM.id_evaluacion_clinica = data.id_evaluacion_clinica;
    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    //this.objFM.anaminesis = data.anaminesis;
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objFM.antecedentes = data.antecedentes;
    this.lstAntecedentes = data.antecedentes;
    this.lstAntecedentes.forEach((ele: any) => {
      ele.id_evaluacion_clinica = (ele.id_evaluacion_clinica == null) ? 0 : ele.id_evaluacion_clinica;
      ele.id_evalcli_anteper = (ele.id_evalcli_anteper == null) ? 0 : ele.id_evalcli_anteper;
    });
    this.PUEDE_REGISTRAR = true;
    this.objAntro.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objAntro.hora_termino_evaluacion = data.hora_termino_evaluacion;
  }

  //EVALUACION LCINICA II y III
  ComprobarExistenteEvaluacionClinicaIIyIII(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      //para traer el ultimo registro asociado a la postulacion
      this.servicio.listaAntropometria(param).subscribe((data: any) => {
        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaantropometria[0] });
        }
      }, () => {
        reject({ existe: false, data: null });
      });
    });
    return promise;
  }
  CargarControlesEvaluacionClinicaIIyIII(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarAntropometriaControl().subscribe((data: any) => {


        this.cboFRespiratorio = data.resultfrecrespirareposo;
        this.cboPulsoximetro = data.pulsoximetria;
        this.cboCVentolatoria = data.resultcapacidadventilatoria;

        this.cboFMuscular = data.resultfuerzamuscular;
        this.cboLocomotor = data.resultaparatolocomotor;

        this.cboPIndice = data.resultpruebaindice;
        this.cboRomberg = data.resultromberg;
        this.cboMovReflejos = data.resultmovimientosreflejos;
        this.cboTMuscular = data.resulttonomuscular;
        this.cboNociones = data.resultnocionestemporespaciales;

        this.cboOrofaringe = data.resultorofaringeclasificacion;
        this.cboPerimetro = data.resultperimetrocuello;
        this.cboEscala = data.resultescalasomnolencia;
        this.cboObservaciones = data.resultobservacion;


        // this.lstAntecedentes=data.resultantecpersonal;
        // this.lstAntecedentes.forEach((ele:any) => {
        //   ele.observacion=null;
        //   ele.respuesta=null;
        //   ele.id_evalcli_anteper=0;
        // });

        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;
  }
  GuardarEvaliacionclinicaIIyIII(con_mensaje: boolean = true) {
    if (this.ValidarFormularioIIyIII()) {
      if (this.objAntro.id_antropometria == 0 || this.objAntro.id_antropometria == null) {
        //this.objFM.eva
        this.servicio.insertarAntropometria(this.objAntro).subscribe((data: any) => {
          if (con_mensaje) {
            this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Clínica fue guardada", () => {
              location.reload();
            });
          }
          else {
            location.reload();
          }
        });
      }
      else {
        this.servicio.modificarAntropometria(this.objAntro).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Clínica fue guardada", () => {
            location.reload();
          });
        });
      }
    }
  }
  SetearEvaliacionClinicaIIyIII(data: any) {
    this.objAntro.id_antropometria = data.id_antropometria;
    this.objAntro.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objAntro.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objAntro.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objAntro.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objAntro.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objAntro.antropometria_peso = data.antropometria_peso;
    this.objAntro.antropometria_talla = data.antropometria_talla;
    this.objAntro.antropometria_imc = data.antropometria_imc,
      this.objAntro.presion_arterial_diastolica = data.presion_arterial_diastolica;
    this.objAntro.presion_arterial_sistolica = data.presion_arterial_sistolica;
    this.objAntro.id_frecuencia_respiratoria_reposo = data.id_frecuencia_respiratoria_reposo;
    this.objAntro.frecuencia_pulso_reposo = data.frecuencia_pulso_reposo;
    this.objAntro.id_pulsoximetria = data.id_pulsoximetria;
    this.objAntro.id_resultado_capacidad_ventilatoria = data.id_resultado_capacidad_ventilatoria;
    this.objAntro.id_resultado_fuerza_muscular = data.id_resultado_fuerza_muscular;
    this.objAntro.id_resultado_ausencia = data.id_resultado_ausencia;
    this.objAntro.id_resultado_rango = data.id_resultado_rango;
    this.objAntro.id_resultado_les_vertebra = data.id_resultado_les_vertebra;
    this.objAntro.id_resultado_les_extremidades = data.id_resultado_les_extremidades;
    this.objAntro.id_resultado_prueba_indice = data.id_resultado_prueba_indice;
    this.objAntro.id_resultado_romber_prueba_na = data.id_resultado_romber_prueba_na;
    this.objAntro.id_resultado_romberg = data.id_resultado_romberg;
    this.objAntro.id_resultado_movimientos_reflejos = data.id_resultado_movimientos_reflejos;
    this.objAntro.id_resultado_tono_muscular = data.id_resultado_tono_muscular;
    this.objAntro.id_resultado_nociones_temporoespaciales = data.id_resultado_nociones_temporoespaciales;
    this.objAntro.id_resultado_ref_osteo = data.id_resultado_ref_osteo;
    this.objAntro.indice_masa_corporal = data.indice_masa_corporal;
    this.objAntro.presion_arterial_sistolica_diastolica = data.presion_arterial_sistolica_diastolica;
    this.objAntro.id_resultado_orofaringe_clasificacion = data.id_resultado_orofaringe_clasificacion;
    this.objAntro.id_resultado_perimetro_cuello = data.id_resultado_perimetro_cuello;
    this.objAntro.id_resultado_escala_somnolencia = data.id_resultado_escala_somnolencia,
      this.objAntro.ronquido_intenso = data.ronquido_intenso;
    this.objAntro.resultado_mon = data.resultado_mon;
    this.objAntro.resultado_evaluacion_clinica = data.resultado_evaluacion_clinica;
    this.objAntro.id_observacion_clinica = data.id_observacion_clinica;
    this.ValidarNegocio();
  }
  CalcularIMC() {
    //=E8/(M8/100*M8/100)
    this.objAntro.antropometria_imc = Number((this.objAntro.antropometria_peso / ((this.objAntro.antropometria_talla / 100) * (this.objAntro.antropometria_talla / 100))).toFixed(1));
    this.ValidarNegocio();
  }
  ValidarNegocio() {
    if (
      (this.ValidarAptoAntecedentes()) &&
      (this.objAntro.antropometria_talla >= 150) &&
      (this.objAntro.antropometria_imc > 18 && this.objAntro.antropometria_imc < 30) &&
      (this.objAntro.frecuencia_pulso_reposo > 59 && this.objAntro.frecuencia_pulso_reposo < 101) &&
      (this.objAntro.presion_arterial_diastolica > 55 && this.objAntro.presion_arterial_diastolica < 101) &&
      (this.objAntro.presion_arterial_sistolica > 105 && this.objAntro.presion_arterial_sistolica < 161) &&

      (this.objAntro.id_frecuencia_respiratoria_reposo == 2 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 3 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 4 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 5
      ) &&
      (
        this.objAntro.id_pulsoximetria == 2 ||
        this.objAntro.id_pulsoximetria == 3 ||
        this.objAntro.id_pulsoximetria == 4 ||
        this.objAntro.id_pulsoximetria == 5 ||
        this.objAntro.id_pulsoximetria == 6 ||
        this.objAntro.id_pulsoximetria == 7
      ) &&
      (this.objAntro.id_resultado_capacidad_ventilatoria == 1) &&
      (this.objAntro.id_resultado_fuerza_muscular == 1) &&
      (this.objAntro.id_resultado_ausencia == 1) &&
      (this.objAntro.id_resultado_rango == 1) &&
      (this.objAntro.id_resultado_les_vertebra == 1) &&
      (this.objAntro.id_resultado_les_extremidades == 1) &&

      (this.objAntro.id_resultado_prueba_indice == 1) &&
      (this.objAntro.id_resultado_romber_prueba_na == 1) &&
      (this.objAntro.id_resultado_romberg == 1) &&

      (this.objAntro.id_resultado_movimientos_reflejos == 1) &&
      (this.objAntro.id_resultado_tono_muscular == 1) &&
      (this.objAntro.id_resultado_nociones_temporoespaciales == 1) &&
      (this.objAntro.id_resultado_ref_osteo == 2)
      &&
      (this.ValidarSomnolencia())
    ) {
      document.getElementById("objAntro.antropometria_talla")!.classList.add("d-none");
      document.getElementById("objAntro.antropometria_imc")!.classList.add("d-none");
      document.getElementById("objAntro.frecuencia_pulso_reposo")!.classList.add("d-none");
      document.getElementById("objAntro.presion_arterial_diastolica")!.classList.add("d-none");
      document.getElementById("objAntro.presion_arterial_sistolica")!.classList.add("d-none");
      document.getElementById("objAntro.frecuencia_respiratoria_reposo")!.classList.add("d-none");
      document.getElementById("objAntro.pulsoximetria")!.classList.add("d-none");
      document.getElementById("objAntro.capacidad_ventilatoria")!.classList.add("d-none");
      document.getElementById("objAntro.fuerza_muscular")!.classList.add("d-none");
      document.getElementById("objAntro.ausencias_desviaciones")!.classList.add("d-none");
      document.getElementById("objAntro.rango_mov")!.classList.add("d-none");
      document.getElementById("objAntro.lesiones_columna")!.classList.add("d-none");
      document.getElementById("objAntro.lesiones_extremidades")!.classList.add("d-none");
      document.getElementById("objAntro.prueba_indice")!.classList.add("d-none");
      document.getElementById("objAntro.romber")!.classList.add("d-none");
      document.getElementById("objAntro.romberg")!.classList.add("d-none");
      document.getElementById("objAntro.movimientos_reflejos")!.classList.add("d-none");
      document.getElementById("objAntro.tono_muscular")!.classList.add("d-none");
      document.getElementById("objAntro.nociones_temporoespaciales")!.classList.add("d-none");
      document.getElementById("objAntro.ref_osteo")!.classList.add("d-none");

      this.objAntro.resultado_evaluacion_clinica = true;
    }
    else {

      if (this.objAntro.antropometria_talla >= 150) {
        document.getElementById("objAntro.antropometria_talla")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.antropometria_talla")!.classList.remove("d-none");
      }

      if ((this.objAntro.antropometria_imc > 18 && this.objAntro.antropometria_imc < 30)) {
        document.getElementById("objAntro.antropometria_imc")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.antropometria_imc")!.classList.remove("d-none");
      }

      if ((this.objAntro.frecuencia_pulso_reposo > 59 && this.objAntro.frecuencia_pulso_reposo < 101)) {
        document.getElementById("objAntro.frecuencia_pulso_reposo")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.frecuencia_pulso_reposo")!.classList.remove("d-none");
      }

      if ((this.objAntro.presion_arterial_diastolica > 55 && this.objAntro.presion_arterial_diastolica < 101)) {
        document.getElementById("objAntro.presion_arterial_diastolica")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.presion_arterial_diastolica")!.classList.remove("d-none");
      }

      if ((this.objAntro.presion_arterial_sistolica > 105 && this.objAntro.presion_arterial_sistolica < 161)) {
        document.getElementById("objAntro.presion_arterial_sistolica")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.presion_arterial_sistolica")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_frecuencia_respiratoria_reposo == 2 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 3 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 4 ||
        this.objAntro.id_frecuencia_respiratoria_reposo == 5
      )) {
        document.getElementById("objAntro.frecuencia_respiratoria_reposo")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.frecuencia_respiratoria_reposo")!.classList.remove("d-none");
      }

      if ((
        this.objAntro.id_pulsoximetria == 2 ||
        this.objAntro.id_pulsoximetria == 3 ||
        this.objAntro.id_pulsoximetria == 4 ||
        this.objAntro.id_pulsoximetria == 5 ||
        this.objAntro.id_pulsoximetria == 6 ||
        this.objAntro.id_pulsoximetria == 7
      )) {
        document.getElementById("objAntro.pulsoximetria")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.pulsoximetria")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_capacidad_ventilatoria == 1)) {
        document.getElementById("objAntro.capacidad_ventilatoria")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.capacidad_ventilatoria")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_fuerza_muscular == 1)) {
        document.getElementById("objAntro.fuerza_muscular")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.fuerza_muscular")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_ausencia == 1)) {
        document.getElementById("objAntro.ausencias_desviaciones")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.ausencias_desviaciones")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_rango == 1)) {
        document.getElementById("objAntro.rango_mov")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.rango_mov")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_les_vertebra == 1)) {
        document.getElementById("objAntro.lesiones_columna")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.lesiones_columna")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_les_extremidades == 1)) {
        document.getElementById("objAntro.lesiones_extremidades")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.lesiones_extremidades")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_prueba_indice == 1)) {
        document.getElementById("objAntro.prueba_indice")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.prueba_indice")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_romber_prueba_na == 1)) {
        document.getElementById("objAntro.romber")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.romber")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_romberg == 1)) {
        document.getElementById("objAntro.romberg")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.romberg")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_movimientos_reflejos == 1)) {
        document.getElementById("objAntro.movimientos_reflejos")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.movimientos_reflejos")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_tono_muscular == 1)) {
        document.getElementById("objAntro.tono_muscular")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.tono_muscular")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_nociones_temporoespaciales == 1)) {
        document.getElementById("objAntro.nociones_temporoespaciales")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.nociones_temporoespaciales")!.classList.remove("d-none");
      }

      if ((this.objAntro.id_resultado_ref_osteo == 2)) {
        document.getElementById("objAntro.ref_osteo")!.classList.add("d-none");
      } else {
        document.getElementById("objAntro.ref_osteo")!.classList.remove("d-none");
      }
      this.ValidarSomnolencia();

      this.objAntro.resultado_evaluacion_clinica = false;
    }
  }
  ValidarAptoAntecedentes(): boolean {
    let total_item_no_pasan = this.lstAntecedentes.filter((x: any) => x.respuesta == true).length;
    if (total_item_no_pasan == 0) {
      return true;
    }
    else {
      return false;
    }
  }
  SetearDefecto() {

    this.objAntro.id_resultado_capacidad_ventilatoria = 1;

    this.objAntro.id_resultado_fuerza_muscular = 1;
    this.objAntro.id_resultado_ausencia = 1;
    this.objAntro.id_resultado_rango = 1;
    this.objAntro.id_resultado_les_vertebra = 1;
    this.objAntro.id_resultado_les_extremidades = 1;

    this.objAntro.id_resultado_prueba_indice = 1;
    this.objAntro.id_resultado_romber_prueba_na = 1;
    this.objAntro.id_resultado_romberg = 1;

    this.objAntro.id_resultado_movimientos_reflejos = 1;
    this.objAntro.id_resultado_tono_muscular = 1;
    this.objAntro.id_resultado_nociones_temporoespaciales = 1;
    this.objAntro.id_resultado_ref_osteo = 2;
    this.objAntro.id_observacion_clinica = 1;

    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.objAntro.indice_masa_corporal = "---------";
      this.objAntro.presion_arterial_sistolica_diastolica = "---------";
      this.objAntro.id_resultado_orofaringe_clasificacion = 5;
      this.objAntro.id_resultado_perimetro_cuello = 20;
      this.objAntro.id_resultado_escala_somnolencia = 16;
      this.objAntro.ronquido_intenso = "---------";
    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      this.objAntro.indice_masa_corporal = this.objAntro.antropometria_imc.toString();
      this.objAntro.presion_arterial_sistolica_diastolica = this.objAntro.presion_arterial_sistolica.toString() + "/" + this.objAntro.presion_arterial_diastolica.toString();
      this.objAntro.id_resultado_orofaringe_clasificacion = 2;
      this.objAntro.id_resultado_perimetro_cuello = 11;
      this.objAntro.id_resultado_escala_somnolencia = 3;
      this.objAntro.ronquido_intenso = "---------";
    }
  }
  SetearControlesPorCondicion() {
  }
  Imprimir() {
    window.print();
  }
  PUEDE_REGISTRAR: boolean = false;

  ValidarFormularioI(): boolean {
    if (this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "") {
      this.helper.Mensaje("info", "Mensaje del Sistema", "Complete la Hora de ingreso de la evaluación", () => {
        document.getElementById('objFM.hora_inicio_evaluacion')?.focus();
      });
      return false;
    }

    if (this.objFM.hora_termino_evaluacion == null || this.objFM.hora_termino_evaluacion == "") {
      // this.helper.Mensaje("info", "Mensaje del Sistema", "Complete la Hora de salida de la evaluación", () => {
      //   document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      // });
      // return false;
    }
    else {
      if (this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion, "00:15") == false) {
        // this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Oftalmología</b> debe ser <b>mínimo de 15 minutos</b>",()=>{
        // });
        this.helper.Mensaje("warning", "Mensaje de Prueba", "El tiempo de duración en el <b>Área Médica</b> debe ser <b>mínimo de 15 minutos</b>", () => {
        });
        return false;
      }
      if (!this.helper.ValidarHoraTermino(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion)) {
        this.helper.Mensaje("info", "Mensaje del Sistema", "La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
          document.getElementById('objFM.hora_termino_evaluacion')?.focus();
        });
        return false;
      }
    }

    return true;
  }
  SetearHoraECI() {
    this.objFM.hora_termino_evaluacion = this.objAntro.hora_termino_evaluacion;
  }
  SetearHoraECIIyIII() {
    this.objAntro.hora_termino_evaluacion = this.objFM.hora_termino_evaluacion;
  }
  ValidarFormularioIIyIII(): boolean {
    // if (this.objAntro.hora_inicio_evaluacion == null || this.objAntro.hora_inicio_evaluacion == "") {
    //   this.helper.Mensaje("info", "Mensaje del Sistema", "Complete la Hora de ingreso de la evaluación", () => {
    //     document.getElementById('objAntro.hora_inicio_evaluacion')?.focus();
    //   });
    //   return false;
    // }

    // if (this.objAntro.hora_termino_evaluacion == null || this.objAntro.hora_termino_evaluacion == "") {
    //   this.helper.Mensaje("info", "Mensaje del Sistema", "Complete la Hora de salida de la evaluación", () => {
    //     document.getElementById('objAntro.hora_termino_evaluacion')?.focus();
    //   });
    //   return false;
    // }
    // else {
    //   if (this.helper.ValidarRangoTiempo(this.objAntro.hora_inicio_evaluacion, this.objAntro.hora_termino_evaluacion, "00:15") == false) {
    //     // this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Oftalmología</b> debe ser <b>mínimo de 15 minutos</b>",()=>{
    //     // });
    //     this.helper.Mensaje("warning", "Mensaje de Prueba", "El tiempo de duración en el <b>Área de ¿?</b> debe ser <b>mínimo de 15 minutos</b>", () => {
    //     });
    //     return false;
    //   }
    // }
    // if (!this.helper.ValidarHoraTermino(this.objAntro.hora_inicio_evaluacion, this.objAntro.hora_termino_evaluacion)) {
    //   this.helper.Mensaje("info", "Mensaje del Sistema", "La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
    //     document.getElementById('objAntro.hora_termino_evaluacion')?.focus();
    //   });
    //   return false;
    // }
    return true;
  }
  ValidarSomnolencia(): boolean {
    // id_resultado_orofaringe_clasificacion
    // id_resultado_perimetro_cuello
    // id_resultado_escala_somnolencia
    // ronquido_intenso
    //id_sexo 1 "MASCULINO" 2 FEMENINO
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.objAntro.resultado_mon = "APTO";


      return true;
    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      if (
        (
          (this.objAntro.id_resultado_orofaringe_clasificacion == 1)
          ||
          (this.objAntro.id_resultado_orofaringe_clasificacion == 2)
        )
        &&
        (
          (this.OBJ_FICHA_MEDICA.id_sexo == 1 && this.objAntro.id_resultado_perimetro_cuello < 15)
          ||
          (this.OBJ_FICHA_MEDICA.id_sexo == 2 && this.objAntro.id_resultado_perimetro_cuello < 8)
        )
        &&
        (
          this.objAntro.id_resultado_escala_somnolencia < 13
        )
      ) {
        this.objAntro.resultado_mon = "APTO";
        document.getElementById("objAntro.orofaringe")!.classList.add("d-none");
        document.getElementById("objAntro.perimetro_cuello")!.classList.add("d-none");
        document.getElementById("objAntro.escala_somnolencia")!.classList.add("d-none");
        return true;
      }
      else {

        if (
          (
            (this.objAntro.id_resultado_orofaringe_clasificacion == 1)
            ||
            (this.objAntro.id_resultado_orofaringe_clasificacion == 2)
          )
        ) {
          document.getElementById("objAntro.orofaringe")!.classList.add("d-none");
        } else {
          document.getElementById("objAntro.orofaringe")!.classList.remove("d-none");
        }

        if (
          (this.OBJ_FICHA_MEDICA.id_sexo == 1 && this.objAntro.id_resultado_perimetro_cuello < 15)
          ||
          (this.OBJ_FICHA_MEDICA.id_sexo == 2 && this.objAntro.id_resultado_perimetro_cuello < 8)
        ) {
          document.getElementById("objAntro.perimetro_cuello")!.classList.add("d-none");
        } else {
          document.getElementById("objAntro.perimetro_cuello")!.classList.remove("d-none");
        }

        if ((this.objAntro.id_resultado_escala_somnolencia < 13)) {
          document.getElementById("objAntro.escala_somnolencia")!.classList.add("d-none");
        } else {
          document.getElementById("objAntro.escala_somnolencia")!.classList.remove("d-none");
        }


        this.objAntro.resultado_mon = "NO APTO";
        return false;
      }
    }
    this.objAntro.resultado_mon = "NO APTO";
    return false;
  }

  VerificarInicio() {
    if (this.OBJ_HORA.hora_termino_evaluacion_evaps == null) {
      this.helper.Mensaje("info", "Mensaje del Sistema", "Aún no se concluye la Evaluación Psicológica del postulante", () => {
        this.PUEDE_REGISTRAR = false;
      });
    }
    else {

      let verificandoActivoArea = this.VerificarActivoOtraArea(this.OBJ_HORA.hora_termino_evaluacion_evaps, this.OBJ_HORA.hora_inicio_evaluacion_evis, this.OBJ_HORA.hora_termino_evaluacion_evis, this.OBJ_HORA.hora_inicio_evaluacion_evaud, this.OBJ_HORA.hora_termino_evaluacion_evaud, "Visual", "Auditiva");

      if (verificandoActivoArea.activo == false) {
        if (!this.helper.ValidarHoraIngreso(
          //this.OBJ_HORA.hora_termino_evaluacion_evaps,
          verificandoActivoArea.hora,
          this.objFM.hora_inicio_evaluacion
        )) {
          this.PUEDE_REGISTRAR = false;
          this.helper.Mensaje("error", "Aviso", "La hora de ingreso no puede ser menor o igual a <b>" + (verificandoActivoArea.hora) + "</b>", () => {
            document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
          });
        }
        else {
          this.objAntro.hora_inicio_evaluacion = this.objFM.hora_inicio_evaluacion;
          this.PUEDE_REGISTRAR = true;
          this.GuardarEvaliacionclinicaI(false);
        }
      }

    }
  }
  VerificarActivoOtraArea(principa: any, A_inicio: any, A_termino: any, B_inicio: any, B_termino: any, A_area: string, B_area: string): any {
    if (A_inicio != null && A_termino == null) {
      this.helper.Mensaje("error", "Aviso", "Aún no se concluye la Evaluación " + A_area + " del postulante", () => { });
      return { activo: true, hora: "" };
    }
    if (B_inicio != null && B_termino == null) {
      this.helper.Mensaje("error", "Aviso", "Aún no se concluye la Evaluación " + B_area + "  del postulante", () => { });
      return { activo: true, hora: "" };
    }

    if (A_inicio != null && A_termino != null && B_inicio != null && B_termino != null) {
      let mayor: string = "00:00";
      if (A_termino > B_inicio) {
        mayor = A_termino;
      }
      else {
        mayor = B_termino;
      }
      return { activo: false, hora: mayor };
    }

    if (A_inicio != null && A_termino != null) {
      return { activo: false, hora: A_termino };
    }
    if (B_inicio != null && B_termino != null) {
      return { activo: false, hora: B_termino };
    }

    if (A_inicio == null && A_termino == null && B_inicio == null && B_termino == null) {
      return { activo: false, hora: principa };
    }
  }
}

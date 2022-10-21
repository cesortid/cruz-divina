import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent implements OnInit {
  PUEDE_REGISTRAR:boolean=false;

  cboAlcohol = [];
  cboDrogas = [];
  cboGrupoSanguineo = [];
  cboFactorSanguineo = [];

  @ViewChild('ddlResultadoAlcohol') ddlResultadoAlcohol!: NgSelectComponent;
  @ViewChild('ddlNivelAlcohol') ddlNivelAlcohol!: NgSelectComponent;
  @ViewChild('ddlCocaina') ddlCocaina!: NgSelectComponent;
  @ViewChild('ddlMarihuana') ddlMarihuana!: NgSelectComponent;
  @ViewChild('ddlDrogas') ddlPaddlDrogasises!: NgSelectComponent;
  @ViewChild('ddlGrupoSanguineo') ddlGrupoSanguineo!: NgSelectComponent;
  @ViewChild('ddlFactorSanguineo') ddlFactorSanguineo!: NgSelectComponent;




  objFM = {
    "id_analisis_laboratorio": 0,
    "id_ficha_medica_snc": 0,
    "fecha_inicio_evaluacion": null,
    "hora_inicio_evaluacion": null,
    "fecha_termino_evaluacion": null,
    "hora_termino_evaluacion": null,
    "id_resultado_toxicologico": 0,
    "id_valor_resultado_toxicologico": 0,
    "id_resultado_cocaina": 0,
    "id_resultado_marihuana": 0,
    "id_resultado_droga_sin": 0,
    id_grupo_sanguineo: 0,
    id_factor_rh: 0,
    "resultado_prueba": true,
    "observacion": "NINGUNA",
    "activo": true,
    "usuario_creacion": 46183970,
    "usuario_modificacion": 46183970
  }
  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;

  constructor(private crypto: CryptoService, private rutaActual: ActivatedRoute, private servicio: FichaMedicaService, private helper: Funciones) { }

  ngOnInit(): void {
    if (this.rutaActual.snapshot.paramMap.get('id') != null) {
      let ccc: string;
      ccc = this.rutaActual.snapshot.params.id;
      this.ID_FICHA_MEDICA_SNC = Number(this.crypto.desencriptar(ccc));
      this.CargarConfiguracion(this.ID_FICHA_MEDICA_SNC).then(()=>{
        this.ComprobarExistente().then((rptaExiste: any) => {
          //cargamos los combos 
          this.CargarControles().then((rptaCombos: any) => {
            if (rptaCombos && rptaExiste.existe) {
              this.Setear(rptaExiste.data);
            }
            else {
              this.ValidarHoraFicha();
              this.SetearPorCondicion();
            }
          });
        });       
      });

    }
  }
  CargarControles(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarAnalisisLaboratorioControl().subscribe((data: any) => {
        this.cboAlcohol = data.resultvalresultprueba;
        this.cboDrogas = data.resulttiporesultprueba;
        this.cboGrupoSanguineo = data.resultgruposanguineo;
        this.cboFactorSanguineo = data.resultfactorrh;
        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;
  }
  ComprobarExistente(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      //para traer el ultimo registro asociado a la postulacion
      this.servicio.listaAnalisisLaboratorio(param).subscribe((data: any) => {
        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaanalisislaboratorio[0] });
        }
      }, () => {
        reject({ existe: false, data: null });
      });
    });
    return promise;
  }
  CargarConfiguracion(id_ficha_medica_snc: number): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.objFM.id_ficha_medica_snc = id_ficha_medica_snc;
      let param = { "id_ficha_medica_snc": id_ficha_medica_snc };
      //obtener informacion del registro postulante
      this.servicio.obtenerFichaMedica(param).subscribe((data: any) => {
        this.OBJ_FICHA_MEDICA = data.objfichamedica;
        this.OBJ_HORA=data.objhoraevaluacion;
        resolve(true);
      });
    });
    return promise;
  }
  SetearPorCondicion() {
    //SI LA CONDICION ES NO PROFESIONAL

    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.objFM.id_resultado_toxicologico = 3;
      this.objFM.id_valor_resultado_toxicologico = 7;
      this.objFM.id_resultado_cocaina = 3;
      this.objFM.id_resultado_marihuana = 3;
      this.objFM.id_resultado_droga_sin = 3;




      this.objFM.id_grupo_sanguineo = 1;
      this.objFM.id_factor_rh = 1;
      this.objFM.resultado_prueba = true;
    }
    //SI LA CONDICION ES PROFESIONAL
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      this.objFM.id_resultado_toxicologico = 2;
      this.objFM.id_valor_resultado_toxicologico = 1;
      this.objFM.id_resultado_cocaina = 2;
      this.objFM.id_resultado_marihuana = 2;
      this.objFM.id_resultado_droga_sin = 2;
      this.objFM.id_grupo_sanguineo = 1;
      this.objFM.id_factor_rh = 1;
      this.objFM.resultado_prueba = true;
    }
  }
  ValidarResultadoToxicologico(e: any) {
    if (this.objFM.id_resultado_toxicologico == 1) {
      this.objFM.id_valor_resultado_toxicologico = 2;
    }
    if (this.objFM.id_resultado_toxicologico == 2) {
      this.objFM.id_valor_resultado_toxicologico = 1;
    }
    if (this.objFM.id_resultado_toxicologico == 3) {
      this.objFM.id_valor_resultado_toxicologico = 7;
    }
    this.ValidacionNegocio();
  }
  ValidarValorToxicologico(e: any) {
    if (this.objFM.id_valor_resultado_toxicologico == 1) {
      this.objFM.id_resultado_toxicologico = 2;
    }
    if (this.objFM.id_valor_resultado_toxicologico > 1 && this.objFM.id_valor_resultado_toxicologico < 7) {
      this.objFM.id_resultado_toxicologico = 1;
    }
    if (this.objFM.id_valor_resultado_toxicologico == 7) {
      this.objFM.id_resultado_toxicologico = 3;
    }
    this.ValidacionNegocio();
  }
  ValidacionNegocio() {
    //NO PROFESIONAL
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      //PASA SI SON NEGATICOS Y SI NO SELECCIONO NADA
      if (
        (this.objFM.id_resultado_toxicologico == 2 || this.objFM.id_resultado_toxicologico == 3) &&
        (this.objFM.id_valor_resultado_toxicologico == 1 || this.objFM.id_valor_resultado_toxicologico == 7) &&

        (this.objFM.id_resultado_cocaina == 2 || this.objFM.id_resultado_toxicologico == 3) &&
        (this.objFM.id_resultado_marihuana == 2 || this.objFM.id_resultado_droga_sin == 3) &&
        (this.objFM.id_resultado_droga_sin == 2 || this.objFM.id_resultado_droga_sin == 3)
      ) {
        this.objFM.resultado_prueba = true;
      }
      else {
        this.objFM.resultado_prueba = false;
      }
    }
    //PROFESIONAL
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      //PASA SI SALE NEGATIVO
      if (
        (this.objFM.id_resultado_toxicologico == 2) &&
        (this.objFM.id_valor_resultado_toxicologico == 1) &&

        (this.objFM.id_resultado_cocaina == 2) &&
        (this.objFM.id_resultado_marihuana == 2) &&
        (this.objFM.id_resultado_droga_sin == 2)
      ) {
        this.objFM.resultado_prueba = true;
      }
      else {
        this.objFM.resultado_prueba = false;
      }
    }
  }
  ValidarFromulario(): boolean {
    //NO PROFESIONAL
    // if(this.OBJ_FICHA_MEDICA.id_condicion==2){

    // }
    //PROFESIONAL




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
      if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"00:05",this.OBJ_HORA.fecha_inicio_evaluacion_an_lab)==false){
        this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Laboratorio</b> debe ser <b>mínimo de 5 minutos</b>",()=>{
          //document.getElementById("objFM.hora_termino_evaluacion")!.focus();
        });
        return false;
      }
    }

    if (!this.helper.ValidarHoraTermino(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion)) {
      this.Mensaje("error", "La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
        document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      });
      return false;
    }

    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      if (this.objFM.id_resultado_toxicologico == 3) {
        this.Mensaje("info", "Seleccione resultado de la prueba rápida de alcoholemia", () => {
          this.ddlResultadoAlcohol.focus();
        });
        return false;
      }
      if (this.objFM.id_valor_resultado_toxicologico == 7) {
        this.Mensaje("info", "Seleccione el valor del resultado de la prueba rápida de alcoholemia", () => {
          this.ddlNivelAlcohol.focus();
        });
        return false;
      }
      if (this.objFM.id_resultado_cocaina == 3) {
        this.Mensaje("info", "Seleccione resultado de la prueba rápida de Cocaína", () => {
          this.ddlCocaina.focus();
        });
        return false;
      }
      if (this.objFM.id_resultado_marihuana == 3) {
        this.Mensaje("info", "Seleccione resultado de la prueba rápida de Marihuana", () => {
          this.ddlMarihuana.focus();
        });
        return false;
      }
      if (this.objFM.id_resultado_droga_sin == 3) {
        this.Mensaje("info", "Seleccione resultado de la prueba rápida de Drogas sinteticas", () => {
          this.ddlPaddlDrogasises.focus();
        });
        return false;
      }
      return true;
    }
    return true;

  }
  Guardar() {
    if (this.ValidarFromulario()) {
      if (this.objFM.id_analisis_laboratorio == 0 || this.objFM.id_analisis_laboratorio == null) {
        this.servicio.insertarAnalisisLaboratorio(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Análisis de Laboratorio fue guardada", () => {
            location.reload();
          });
        });
      }
      else {
        this.servicio.modificarAnalisisLaboratorio(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Análisis de Laboratorio fue guardada", () => {
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
  Setear(data: any) {

    this.objFM.id_analisis_laboratorio = data.id_analisis_laboratorio;
    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objFM.id_resultado_toxicologico = data.id_resultado_toxicologico;
    this.objFM.id_valor_resultado_toxicologico = data.id_valor_resultado_toxicologico;
    this.objFM.id_resultado_cocaina = data.id_resultado_cocaina;
    this.objFM.id_resultado_marihuana = data.id_resultado_marihuana;
    this.objFM.id_resultado_droga_sin = data.id_resultado_droga_sin;
    this.objFM.id_grupo_sanguineo = data.id_grupo_sanguineo;
    this.objFM.id_factor_rh = data.id_factor_rh
    this.objFM.resultado_prueba = data.resultado_prueba;
    this.objFM.observacion = data.observacion;
    this.ValidarHoraIngreso();
  }
  Imprimir() {
    window.print();
  }
  ValidarHoraIngreso(){

    this.ValidarHoraFicha();

      if(!this.helper.ValidarHoraIngreso(
        (this.OBJ_HORA.hora_termino_evaluacion_ficha==null)?this.OBJ_HORA.hora_inicio_evaluacion_ficha:this.OBJ_HORA.hora_inicio_evaluacion_ficha,
        this.objFM.hora_inicio_evaluacion
      )){
        this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+((this.OBJ_HORA.hora_termino_evaluacion_ficha==null)?this.OBJ_HORA.hora_inicio_evaluacion_ficha:this.OBJ_HORA.hora_inicio_evaluacion_ficha)+"</b>",()=>{
          document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
        });
      }

  }
  ValidarHoraSalida(){
  
    if(this.objFM.hora_inicio_evaluacion!=null){
      if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"00:05",this.OBJ_FICHA_MEDICA.fecha_inicio_evaluacion_an_lab)){
      }
      else{
        this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Laboratorio</b> debe ser <b>mínimo de 5 minutos</b>",()=>{
          document.getElementById("objFM.hora_termino_evaluacion")!.focus();
        })
      }
    }
    else{
      this.helper.Mensaje("info","Mensaje del sistema","Es necesario registrar la <b>Hora de ingreso</b>",()=>{})
    }
  }


  ValidarHoraFicha(){
    if(this.OBJ_HORA.hora_inicio_evaluacion_ficha!=null){
      if(this.OBJ_HORA.hora_inicio_evaluacion_ficha!="00:00"){
        this.PUEDE_REGISTRAR=true;
      }
      else{
        this.helper.Mensaje("error","Aviso","Aún no se registra hora de ingreso en la Ficha del Postulante",()=>{
        });
        this.PUEDE_REGISTRAR=false;
      }
    }
    else{
      this.helper.Mensaje("error","Aviso","Aún no se registra hora de ingreso en la Ficha del Postulante",()=>{
      });
      this.PUEDE_REGISTRAR=false;
    }
  }

}

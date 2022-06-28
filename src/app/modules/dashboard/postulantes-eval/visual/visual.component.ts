import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent implements OnInit {
  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;
  objFM = {
    "id_evaluacion_visual": 0,
    "id_ficha_medica_snc": 0,
    "numero_snc": null,
    "fecha_inicio_evaluacion": null,
    "hora_inicio_evaluacion": null,
    "fecha_termino_evaluacion": null,
    "hora_termino_evaluacion": null,
    "id_resultado_agudeza_visual_sc_od": 0,
    "id_resultado_agudeza_visual_sc_oi": 0,
    "id_resultado_agudeza_visual_cc_od": 0,
    "id_resultado_agudeza_visual_cc_oi": 0,
    "id_resultado_agudeza_visual_lentes": 0,
    "id_resultado_vision_produndidad": 0,
    "id_resultado_vision_colores": 0,
    "id_resultado_balance_muscular": 0,
    "id_resultado_encandilamiento": 0,
    "id_resultado_vision_nocturna": 0,
    "id_resultado_recuperacion_encandilamiento_figuras": 0,
    "id_resultado_recuperacion_encandilamiento_recupera": 0,
    "id_resultado_campo_visual_od": 0,
    "id_resultado_campo_visual_oi": 0,
    "resultado_prueba": true,
    "observacion": "NINGUNA",
    "activo": true,
    "usuario_creacion": sessionStorage.getItem("Usuario"),
    "usuario_modificacion": sessionStorage.getItem("Usuario")
  }


  cboSC: any = [];
  cboCC: any = [];
  cboCCI: any = [];
  cboLentes: any = [];
  cboProfundidad = [];
  cboColores = [];
  cboBalance = [];
  cboNocturna = [];
  cboEncandilamiento = [];
  cboRecuperacionFigura = [];
  cboRecuperacionTiempo = [];
  cboCampoVisualI = [];
  cboCampoVisualD = [];

  // [(ngModel)]="objFM.id_evaluacion_visual"
  // [(ngModel)]="objFM.id_ficha_medica_snc"
  // [(ngModel)]="objFM.numero_snc"
  // [(ngModel)]="objFM.fecha_inicio_evaluacion"
  // [(ngModel)]="objFM.hora_inicio_evaluacion"
  // [(ngModel)]="objFM.fecha_termino_evaluacion"
  // [(ngModel)]="objFM.hora_termino_evaluacion"


  constructor(private crypto: CryptoService, private servicio: FichaMedicaService, private rutaActual: ActivatedRoute, private helper: Funciones) { }

  ngOnInit(): void {
    //this.CargarCombo();

    if (this.rutaActual.snapshot.paramMap.get('id') != null) {
      let ccc: string;
      ccc = this.rutaActual.snapshot.params.id;
      this.ID_FICHA_MEDICA_SNC = Number(this.crypto.desencriptar(ccc));
      this.objFM.id_ficha_medica_snc = this.ID_FICHA_MEDICA_SNC;
      //para cargar valores por defecto si cumple cierta regla /fuera de las validaciones de formulario/
      this.CargarConfiguracion(this.ID_FICHA_MEDICA_SNC).then(() => {
        this.ComprobarExistente().then((rptaExiste: any) => {
          this.CargarCombo().then((rptaCombos: any) => {
            if (rptaCombos && rptaExiste.existe) {
              this.Setear(rptaExiste.data);
            }
            else {
              this.SetearDefecto();
            }
          });

        });


      });
      //this.CargarCombo();


    }


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

  ComprobarExistente(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      this.servicio.listaEvalVisual(param).subscribe((data: any) => {

        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaevaluacionvisual[0] });
        }
      }, () => {
        reject({ existe: false, data: null })
      });
    });
    return promise;
  }

  CargarCombo(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarEvaluacionVisualControl().subscribe((data: any) => {
        this.cboSC = data.resultagudezavisualsc;
        this.cboCC = data.resultagudezavisualcc;
        this.cboCC.forEach((ele: any) => {
          ele.disabled = false;
        });
        this.cboCCI = JSON.parse(JSON.stringify(data.resultagudezavisualcc));
        this.cboCCI.forEach((ele: any) => {
          ele.disabled = false;
        });

        this.cboLentes = data.resultagudezavisuallentes;
        this.cboLentes.push({ descripcion: "Error", id_resultado_agudeza_visual_lentes: 0 });

        this.cboProfundidad = data.resultvisionprofundidad;
        this.cboColores = data.resultvisioncolores;
        this.cboBalance = data.resultbalancemuscular;
        this.cboNocturna = data.resultencandilvisionnocturna;
        this.cboEncandilamiento = data.resultencandilamiento;
        this.cboRecuperacionFigura = data.resultrecencandilfigura;
        this.cboRecuperacionTiempo = data.resultrecencandilrecupera;
        this.cboCampoVisualI = data.resultcampovisualoi;
        this.cboCampoVisualD = data.resultcampovisualod;

        resolve(true);
      }, () => {
        reject(false)
      });
    });
    return promise;

  }
  SetearDefecto() {
    // if(this.OBJ_FICHA_MEDICA.id_condicion==1){
    //   this.objFM.indice_masa_corporal="---------";
    //   this.objAntro.presion_arterial_sistolica_diastolica="---------";
    //   this.objAntro.id_resultado_orofaringe_clasificacion=5;
    //   this.objAntro.id_resultado_perimetro_cuello=20;
    //   this.objAntro.id_resultado_escala_somnolencia=16;
    //   this.objAntro.ronquido_intenso="---------";
    // }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      this.objFM.id_resultado_agudeza_visual_cc_od = 12;
      this.objFM.id_resultado_agudeza_visual_cc_oi = 12;
    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      this.objFM.id_resultado_agudeza_visual_cc_od = 1;
      this.objFM.id_resultado_agudeza_visual_cc_oi = 1;
    }


    this.objFM.id_resultado_vision_produndidad = 9;
    this.objFM.id_resultado_vision_colores = 1;
    this.objFM.id_resultado_balance_muscular = 15;
    this.objFM.id_resultado_vision_nocturna = 1;
    this.objFM.id_resultado_encandilamiento = 1;
    this.objFM.id_resultado_recuperacion_encandilamiento_figuras = 2;
    this.objFM.id_resultado_recuperacion_encandilamiento_recupera = 3;
    this.objFM.id_resultado_campo_visual_od = 2;
    this.objFM.id_resultado_campo_visual_oi = 2;
    this.objFM.id_resultado_agudeza_visual_sc_od = 1;
    this.objFM.id_resultado_agudeza_visual_sc_oi = 1;

    this.objFM.id_resultado_agudeza_visual_lentes = 1;
    this.objFM.observacion = "NINGUNA";
    this.ValidarLentes();
  }
  Guardar(con_mensaje:boolean=true) {
    if (this.ValidarFromulario()) {

      if (this.objFM.id_evaluacion_visual == 0 || this.objFM.id_evaluacion_visual == null) {
        this.servicio.insertarEvaluacionVisual(this.objFM).subscribe((data: any) => {

          if(con_mensaje){
            this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Visual fue guardada", () => {
              location.reload();
            });            
          }
          else{
            location.reload();
          }

        });
      }
      else {
        this.servicio.modificarEvalVisual(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Visual fue guardada", () => {
          });
        });
      }

    }
  }
  ValidarFromulario(): boolean {


    if (this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "") {
      this.helper.Mensaje("info","Mensaje del sistema","Complete la Hora de ingreso de la evaluación", () => {
        document.getElementById('objFM.hora_inicio_evaluacion')?.focus();
      });
      return false;
    }

    if (this.objFM.hora_termino_evaluacion == null || this.objFM.hora_termino_evaluacion == "") {
      // this.helper.Mensaje("info","Mensaje del sistema","Complete la Hora de salida de la evaluación", () => {
      //   document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      // });
      // return false;
    }
    else{
      if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"00:15")==false){
        this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Oftalmología</b> debe ser <b>mínimo de 15 minutos</b>",()=>{
          //document.getElementById("objFM.hora_termino_evaluacion")!.focus();
        });
        return false;
      }

      if (!this.helper.ValidarHoraTermino(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion)) {
        this.helper.Mensaje("error","Mensaje del sistema","La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
          document.getElementById('objFM.hora_termino_evaluacion')?.focus();
        });
        return false;
      }
    }



    return true;
  }
  Setear(data: any) {

    this.objFM.id_evaluacion_visual = data.id_evaluacion_visual;
    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    //this.objFM.numero_snc=data.;
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objFM.id_resultado_agudeza_visual_sc_od = data.id_resultado_agudeza_visual_sc_od;
    this.objFM.id_resultado_agudeza_visual_sc_oi = data.id_resultado_agudeza_visual_sc_oi;
    this.objFM.id_resultado_agudeza_visual_cc_od = data.id_resultado_agudeza_visual_cc_od;
    this.objFM.id_resultado_agudeza_visual_cc_oi = data.id_resultado_agudeza_visual_cc_oi;
    this.objFM.id_resultado_agudeza_visual_lentes = data.id_resultado_agudeza_visual_lentes;
    this.objFM.id_resultado_vision_produndidad = data.id_resultado_vision_produndidad;
    this.objFM.id_resultado_vision_colores = data.id_resultado_vision_colores;
    this.objFM.id_resultado_balance_muscular = data.id_resultado_balance_muscular;
    this.objFM.id_resultado_encandilamiento = data.id_resultado_encandilamiento;
    this.objFM.id_resultado_vision_nocturna = data.id_resultado_vision_nocturna;
    this.objFM.id_resultado_recuperacion_encandilamiento_figuras = data.id_resultado_recuperacion_encandilamiento_figuras;
    this.objFM.id_resultado_recuperacion_encandilamiento_recupera = data.id_resultado_recuperacion_encandilamiento_recupera;
    this.objFM.id_resultado_campo_visual_od = data.id_resultado_campo_visual_od;
    this.objFM.id_resultado_campo_visual_oi = data.id_resultado_campo_visual_oi;
    this.objFM.observacion = data.observacion;
    this.objFM.resultado_prueba = data.resultado_prueba;
    this.PUEDE_REGISTRAR=true;
    this.ValidarLentes(false);
  }
  ValidarLentes(es_nuevo:boolean=false) {
    this.objFM.id_resultado_agudeza_visual_lentes = 0;

    //habilitamos todos;
    this.cboCC.forEach((ele: any) => {
      ele.disabled = true;
    });
    this.cboCCI.forEach((ele: any) => {
      ele.disabled = true;
    });

    //desactivamos mayores a lo seleccionado previamente en SC
    //setTimeout(() => {

      this.cboCC.filter((x: any) => x.id_resultado_agudeza_visual_cc <= this.objFM.id_resultado_agudeza_visual_sc_od).forEach((ele: any) => {
        ele.disabled = false;
      });
      this.cboCC.find((x: any) => x.id_resultado_agudeza_visual_cc == 12).disabled = false;
      //this.objFM.id_resultado_agudeza_visual_cc_od=this.objFM.id_resultado_agudeza_visual_sc_od;


      this.cboCCI.filter((x: any) => x.id_resultado_agudeza_visual_cc <= this.objFM.id_resultado_agudeza_visual_sc_oi).forEach((ele: any) => {
        ele.disabled = false;
      });
      this.cboCCI.find((x: any) => x.id_resultado_agudeza_visual_cc == 12).disabled = false;
      //this.objFM.id_resultado_agudeza_visual_cc_oi=this.objFM.id_resultado_agudeza_visual_sc_oi;

      //validamos que cc no sea 0 cuando cc es mayor que sc
      if (this.objFM.id_resultado_agudeza_visual_cc_od > this.objFM.id_resultado_agudeza_visual_sc_od) {
        this.objFM.id_resultado_agudeza_visual_cc_od = 12;
      }
      if (this.objFM.id_resultado_agudeza_visual_cc_oi > this.objFM.id_resultado_agudeza_visual_sc_oi) {
        this.objFM.id_resultado_agudeza_visual_cc_oi = 12;
      }


      if (this.objFM.id_resultado_agudeza_visual_sc_od == 9 ||
        this.objFM.id_resultado_agudeza_visual_sc_od == 10 ||
        this.objFM.id_resultado_agudeza_visual_sc_od == 11
      ) {
        this.cboCC.forEach((ele: any) => {
          ele.disabled = true;
        });
        this.cboCC.find((x: any) => x.id_resultado_agudeza_visual_cc == this.objFM.id_resultado_agudeza_visual_sc_od).disabled = false;
        this.objFM.id_resultado_agudeza_visual_cc_od = this.objFM.id_resultado_agudeza_visual_sc_od;
      }

      if (this.objFM.id_resultado_agudeza_visual_sc_oi == 9 ||
        this.objFM.id_resultado_agudeza_visual_sc_oi == 10 ||
        this.objFM.id_resultado_agudeza_visual_sc_oi == 11
      ) {
        this.cboCCI.forEach((ele: any) => {
          ele.disabled = true;
        });
        this.cboCCI.find((x: any) => x.id_resultado_agudeza_visual_cc == this.objFM.id_resultado_agudeza_visual_sc_oi).disabled = false;
        this.objFM.id_resultado_agudeza_visual_cc_oi = this.objFM.id_resultado_agudeza_visual_sc_oi;
      }



    //}, 1);


    //VALIDAMOS CUANDO ES NO PROFESIONAL
    let rpta_OD: string = this.ValCondiciones(this.objFM.id_resultado_agudeza_visual_sc_od, this.objFM.id_resultado_agudeza_visual_cc_od);
    let rpta_OI: string = this.ValCondiciones(this.objFM.id_resultado_agudeza_visual_sc_oi, this.objFM.id_resultado_agudeza_visual_cc_oi);

    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {

      this.objFM.observacion = "";
      this.objFM.id_resultado_agudeza_visual_lentes = 0;

      if ((rpta_OD == "ERROR") || (rpta_OI == "ERROR")) {
        this.objFM.observacion = "";
        this.objFM.id_resultado_agudeza_visual_lentes = 0;
      }
      if ((rpta_OD == "SIN LENTES") && (rpta_OI == "SIN LENTES")) {
        this.objFM.observacion = "NINGUNA";
        this.objFM.id_resultado_agudeza_visual_lentes = 1;
      }
      if ((rpta_OD == "CON LENTES") || (rpta_OI == "CON LENTES")) {
        this.objFM.observacion = "CON LENTES";
        this.objFM.id_resultado_agudeza_visual_lentes = 2;
      }
      if ((rpta_OD == "ESPEJOS LATERALES Y 180°") || (rpta_OI == "ESPEJOS LATERALES Y 180°")) {
        this.objFM.observacion = "ESPEJOS LATERALES Y 180°";
        this.objFM.id_resultado_agudeza_visual_lentes = 4;
      }
      if ((rpta_OD == "CON LENTES + ESPEJOS LATERALES Y 180°") || (rpta_OI == "CON LENTES + ESPEJOS LATERALES Y 180°")) {
        this.objFM.observacion = "CON LENTES + ESPEJOS LATERALES Y 180°";
        this.objFM.id_resultado_agudeza_visual_lentes = 3;
      }

    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      this.objFM.observacion = "";
      this.objFM.id_resultado_agudeza_visual_lentes = 0;


      if ((rpta_OD == "SIN LENTES") && (rpta_OI == "SIN LENTES")) {
        this.objFM.observacion = "NINGUNA";
        this.objFM.id_resultado_agudeza_visual_lentes = 1;
      }
      if ((rpta_OD == "CON LENTES") || (rpta_OI == "CON LENTES")) {
        this.objFM.observacion = "CON LENTES";
        this.objFM.id_resultado_agudeza_visual_lentes = 2;
      }
      if (rpta_OD == "ERROR" || rpta_OI == "ERROR") {
        this.objFM.observacion = "";
        this.objFM.id_resultado_agudeza_visual_lentes = 0;
      }
    }
    //if(es_nuevo){
      setTimeout(()=>{this.ValidarNegocio();},1)
    
    //}
  }
  ValCondiciones(sc: number, cc: number): string {
    let rpta: string = "ERROR";
    //no profesional
    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      if (sc <= 3 || sc == 12) {
        rpta = "SIN LENTES";
      }
      else {
        if (sc == 9 || sc == 10 || sc == 11) {
          rpta = "ERROR";
        }
        else {
          if (
            (sc > 3 && sc < 9)
            &&
            (cc <= 3 || cc == 12)
          ) {
            rpta = "CON LENTES";
          }
          else {
            if (
              (sc > 3 && sc < 9)
              &&
              (cc > 3 && cc < 9)
            ) {
              //preguntaremos si mejora más de 1 linea
              if (
                (sc == 8 && ((cc == 4) || (cc == 5) || (cc == 6) || (cc == 12)))
                ||
                (sc == 7 && ((cc == 4) || (cc == 5) || (cc == 12)))
                ||
                (sc == 6 && ((cc == 4) || (cc == 12)))
              ) {
                rpta = "CON LENTES + ESPEJOS LATERALES Y 180°";
              }
              // prguntamos si solo mejora 1 linea
              if (
                (sc == 8 && ((cc == 8) || (cc == 7)))
                ||
                (sc == 7 && ((cc == 7) || (cc == 6)))
                ||
                (sc == 6 && ((cc == 6) || (cc == 5)))
                ||
                (sc == 5 && ((cc == 5) || (cc == 4)))
                ||
                (sc == 4 && ((cc = 4)))
              ) {
                rpta = "ESPEJOS LATERALES Y 180°";
              }

            }
          }

        }
      }
    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {
      if (sc == 1 || sc == 12) {
        rpta = "SIN LENTES";
      }
      else {
        if (sc == 9 || sc == 10 || sc == 11) {
          rpta = "ERROR";
        }
        else {
          if (cc == 1 || cc == 12) {
            rpta = "CON LENTES";
          }
          else {
            rpta = "ERROR";
          }
        }
      }

    }
    return rpta;
  }
  ValidarAptoSegunAgudezaVisual(): boolean {
    //VALIDAMOS CUANDO ES NO PROFESIONAL
    let rpta_OD: string = this.ValCondiciones(this.objFM.id_resultado_agudeza_visual_sc_od, this.objFM.id_resultado_agudeza_visual_cc_od);
    let rpta_OI: string = this.ValCondiciones(this.objFM.id_resultado_agudeza_visual_sc_oi, this.objFM.id_resultado_agudeza_visual_cc_oi);


    if (this.OBJ_FICHA_MEDICA.id_condicion == 1) {
      //CON LENTES + ESPEJOS LATERALES Y 180°
      //ESPEJOS LATERALES Y 180°
      if (
        ((rpta_OD == "CON LENTES + ESPEJOS LATERALES Y 180°") && (rpta_OI == "CON LENTES + ESPEJOS LATERALES Y 180°")) ||
        ((rpta_OD == "CON LENTES + ESPEJOS LATERALES Y 180°") && (rpta_OI == "ESPEJOS LATERALES Y 180°")) ||
        ((rpta_OD == "ESPEJOS LATERALES Y 180°") && (rpta_OI == "ESPEJOS LATERALES Y 180°")) ||
        ((rpta_OD == "ESPEJOS LATERALES Y 180°") && (rpta_OI == "CON LENTES + ESPEJOS LATERALES Y 180°")) ||
        (rpta_OD == "ERROR") ||
        (rpta_OI == "ERROR")
      ) {
        return false;
      }
      else {
        return true;
      }
    }
    if (this.OBJ_FICHA_MEDICA.id_condicion == 2) {


      //CON LENTES + ESPEJOS LATERALES Y 180°
      //ESPEJOS LATERALES Y 180°
      if (
        (rpta_OD == "ERROR") ||
        (rpta_OI == "ERROR")
      ) {
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }
  ValidarNegocio() {
    if (
      (this.OBJ_FICHA_MEDICA.id_condicion == 1 && this.objFM.id_resultado_vision_produndidad < 6) ||
      (this.OBJ_FICHA_MEDICA.id_condicion == 2 && this.objFM.id_resultado_vision_produndidad < 8) ||
      (this.objFM.id_resultado_vision_colores == 2) ||
      (this.objFM.id_resultado_balance_muscular ==16) ||
      (this.objFM.id_resultado_vision_nocturna == 2) ||
      (this.objFM.id_resultado_encandilamiento == 2) ||
      (this.objFM.id_resultado_recuperacion_encandilamiento_figuras == 1) ||
      (this.objFM.id_resultado_recuperacion_encandilamiento_recupera > 5) ||
      (this.objFM.id_resultado_campo_visual_od == 1 || this.objFM.id_resultado_campo_visual_oi == 1) 
      ||
      (this.ValidarAptoSegunAgudezaVisual()==false)
    ) {
      //Desagregando para mostrar mensaje
        if(this.ValidarAptoSegunAgudezaVisual()==false){
          document.getElementById("objFM.id_resultado_agudeza_visual_lentes")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_agudeza_visual_lentes")!.classList.add("d-none");
        }

        if(this.OBJ_FICHA_MEDICA.id_condicion == 1){
          if(this.objFM.id_resultado_vision_produndidad < 6){
            document.getElementById("objFM.id_resultado_vision_produndidad")!.classList.remove("d-none");
          }
          else{ 
            document.getElementById("objFM.id_resultado_vision_produndidad")!.classList.add("d-none");
          }
        }
        if(this.OBJ_FICHA_MEDICA.id_condicion == 2){
          if(this.objFM.id_resultado_vision_produndidad < 8){
            document.getElementById("objFM.id_resultado_vision_produndidad")!.classList.remove("d-none");
          }
          else{ 
            document.getElementById("objFM.id_resultado_vision_produndidad")!.classList.add("d-none");
          }
        }

        if(this.objFM.id_resultado_vision_colores==2){
          document.getElementById("objFM.id_resultado_vision_colores")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_vision_colores")!.classList.add("d-none");
        }

        if((this.objFM.id_resultado_balance_muscular ==16) ){
          document.getElementById("objFM.id_resultado_balance_muscular")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_balance_muscular")!.classList.add("d-none");
        }

        if(this.objFM.id_resultado_vision_nocturna==2){
          document.getElementById("objFM.id_resultado_vision_nocturna")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_vision_nocturna")!.classList.add("d-none");
        }

        if(this.objFM.id_resultado_encandilamiento==2){
          document.getElementById("objFM.id_resultado_encandilamiento")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_encandilamiento")!.classList.add("d-none");
        }


        
        //----
        if(this.objFM.id_resultado_recuperacion_encandilamiento_figuras == 1){
          document.getElementById("objFM.encandilamiento_figura")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.encandilamiento_figura")!.classList.add("d-none");
        }

        if(this.objFM.id_resultado_recuperacion_encandilamiento_recupera > 5){
          document.getElementById("objFM.encandilamiento_recupera")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.encandilamiento_recupera")!.classList.add("d-none");
        }

        if(this.objFM.id_resultado_campo_visual_od == 1 || this.objFM.id_resultado_campo_visual_oi == 1){
          document.getElementById("objFM.id_resultado_campo_visual")!.classList.remove("d-none");
        }else{
          document.getElementById("objFM.id_resultado_campo_visual")!.classList.add("d-none");
        }

      this.objFM.resultado_prueba = false;
    }
    else {
      try{
      document.getElementById("objFM.id_resultado_agudeza_visual_lentes")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_vision_produndidad")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_vision_colores")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_balance_muscular")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_vision_nocturna")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_encandilamiento")!.classList.add("d-none");
      document.getElementById("objFM.encandilamiento_figura")!.classList.add("d-none");
      document.getElementById("objFM.encandilamiento_recupera")!.classList.add("d-none");
      document.getElementById("objFM.id_resultado_campo_visual")!.classList.add("d-none");
    }
    catch(e){}
      this.objFM.resultado_prueba = true;
    }
  }
  Imprimir() {
    window.print();
  }
  PUEDE_REGISTRAR:boolean=false;
  

  // ValidarHoraIngreso(){
  //   if(!this.helper.ValidarHoraIngreso(
  //     this.OBJ_HORA.hora_termino_evaluacion_an_lab,
  //     this.objFM.hora_inicio_evaluacion
  //   )){
  //     this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+(this.OBJ_HORA.hora_termino_evaluacion_an_lab)+"</b>",()=>{
  //       document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
  //     });
  //   }
  // }


  VerificarInicio(){
    if(this.OBJ_HORA.hora_termino_evaluacion_evaps==null){
      this.helper.Mensaje("info","Mensaje del Sistema","Aún no se concluye la Evaluación Psicológica del postulante",()=>{
        this.PUEDE_REGISTRAR=false;
      });
    }
    else{


      let verificandoActivoArea=this.VerificarActivoOtraArea(this.OBJ_HORA.hora_termino_evaluacion_evaps,this.OBJ_HORA.hora_inicio_evaluacion_evaud,this.OBJ_HORA.hora_termino_evaluacion_evaud,this.OBJ_HORA.hora_inicio_evaluacion_evacl,this.OBJ_HORA.hora_termino_evaluacion_evacl,"Auditiva","Clínica");

      if(verificandoActivoArea.activo==false){
        if(!this.helper.ValidarHoraIngreso(
          //this.OBJ_HORA.hora_termino_evaluacion_evaps,
          verificandoActivoArea.hora,
          this.objFM.hora_inicio_evaluacion
        )){
          this.PUEDE_REGISTRAR=false;
          this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+( verificandoActivoArea.hora)+"</b>",()=>{
            document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
          });
        }
        else{
          this.PUEDE_REGISTRAR=true;    
          this.Guardar(false);    
        }        
      }
    
    }
  }
  VerificarActivoOtraArea(principa:any,A_inicio:any,A_termino:any,B_inicio:any,B_termino:any,A_area:string,B_area:string):any{


      if(A_inicio!=null && A_termino==null){
        this.helper.Mensaje("error","Aviso","Aún no se concluye la Evaluación "+A_area+" del postulante",()=>{});
        return {activo:true,hora:""};
      }
      if(B_inicio!=null && B_termino==null){
        this.helper.Mensaje("error","Aviso","Aún no se concluye la Evaluación "+B_area+"  del postulante",()=>{});
        return {activo:true,hora:""};
      }

      if(A_inicio!=null && A_termino!=null && B_inicio!=null && B_termino!=null){
        let mayor:string="00:00";
        if(A_termino>B_inicio){
          mayor=A_termino;
        }
        else{
          mayor=B_termino;
        }
        return {activo:false,hora:mayor};
      }
  
      if(A_inicio!=null && A_termino!=null){
        return {activo:false,hora:A_termino};
      }
      if(B_inicio!=null && B_termino!=null){
        return {activo:false,hora:B_termino};
      }

      if(A_inicio==null && A_termino==null && B_inicio==null && B_termino==null){
        return {activo:false,hora:principa};
      }



  }
}
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones } from 'src/app/modules/shared/funciones';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';

@Component({
  selector: 'app-rfinal',
  templateUrl: './rfinal.component.html',
  styleUrls: ['./rfinal.component.scss']
})
export class RfinalComponent implements OnInit {
  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;
  objFM = {
    id_resultado_final: 0,
    id_ficha_medica_snc: 0,
    fecha_inicio_evaluacion: null,
    hora_inicio_evaluacion: null,
    fecha_termino_evaluacion: null,
    hora_termino_evaluacion: "",
    activo: true,
    resultado_final: null,
    observacion: "",
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

        this.ComprobarExistenteResultadoFinal().then((rptaExiste: any) => {
          //cargamos los combos  si no existe info de antecedentes

          this.objFM.resultado_final = rptaExiste.apto;
          this.VerificarInicio();
          if (rptaExiste.existe) {
            this.Setear(rptaExiste.data);
          }
          else {

          }
        });

      });

    }
  }
  CargarConfiguracion(id_ficha_medica_snc: number): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.objFM.id_ficha_medica_snc = id_ficha_medica_snc;
      let param = { "id_ficha_medica_snc": id_ficha_medica_snc };
      //obtener informacion del registro postulante
      this.servicio.obtenerFichaMedica(param).subscribe((data: any) => {
        this.OBJ_FICHA_MEDICA = data.objfichamedica;
        this.OBJ_HORA = data.objhoraevaluacion;
        //this.ValidacionCondicion();
        resolve(true);
      });
    });
    return promise;
  }
  ComprobarExistenteResultadoFinal(): Promise<any> {
    let param = { "id_ficha_medica_snc": this.ID_FICHA_MEDICA_SNC };
    let promise = new Promise((resolve, reject) => {
      //para traer el ultimo registro asociado a la postulacion

      this.servicio.listar_result_final(param).subscribe((data: any) => {
        let apto: boolean = false;


        let html = "";
        if(data.observacion_laboratorio!=null){
          if ((data.observacion_laboratorio.toUpperCase().trim() != "NINGUNA" && data.observacion_laboratorio.toUpperCase().trim() != "")) {
            html = html + 'ANALISIS DE LABORATORIO: ' + data.observacion_laboratorio.toUpperCase().trim() + "\n";
          }          
        }
        if(data.observacion_psico!=null){
          if ((data.observacion_psico.toUpperCase().trim() != "NINGUNA" && data.observacion_psico.toUpperCase().trim() != "")) {
            html = html + 'EVALUACION PSICOLOGICA: ' + data.observacion_psico.toUpperCase().trim() + "\n";
          }          
        }

        if(data.observacion_visual!=null){
          if ((data.observacion_visual.toUpperCase().trim() != "NINGUNA" && data.observacion_visual.toUpperCase().trim() != "")) {
            html = html + 'EVALUACION VISUAL: ' + data.observacion_visual.toUpperCase().trim() + "\n";
          }    
        }

        if(data.observacion_auditiva!=null){
          if ((data.observacion_auditiva.toUpperCase().trim() != "NINGUNA" && data.observacion_auditiva.toUpperCase().trim() != "")) {
            html = html + 'EVALUACION AUDITIVA: ' + data.observacion_auditiva.toUpperCase().trim() + "\n";
          }
        }

        if(data.observacion_clinica!=null){
          if ((data.observacion_clinica.toUpperCase().trim() != "NINGUNA" && data.observacion_clinica.toUpperCase().trim() != "")) {
            html = html + 'EVALUACION CLINICA: ' + data.observacion_clinica.toUpperCase().trim() + "\n";
          }
        }

        this.objFM.observacion=html;

        if (
          data.resultado_evaluacion_laboratorio &&
          data.resultado_evaluacion_psico &&
          data.resultado_evaluacion_visual &&
          data.resultado_evaluacion_auditiva &&
          data.resultado_evaluacion_clinica
        ) {
          apto = true;
        }
        else {
          apto = false;
        }


        if (data.cantidad == 0) {
          resolve({ existe: false, data: null, apto: apto });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaresultadofinal[0], apto: apto });
        }
      }, () => {
        reject({ existe: false, data: null, apto: false });
      });
    });
    return promise;
  }

  CargarControles(): Promise<any> {
    let promise = new Promise((resolve, reject) => {

      resolve(true);
    });
    return promise;
  }
  Guardar() {
    if (this.objFM.id_resultado_final == 0 || this.objFM.id_resultado_final == null) {
      this.servicio.insertarResultadoFinal(this.objFM).subscribe((data: any) => {
        this.helper.Mensaje("success", "Mensaje del Sistema", "Resultado final fue guardado", () => {
          location.reload();
        });
      });
    }
    else {
      this.servicio.modificarResultFinal(this.objFM).subscribe((data: any) => {
        this.helper.Mensaje("success", "Mensaje del Sistema", "Resultado final fue guardado", () => {
        });
      });
    }

  }
  Setear(data: any) {
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;

    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objFM.id_resultado_final = data.id_resultado_final;
    this.objFM.observacion = data.observacion;
    //this.VerificarInicio();
  }
  Imprimir() {
    window.print();
  }
  PUEDE_REGISTRAR: boolean = false;
  VerificarInicio() {
    this.objFM.hora_inicio_evaluacion = this.OBJ_HORA.hora_inicio_evaluacion_ficha;
    this.objFM.hora_termino_evaluacion = this.OBJ_HORA.hora_termino_evaluacion_ficha;


    if (
      (this.OBJ_HORA.hora_termino_evaluacion_an_lab == null) ||
      (this.OBJ_HORA.hora_termino_evaluacion_evaps == null) ||
      (this.OBJ_HORA.hora_termino_evaluacion_evis == null) ||
      (this.OBJ_HORA.hora_termino_evaluacion_evaud == null) ||
      (this.OBJ_HORA.hora_termino_evaluacion_evacl == null)
    ) {
      let mensaje: string = "Aún no se conluye:<br>";

      if (this.OBJ_HORA.hora_termino_evaluacion_an_lab == null) {
        mensaje = mensaje + "- Análisis de Laboratorio.<br>"
      }
      if (this.OBJ_HORA.hora_termino_evaluacion_evaps == null) {
        mensaje = mensaje + "- Evaluación Psicológica.<br>"
      }
      if (this.OBJ_HORA.hora_termino_evaluacion_evis == null) {
        mensaje = mensaje + "- Evaluación Visual.<br>"
      }
      if (this.OBJ_HORA.hora_termino_evaluacion_evaud == null) {
        mensaje = mensaje + "- Evaluación Auditiva.<br>"
      }
      if (this.OBJ_HORA.hora_termino_evaluacion_evacl == null) {
        mensaje = mensaje + "- Análisis Clínico.<br>"
      }

      this.helper.Mensaje("info", "Aviso", mensaje, () => {
        this.PUEDE_REGISTRAR = false;
      });
    }
    else {
      this.PUEDE_REGISTRAR = true;
      this.ValidarHoraIngreso();
    }


  }
  ObtenerHoraMinimaIgreso(): string {
    let arreglo = [
      this.OBJ_HORA.hora_termino_evaluacion_evis,
      this.OBJ_HORA.hora_termino_evaluacion_evaud,
      this.OBJ_HORA.hora_termino_evaluacion_evacl
    ];

    let mayor: any = Number(arreglo[0].replace(":", ""));

    arreglo.forEach((ele: any) => {
      if (ele != null) {
        let hora_numero = Number(ele.replace(":", ""))
        if (hora_numero > mayor) {
          mayor = hora_numero;
        }
      }
    });

    let hora_string = String(mayor);
    let hora_min = "00:00";
    if (hora_string.length == 3) {
      hora_min = hora_string.substring(1, 1) + ":" + hora_string.substring(1, 3);
    }

    if (hora_string.length == 4) {
      hora_min = hora_string.substring(0, 2) + ":" + hora_string.substring(2, 4);
    }

    return hora_min;

  }
  ValidarHoraIngreso() {
    // if(!this.helper.ValidarHoraIngreso(

    //   this.ObtenerHoraMinimaIgreso(),
    //   this.objFM.hora_inicio_evaluacion
    // )){
    //   this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+(this.ObtenerHoraMinimaIgreso())+"</b>",()=>{
    //     document.getElementById("objFM.hora_inicio_evaluacion")?.focus();
    //   });
    // }
  }
}

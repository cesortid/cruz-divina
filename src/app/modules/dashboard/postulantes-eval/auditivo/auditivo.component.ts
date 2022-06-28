import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import { Chart , registerables} from 'chart.js';
import { Funciones } from 'src/app/modules/shared/funciones';
import { NgSelectComponent } from '@ng-select/ng-select';
Chart.register(...registerables);

@Component({
  selector: 'app-auditivo',
  templateUrl: './auditivo.component.html',
  styleUrls: ['./auditivo.component.scss']
})
export class AuditivoComponent implements OnInit {
  ID_FICHA_MEDICA_SNC: number = 0;
  OBJ_FICHA_MEDICA: any = null;
  OBJ_HORA: any = null;
  @ViewChild('ddlOD') ddlOD!: NgSelectComponent;
  @ViewChild('ddlOI') ddlOI!: NgSelectComponent;
  
  objFM = {
    id_evaluacion_auditiva: 0,
    id_ficha_medica_snc: 0,
    fecha_inicio_evaluacion: null,
    hora_inicio_evaluacion: null,
    fecha_termino_evaluacion: null,
    hora_termino_evaluacion: null,
    otoscopia: "NORMAL",
    examen_auditivo_od_250: 0,
    examen_auditivo_od_500: 0,
    examen_auditivo_od_1000: 0,
    examen_auditivo_od_2000: 0,
    examen_auditivo_od_4000: 0,
    examen_auditivo_oi_250: 0,
    examen_auditivo_oi_500: 0,
    examen_auditivo_oi_1000: 0,
    examen_auditivo_oi_2000: 0,
    examen_auditivo_oi_4000: 0,
    oido_derecho: 0,
    oido_izquierdo: 0,
    ambos_oidos: 0,
    id_resultado_observacion_evalauditiva: 4,
    resultado_prueba: true,
    observacion: "NINGUNA",
    activo: true,
    usuario_creacion: sessionStorage.getItem("Usuario"),
    usuario_modificacion: sessionStorage.getItem("Usuario"),

    id_condicion: 0
  };
  cboObservaciones:any=[];

  chart:any;
  data_:any;
  data_OD:any=[];
  data_OI:any=[];

  constructor(private crypto: CryptoService, private rutaActual: ActivatedRoute, private servicio: FichaMedicaService,private helper:Funciones) { }


  ngOnInit(): void {
    if (this.rutaActual.snapshot.paramMap.get('id') != null) {
      let ccc: string;
      ccc = this.rutaActual.snapshot.params.id;
      this.ID_FICHA_MEDICA_SNC = Number(this.crypto.desencriptar(ccc));
      this.CargarConfiguracion(this.ID_FICHA_MEDICA_SNC).then(()=>{
        this.ComprobarExistente().then((rptaExiste: any) => {
          //cargamos los combos 
          this.CargarControles().then((rptaCombos:any)=>{
          if (rptaExiste.existe) {
            this.Setear(rptaExiste.data);
          }else{
            this.SetearSegunCondicion();
          }
          });
        });

      });

    }
    this.data_={
      labels: ["0","500","1000","2000","3000","4000","5000"],
      datasets: [
        {
          label: 'OD',
          data: this.data_OD,
          borderColor: "#FF0000",
          backgroundColor: "#FF0000",
          order: 1,
           type: 'line',
          pointStyle: 'circle',
          pointRadius: 6,
        },
        {
          label: 'OI',
          data: this.data_OD,
          borderColor: "#5B9BD5",
          backgroundColor: "#5B9BD5",
          type: 'line',
          order: 0,
          pointStyle: 'crossRot',
          pointRadius: 10,
        }
      ]
    };
    this.chart=new Chart("myChart",{
      type: 'bar',
      data: this.data_, 
      options: {
        scales: {
          y: {
              suggestedMin: -10,
              suggestedMax: 80,
              reverse: true,
              grid: {
                color: '#000000'
              },
          },
          x: {
            position: 'top',
            grid: {
              color: '#000000'
            },
          }
        },
        responsive: false,
        plugins: {
          tooltip:{
            enabled:false
          },
          legend: {
            position: 'bottom',
            reverse:true
          },
          title: {
            display: true,
            text: 'FRECUENCIA'
          }
        }
      },
    });
  }
  CargarControles(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.servicio.listarEvaluacionAuditivaControl().subscribe((data: any) => {
        this.cboObservaciones=data.resultobsevalauditiva;
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
      //para traer el ultimo registro asociado a la postulacion
      this.servicio.listaEvalAuditiva(param).subscribe((data: any) => {
        if (data.cantidad == 0) {
          resolve({ existe: false, data: null });
        }
        if (data.cantidad > 0) {
          resolve({ existe: true, data: data.listaevaluacionauditiva[0] });
        }
      }, () => {
        reject({ existe: false, data: null });
      });
    });
    return promise;
  }
  SetearSegunCondicion() {
    //id_condicion=1 no profesional
    //id_condicion=2 es profesional
    this.objFM.id_condicion = this.OBJ_FICHA_MEDICA.id_condicion

    this.objFM.examen_auditivo_od_500=25;
    this.objFM.examen_auditivo_od_1000=25;
    this.objFM.examen_auditivo_od_2000=25;


    this.objFM.examen_auditivo_oi_500=25;
    this.objFM.examen_auditivo_oi_1000=25;
    this.objFM.examen_auditivo_oi_2000=25;

    if(this.objFM.id_condicion==2){
      this.objFM.examen_auditivo_od_4000= 25;
      this.objFM.examen_auditivo_oi_4000= 25;
    }

    this.ExmamenAuditivoAmbosOidos();
    
    this.ValidarNegocio();
  }
  ExmamenAuditivoOD(e: any) {
    //validar qeu maximo sea 90
    this.objFM.examen_auditivo_od_500 = e;
    this.objFM.examen_auditivo_od_1000 = e;
    this.objFM.examen_auditivo_od_2000 = e;
    this.objFM.examen_auditivo_od_4000 = (this.objFM.id_condicion == 2) ? e : 0;
    //calcular promedio
    this.objFM.oido_derecho =this.objFM.examen_auditivo_od_500;
    
    setTimeout(()=>{
      this.objFM.ambos_oidos = Math.round((Number(this.objFM.oido_derecho) + Number(this.objFM.oido_izquierdo)) / (2)); ;
      this.ValidarNegocio();
},100);
  }
  ExmamenAuditivoOI(e: any) {
    //validar qeu maximo sea 90
    this.objFM.examen_auditivo_oi_500 = e;
    this.objFM.examen_auditivo_oi_1000 = e;
    this.objFM.examen_auditivo_oi_2000 = e;
    this.objFM.examen_auditivo_oi_4000 = (this.objFM.id_condicion == 2) ? e : 0;
    //calcular promedio
    this.objFM.oido_izquierdo = this.objFM.examen_auditivo_oi_500;
    setTimeout(()=>{
      this.objFM.ambos_oidos = Math.round((Number(this.objFM.oido_derecho) + Number(this.objFM.oido_izquierdo)) / (2));

          this.ValidarNegocio();
    },100);
  }
  ExmamenAuditivoAmbosOidos(){

    this.objFM.oido_derecho =this.objFM.examen_auditivo_od_500;
    this.objFM.oido_izquierdo = this.objFM.examen_auditivo_oi_500;
    setTimeout(()=>{
      this.objFM.ambos_oidos = Math.round((Number(this.objFM.oido_derecho) + Number(this.objFM.oido_izquierdo)) / (2));

          this.ValidarNegocio();
    },100);
  }
  Guardar(con_mensaje:boolean=true) {
    if (this.ValidarFromulario()) {
      if (this.objFM.id_evaluacion_auditiva == 0 || this.objFM.id_evaluacion_auditiva == null) {
        this.servicio.insertarEvaluacionAuditiva(this.objFM).subscribe((data: any) => {
          if(con_mensaje){
            this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Auditiva fue guardada", () => {
              location.reload();
            });            
          }
          else{
              location.reload();
          }



        });
      }
      else {
        this.servicio.modificarEvaluacionAuditiva(this.objFM).subscribe((data: any) => {
          this.helper.Mensaje("success", "Mensaje del Sistema", "La información de Evaluación Auditiva fue guardada", () => {
          });
        });
      }
    }
  }
  ValidarFromulario(): boolean {
    if (this.objFM.hora_inicio_evaluacion == null || this.objFM.hora_inicio_evaluacion == "") {
      this.helper.Mensaje("info","Mensaje del Sistema","Complete la Hora de ingreso de la evaluación", () => {
        document.getElementById('objFM.hora_inicio_evaluacion')?.focus();
      });
      return false;
    }

    if (this.objFM.hora_termino_evaluacion == null || this.objFM.hora_termino_evaluacion == "") {
      // this.helper.Mensaje("info","Mensaje del Sistema", "Complete la Hora de salida de la evaluación", () => {
      //   document.getElementById('objFM.hora_termino_evaluacion')?.focus();
      // });
      // return false;
    }
    else{
      if(this.helper.ValidarRangoTiempo(this.objFM.hora_inicio_evaluacion,this.objFM.hora_termino_evaluacion,"00:15")==false){
        this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el <b>Área de Otorrino</b> debe ser <b>mínimo de 15 minutos</b>",()=>{
        });
        return false;
      }

      if (!this.helper.ValidarHoraTermino(this.objFM.hora_inicio_evaluacion, this.objFM.hora_termino_evaluacion)) {
        this.helper.Mensaje("info","Mensaje del Sistema", "La hora de salida no puede ser menor o igual que la hora de ingreso", () => {
          document.getElementById('objFM.hora_termino_evaluacion')?.focus();
        });
        return false;
      }

    }



    return true;
  }
  Setear(data: any) {


    this.objFM.id_evaluacion_auditiva = data.id_evaluacion_auditiva;
    this.objFM.id_ficha_medica_snc = data.id_ficha_medica_snc;
    this.objFM.fecha_inicio_evaluacion = data.fecha_inicio_evaluacion;
    this.objFM.hora_inicio_evaluacion = data.hora_inicio_evaluacion;
    this.objFM.fecha_termino_evaluacion = data.fecha_termino_evaluacion;
    this.objFM.hora_termino_evaluacion = data.hora_termino_evaluacion;
    this.objFM.otoscopia = data.otoscopia;
    this.objFM.examen_auditivo_od_250 = data.examen_auditivo_od_250;
    this.objFM.examen_auditivo_od_500 = data.examen_auditivo_od_500;
    this.objFM.examen_auditivo_od_1000 = data.examen_auditivo_od_1000;
    this.objFM.examen_auditivo_od_2000 = data.examen_auditivo_od_2000;
    this.objFM.examen_auditivo_od_4000 = data.examen_auditivo_od_4000;
    this.objFM.examen_auditivo_oi_250 = data.examen_auditivo_oi_250;
    this.objFM.examen_auditivo_oi_500 = data.examen_auditivo_oi_500;
    this.objFM.examen_auditivo_oi_1000 = data.examen_auditivo_oi_1000;
    this.objFM.examen_auditivo_oi_2000 = data.examen_auditivo_oi_2000;
    this.objFM.examen_auditivo_oi_4000 = data.examen_auditivo_oi_4000;
    this.objFM.oido_derecho = data.oido_derecho;
    this.objFM.oido_izquierdo = data.oido_izquierdo;
    this.objFM.ambos_oidos = data.ambos_oidos;
    this.objFM.id_resultado_observacion_evalauditiva = data.id_resultado_observacion_evalauditiva;
    this.objFM.resultado_prueba = data.resultado_prueba;
    this.objFM.observacion = data.observacion;
    this.objFM.id_condicion=this.OBJ_FICHA_MEDICA.id_condicion;
    this.PUEDE_REGISTRAR=true;
    this.ValidarNegocio();
  }
  ValidarNegocio(){

    if(this.objFM.id_condicion==1){
      this.data_OD=[
        {x:"500",y:this.objFM.examen_auditivo_od_500},
        {x:"1000",y:this.objFM.examen_auditivo_od_1000},
        {x:"2000",y:this.objFM.examen_auditivo_od_2000}
      ];
      this.data_OI=[
        {x:"500",y:this.objFM.examen_auditivo_oi_500},
        {x:"1000",y:this.objFM.examen_auditivo_oi_1000},
        {x:"2000",y:this.objFM.examen_auditivo_oi_2000}
      ];
    }
    if(this.objFM.id_condicion==2){
      this.data_OD=[
        {x:"500",y:this.objFM.examen_auditivo_od_500},
        {x:"1000",y:this.objFM.examen_auditivo_od_1000},
        {x:"2000",y:this.objFM.examen_auditivo_od_2000},
        {x:"4000",y:this.objFM.examen_auditivo_od_4000}
      ];
      this.data_OI=[
        {x:"500",y:this.objFM.examen_auditivo_oi_500},
        {x:"1000",y:this.objFM.examen_auditivo_oi_1000},
        {x:"2000",y:this.objFM.examen_auditivo_oi_2000},
        {x:"4000",y:this.objFM.examen_auditivo_oi_4000}
      ];
    }


    this.chart.data.datasets[0].data=this.data_OD;
    this.chart.data.datasets[1].data=this.data_OI;
    this.chart.update();
    


    if(

      (this.OBJ_FICHA_MEDICA.id_condicion==1 &&

      (this.objFM.examen_auditivo_od_500>=-20 && this.objFM.examen_auditivo_od_500<=60)  
      && 
      (this.objFM.examen_auditivo_oi_500>=-20 && this.objFM.examen_auditivo_oi_500<=60 )

      ) || 

      (this.OBJ_FICHA_MEDICA.id_condicion==2 &&

        (this.objFM.examen_auditivo_od_500>=-20 && this.objFM.examen_auditivo_od_500<=40)  
        && 
        (this.objFM.examen_auditivo_oi_500>=-20 && this.objFM.examen_auditivo_oi_500<=40 )
  
        )

      ){
      this.objFM.resultado_prueba=true;
    }
    else{
      this.objFM.resultado_prueba=false;
    }
  }
  Imprimir() {
    window.print();
  }

  ValidarRangoExmaneAuditivoOD(){
    //entre 42 y 150
     if(this.objFM.examen_auditivo_od_500>=-20 && this.objFM.examen_auditivo_od_500<=90){
      if(this.objFM.examen_auditivo_od_500>=-20 && this.objFM.examen_auditivo_od_500<=90){
      }

    }
    else{
      this.helper.Mensaje("warning","Aviso","El valor de exámen auditivo no coincide con el rango de valores permitidos",()=>{
       // document.getElementById("objFM.examen_auditivo_od_500")?.focus();
      });
    }
  }

  ValidarRangoExmaneAuditivoOI(){
    //entre 42 y 150
    if(this.objFM.examen_auditivo_oi_500>=-20 && this.objFM.examen_auditivo_oi_500<=90){
    }
    else{
      this.helper.Mensaje("warning","Aviso","El valor de exámen auditivo no coincide con el rango de valores permitidos",()=>{
        //document.getElementById("objFM.examen_auditivo_oi_500")?.focus();
      });
    }
  }
  PUEDE_REGISTRAR:boolean=false;
  VerificarInicio(){
    if(this.OBJ_HORA.hora_termino_evaluacion_evaps==null){
      this.helper.Mensaje("info","Mensaje del Sistema","Aún no se concluye la Evaluación Psicológica del postulante",()=>{
        this.PUEDE_REGISTRAR=false;
      });
    }
    else{

      let verificandoActivoArea=this.VerificarActivoOtraArea(this.OBJ_HORA.hora_termino_evaluacion_evaps,this.OBJ_HORA.hora_inicio_evaluacion_evis,this.OBJ_HORA.hora_termino_evaluacion_evis,this.OBJ_HORA.hora_inicio_evaluacion_evacl,this.OBJ_HORA.hora_termino_evaluacion_evacl,"Visual","Clínica");
      
      if(verificandoActivoArea.activo==false){
        if(!this.helper.ValidarHoraIngreso(
          //this.OBJ_HORA.hora_termino_evaluacion_evaps,
          verificandoActivoArea.hora,
          this.objFM.hora_inicio_evaluacion
        )){
          this.PUEDE_REGISTRAR=false;
          this.helper.Mensaje("error","Aviso","La hora de ingreso no puede ser menor o igual a <b>"+(verificandoActivoArea.hora)+"</b>",()=>{
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

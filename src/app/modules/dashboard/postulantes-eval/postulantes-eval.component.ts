import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';

@Component({
  selector: 'app-postulantes-eval',
  templateUrl: './postulantes-eval.component.html',
  styleUrls: ['./postulantes-eval.component.scss']
})
export class PostulantesEvalComponent implements OnInit, OnDestroy {

  ruta_variable:string="";
  TIEMPO:string="";
  INTERVAL:any;
  constructor( private crypto:CryptoService, private rutaActual:ActivatedRoute,private router:Router, private servicio:FichaMedicaService,private spinner: SpinnerVisibilityService) { }
  ngOnDestroy(): void {
    clearInterval( this.INTERVAL);
  }

  ngOnInit(): void {
    if(this.rutaActual.snapshot.paramMap.get('id') !=null){
      this.ruta_variable=this.rutaActual.snapshot.params.id;

      //si ya existe hora de termino de evaluacion 

      this.CargarConfiguracion(Number(this.crypto.desencriptar(this.ruta_variable))).then((e:boolean)=>{
        if(e){
          this.CargarTiempoTranscurrido(Number(this.crypto.desencriptar(this.ruta_variable)));
          this.INTERVAL=setInterval(()=>{
            this.CargarTiempoTranscurrido(Number(this.crypto.desencriptar(this.ruta_variable)));
          },5000)              
        }
      });


    }
  }
  Navegar(parte_ruta:string):void{
    
    this.router.navigate(['dashboard', 'postulantes','evaluacion',this.ruta_variable,parte_ruta,this.ruta_variable]);
  }
  CargarTiempoTranscurrido(id_ficha_medica_snc:number){
    let param={id_ficha_medica_snc:id_ficha_medica_snc};
    this.spinner.hide();
    this.servicio.listaTiempoTranscurrido(param).pipe().subscribe((data:any)=>{
      this.TIEMPO=data.tiempotranscurrido[0].tiempo_transcurrido.substring(0,8);
    });
  }
  CargarConfiguracion(id_ficha_medica_snc: number): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let param = { "id_ficha_medica_snc": id_ficha_medica_snc };
      //obtener informacion del registro postulante
      this.servicio.obtenerFichaMedica(param).subscribe((data: any) => {
        let hora_termino = data.objhoraevaluacion.hora_termino_evaluacion_ficha;

        if(hora_termino==null){
          resolve(true);
        }
        else{
          resolve(false);
        }
        //this.ValidacionCondicion();
      });
    });
    return promise;
  }

}

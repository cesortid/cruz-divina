import Swal from 'sweetalert2';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export class Funciones {


    Mensaje(tipo: any,titulo:string="Mensaje del sistema", mensaje: any, condicion: any) {
        Swal.fire({
          title: titulo,
          html: mensaje,
          icon: tipo,
          confirmButtonText: 'Ok',
          returnFocus: false,
          showCancelButton: (tipo=="question")?true:false,
          focusCancel: (tipo=="question")?true:false,
        }).then(condicion);
      }
      ValidarHoraTermino(time_inicio:any,time_termino:any):boolean{
        let inicio_hora=Number(time_inicio.split(":")[0]);
        let inicio_minuto=Number(time_inicio.split(":")[1]);
        let termino_hora=Number(time_termino.split(":")[0]);
        let termino_minuto=Number(time_termino.split(":")[1]);

        if(termino_hora<inicio_hora){
          return false;
        }
        if((termino_hora==inicio_hora) && (termino_minuto<=inicio_minuto)){
          return false;
        }

        return true;
      }
      ValidarHoraIngreso(time_termino:any,time_a_validar:any):boolean{
        let termino_hora=Number(time_termino.split(":")[0]);
        let termino_minuto=Number(time_termino.split(":")[1]);

        let time_a_valida_hora=Number(time_a_validar.split(":")[0]);
        let time_a_valida_minuto=Number(time_a_validar.split(":")[1]);



        if(time_a_valida_hora < termino_hora){
          return false;
        }
        if((time_a_valida_hora==termino_hora) && (time_a_valida_minuto<=termino_minuto)){
          return false;
        }
        return true;
      }
      ValidarRangoTiempo(hora_ingreso_:string|null,hora_salida_:string|null,tope_:string):boolean{
          let hora_ingreso:number=Number(hora_ingreso_!.replace(":",""));
          let hora_salida:number=Number(hora_salida_!.replace(":",""));
          let tope:number=Number(tope_.replace(":",""));
      
          if((hora_salida - hora_ingreso)>=tope){
            return true;
          }
          else{
           // this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el área de laboratorio debe ser mínimo 5 minutos",()=>{})
           return false;
          }
      }
      public solo_entero= createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: false,
        decimalSymbol: '.',
        decimalLimit: 0,
        integerLimit: 2,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false
    });
}

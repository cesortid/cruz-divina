import Swal from 'sweetalert2';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export class Funciones {


  Mensaje(tipo: any, titulo: string = "Mensaje del sistema", mensaje: any, condicion: any) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: tipo,
      confirmButtonText: 'Ok',
      returnFocus: false,
      showCancelButton: (tipo == "question") ? true : false,
      focusCancel: (tipo == "question") ? true : false,
    }).then(condicion);
  }
  ValidarHoraTermino(time_inicio: any, time_termino: any): boolean {
    let inicio_hora = Number(time_inicio.split(":")[0]);
    let inicio_minuto = Number(time_inicio.split(":")[1]);
    let termino_hora = Number(time_termino.split(":")[0]);
    let termino_minuto = Number(time_termino.split(":")[1]);

    if (termino_hora < inicio_hora) {
      return false;
    }
    if ((termino_hora == inicio_hora) && (termino_minuto <= inicio_minuto)) {
      return false;
    }

    return true;
  }
  ValidarHoraIngreso(time_termino: any, time_a_validar: any): boolean {
    let termino_hora = Number(time_termino.split(":")[0]);
    let termino_minuto = Number(time_termino.split(":")[1]);

    let time_a_valida_hora = Number(time_a_validar.split(":")[0]);
    let time_a_valida_minuto = Number(time_a_validar.split(":")[1]);



    if (time_a_valida_hora < termino_hora) {
      return false;
    }
    if ((time_a_valida_hora == termino_hora) && (time_a_valida_minuto <= termino_minuto)) {
      return false;
    }
    return true;
  }
  ValidarRangoTiempo(hora_ingreso_: string | null, hora_salida_: string | null, tope_: string, fecha_inicio: string = ""): boolean {

    if (fecha_inicio != null) {

      let f_inicio = fecha_inicio + " " + hora_ingreso_;
      let f_inicio_orden = f_inicio.split("/");
      let n_f_inicio = f_inicio_orden[1] + "-" + f_inicio_orden[0] + "-" + f_inicio_orden[2];
      let fecha1 = new Date(n_f_inicio);

      let hora_final = hora_salida_;
      let hora_final_array = hora_final!.split(":");
      let fecha2 = new Date();
      fecha2.setHours(Number(hora_final_array[0]));
      fecha2.setMinutes(Number(hora_final_array[1]));

      let tope_array = tope_.split(":");
      let tope_milisegundos = (Number(tope_array[0]) * 60 * 60 * 1000) + Number(tope_array[1]) * 60 * 1000;

      console.log(fecha1);
      console.log(fecha2);
      console.log(fecha1.getTime());
      console.log(fecha2.getTime());
      console.log(fecha2.getTime() - fecha1.getTime());

      //Agregamos la hora ingreso a la fecha de inicio y lo convertimos a timestamp
      //hacemos lo mimsmo con la fecha actual y hora de salida

      if ((fecha2.getTime() - fecha1.getTime()) >= tope_milisegundos) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      let hora_ingreso: number = Number(hora_ingreso_!.replace(":", ""));
      let hora_salida: number = Number(hora_salida_!.replace(":", ""));
      let tope: number = Number(tope_.replace(":", ""));

      if ((hora_salida - hora_ingreso) >= tope) {
        return true;
      }
      else {
        // this.helper.Mensaje("info","Mensaje del sistema","El tiempo de duración en el área de laboratorio debe ser mínimo 5 minutos",()=>{})
        return false;
      }
    }


  }
  public solo_entero = createNumberMask({
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
  public entero = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '',
    allowDecimal: false,
    decimalSymbol: '',
    decimalLimit: 0,
    integerLimit: 9,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true
  });
  public dos_decimales = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 2,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: true
  });

  currencyMask_dos_decimales(rawValue: string) {
    let numberMask = createNumberMask({
        prefix: '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: true,
        allowLeadingZeroes: false,
        decimalLimit: 2,
        integerLimit: 2,
    });
    let mask = numberMask(rawValue);

    let decimalsRegex = /\.([0-9]{1,2})/;
    let result = decimalsRegex.exec(rawValue);
    // In case there is only one decimal
    if (result && result[1].length < 2) {
        mask.push('0');
    } else if (!result) {
        mask.push('0');
        mask.push('0');
    }

    return mask;
}
}

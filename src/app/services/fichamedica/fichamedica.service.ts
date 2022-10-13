import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MetodoService } from '../comunes/metodo.service';

@Injectable({
  providedIn: 'root'
})
export class FichaMedicaService {

  constructor(private apiService: MetodoService, private http:HttpClient) { }


  obtenerFichaMedica(param: any) {
    return this.apiService.GET("api/FichaMedica/obtenerFichaMedica", param);
  }


  //  --Listar Control




  //--Listar



  listaEvalPsicometrica() {
    //?ipInput={"id_evaluacion_psicometrica":0,"skip":0,"take":10}
    return this.apiService.GET("api/FichaMedica/listaEvalPsicometrica");
  }


  //--Modificar
  modificarTipoDocumento() {
    //ipInput   {"id_tipo_documento":1,"cod_tipo_documento":"DNI","descripcion":"Documento Nacional de identidad","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarTipoDocumento");
  }
  modificarCondicion() {
    //ipImput    {"id_condicion":1,"cod_condicion":"Profesional","descripcion":"Profesional","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarCondicion");
  }
  modificarEstadoCivil() {
    //ipImput    {"id_estado_civil":2,"cod_estado_civil":"Casado(a)","descripcion":"Casado(a)","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarEstadoCivil");
  }
  modificarCategoria() {
    //ipImput   {"id_categoria":1,"cod_categoria":"AIIa","descripcion":"AIIa","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarCategoria");
  }
  modificarGradoInstruccion() {
    //ipImput   {"id_grado_instruccion":1,"cod_grado_instruccion":"Secundaria Completa","descripcion":"Secundaria Completa","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarGradoInstruccion");
  }
  modificarClase() {
    //?ipInput=ipImput  {"id_clase":1,"cod_clase":"Revalidacion","descripcion":"Revalidacion","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarClase");
  }
  modificarSexo() {
    //ipImput  {"id_sexo":3,"cod_sexo":"Intersexual","descripcion":"Intersexual","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarSexo");
  }
  modificarFactorRh() {
    //ipImput {"id_factor_rh":1,"cod_factor":" + ","descripcion":" + ","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarFactorRh");
  }
  modificarGrupoSanguineo() {
    //ipImput {"id_grupo_sanguineo":1,"cod_grupo_sanguineo":"A","descripcion":"A","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/modificarGrupoSanguineo");
  }



  //--Insertar

  insertarTipoDocumento() {
    //ipInput   {"id_tipo_documento":0,"cod_tipo_documento":"DNI","descripcion":"Documento Nacional de Identidad","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/insertarTipoDocumento");
  }
  insertarCategoria() {
    //ipInput   {"id_categoria":0,"cod_categoria":"AI","descripcion":"AI","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")} 
    return this.apiService.GET("api/Maestra/insertarCategoria");
  }
  insertarCondicion() {
    //ipImput	   {"id_condicion":0,"cod_condicion":"No profesional","descripcion":"No profesional","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/insertarCondicion");
  }
  insertarEstadoCivil() {
    //ipImput   {"id_estado_civil":0,"cod_estado_civil":"Soltero(a)","descripcion":"Soltero(a)","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")} 
    return this.apiService.GET("api/Maestra/insertarEstadoCivil");
  }
  insertarGradoInstruccion() {
    //ipImput   {"id_grado_instruccion":0,"cod_grado_instruccion":"Secundaria Completa","descripcion":"Secundaria completa","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/insertarGradoInstruccion");
  }
  insertarClase() {
    //ipImput   {"id_clase":0,"cod_clase":"Licencia Nueva","descripcion":"Licencia Nueva","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")} 
    return this.apiService.GET("api/Maestra/insertarClase");
  }
  insertarSexo() {
    //ipImput   {"id_sexo":0,"cod_sexo":"Femenino","descripcion":"Femenino","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/insertarSexo");
  }
  insertarFactorRh() {
    //ipImput   {"id_factor_rh":0,"cod_factor":"+","descripcion":"+","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")} 
    return this.apiService.GET("api/Maestra/insertarFactorRh");
  }
  insertarGrupoSanguineo() {
    //ipImput    {"id_grupo_sanguineo":0,"cod_grupo_sanguineo":"O","descripcion":"O","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.GET("api/Maestra/insertarGrupoSanguineo");
  }



  listarProvincia(param: any) {
    //ipInput={"iddpto":"01"}
    return this.apiService.GET("api/FichaMedica/listarProvincia", param);
  }
  listarDistrito(param: any) {
    //ipInput={"iddpto":"01","idprov":"0101"}
    return this.apiService.GET("api/FichaMedica/listarDistrito", param);
  }

  listarClase(param: any) {
    return this.apiService.GET("api/FichaMedica/listarClase", param);
  }
  listarCategoria(param: any) {
    return this.apiService.GET("api/FichaMedica/listarCategoria", param);
  }
  validarPostulanteDni(param: any) {
    return this.apiService.GET("api/FichaMedica/validarPostulanteDni", param);
  }

  validarPostulanteNombre(param: any) {
    return this.apiService.GET("api/FichaMedica/validarPostulanteNombre", param);
  }



  //ANEXO 01
  listarFichaMedicaControl() {
    return this.apiService.GET("api/FichaMedica/listarFichaMedicaControl");
  }
  insertarFichamedica(param: any) {
    //?ipInput={"id_ficha_medica_snc":0,"numero_informe":null,"numero_snc":null,"fecha_informe":null,"fecha_inicio_evaluacion":null,"hora_inicio_evaluacion":null,"fecha_termino_evaluacion":null,"hora_termino_evaluacion":null,"id_resultado_test_palanca":0,"id_tipo_documento":1,"numero_documento":1,"apellido_paterno":"Rojas","apellido_materno":"Munive","nombres":"Gabriela","id_sexo":1,"telefono":999999999,"direccion":"Av. Lima 123","iddpto":null,"idprov":null,"iddist":null,"id_grado_instruccion":1,"otro_grado_instruccion":null,"id_estado_civil":1,"ocupacion":null,"id_clase":1,"id_categoria":1,"id_condicion":1,"hora_inicio":null,"hora_fin":null,"filiacion":null,"activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/insertarFichamedica", param);
  }
  Modificarfichamedica(param: any) {
    //?ipInput={"id_ficha_medica_snc":0,"numero_informe":null,"numero_snc":null,"fecha_informe":null,"fecha_inicio_evaluacion":null,"hora_inicio_evaluacion":null,"fecha_termino_evaluacion":null,"hora_termino_evaluacion":null,"id_resultado_test_palanca":0,"id_tipo_documento":1,"numero_documento":1,"apellido_paterno":"Rojas","apellido_materno":"Munive","nombres":"Gabriela","id_sexo":1,"telefono":999999999,"direccion":"Av. Lima 123","iddpto":null,"idprov":null,"iddist":null,"id_grado_instruccion":1,"otro_grado_instruccion":null,"id_estado_civil":1,"ocupacion":null,"id_clase":1,"id_categoria":1,"id_condicion":1,"hora_inicio":null,"hora_fin":null,"filiacion":null,"activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/Modificarfichamedica", param);
  }

  //LISTADO DE POSTULANTES
  listaFichaMedica(param: any) {
    // api/FichaMedica/listaFichaMedica  {"id_ficha_medica_snc":0,"id_tipo_documento":0,"numero_informe":"","numero_documento":"","apellido_paterno":"","apellido_materno":"","nombres":"","skip":0,"take":10}
    return this.apiService.GET("api/FichaMedica/listaFichaMedica", param);
  }


  //LABOTARORIO
  listarAnalisisLaboratorioControl() {
    return this.apiService.GET("api/FichaMedica/listarAnalisisLaboratorioControl");
  }
  insertarAnalisisLaboratorio(param: any) {
    return this.apiService.POST("api/FichaMedica/insertarAnalisisLaboratorio", param);
  }
  modificarAnalisisLaboratorio(param: any) {
    return this.apiService.POST("api/FichaMedica/modificarAnalisisLaboratorio", param);
  }
  listaAnalisisLaboratorio(param: any) {
    return this.apiService.GET("api/FichaMedica/listaAnalisisLaboratorio", param);
  }


  //EVALUACION PSICOLOGICA
  listaEvalPsicologica(param:any) {
    //?ipInput={"id_evaluacion_psicologica":0,"skip":0,"take":10}
    return this.apiService.GET("api/FichaMedica/listaEvalPsicologica",param);
  }
  listarEvaluacionPsicologicaControl(){
    return this.apiService.GET("api/FichaMedica/listarEvaluacionPsicologicaControl");
  }
  insertarEvaluacionPsicologica(param: any) {
    //  ?ipInput={"id_evaluacion_psicologica":0,"id_ficha_medica_snc":1,"fecha_inicio_evaluacion":null,"hora_inicio_evaluacion":null,"fecha_termino_evaluacion":null,"hora_termino_evaluacion":null,"id_resultado_test_palanca":null,"id_resultado_reactimetro":null,"id_resultado_test_punteo":null,"wechsler":null,"id_resultado_benton_formac":null,"test_matrices_progresivas":null,"test_dominios_anstey":null,"id_resultado_test_otis":null,"id_resultado_test_proyectivo":null,"test_npf":null,"id_resultado_inventario_personalidad":null,"id_resultado_test_audit":null,"cuestionario_inventario_cambios":null,"id_resultado_test_personaarma":null,"resultado_prueba":true,"observacion":null,"activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/insertarEvaluacionPsicologica", param);
  }
  modificarEvalPsico(param: any) {
    //  ipImput {"id_evaluacion_psicologica":0,"id_ficha_medica_snc":1,"fecha_inicio_evaluacion":null,"hora_inicio_evaluacion":null,"fecha_termino_evaluacion":null,"hora_termino_evaluacion":null,"id_resultado_test_palanca":null,"id_resultado_reactimetro":null,"id_resultado_test_punteo":null,"wechsler":null,"id_resultado_benton_formac":null,"test_matrices_progresivas":null,"test_dominios_anstey":null,"id_resultado_test_otis":null,"id_resultado_test_proyectivo":null,"test_npf":null,"id_resultado_inventario_personalidad":null,"id_resultado_test_audit":null,"cuestionario_inventario_cambios":null,"id_resultado_test_personaarma":null,"resultado_prueba":true,"observacion":null,"activo":true,"usuario_modificacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/modificarEvalPsico", param);
  }
  anularEvaluacionPsicologica(param: any) {
    //  ipImput  {"id_evaluacion_psicologica":1,"usuario_eliminacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/anularEvaluacionPsicologica", param);
  }


  //HP PSICOLOGICA 1 y 2
  listaHistoriaClinica(param:any){
    return this.apiService.GET("api/FichaMedica/listaHistoriaClinica", param);
  }
  listarHistoriaClinicaControl(){
    return this.apiService.GET("api/FichaMedica/listarHistoriaClinicaControl");
  }
  insertarHistoriaClinica(param:any){
    return this.apiService.POST("api/FichaMedica/insertarHistoriaClinica",param);
  }
  modificarHistoriaClinica(param:any){
    return this.apiService.POST("api/FichaMedica/modificarHistoriaClinica",param);
  }
  anularHistoriaClinica(param:any){
    return this.apiService.POST("api/FichaMedica/anularHistoriaClinica",param);
  }


  //EVALUACION VISUAL
  listaEvalVisual(param:any) {
    return this.apiService.GET("api/FichaMedica/listaEvalVisual",param);
  }

  listarEvaluacionVisualControl() {
    return this.apiService.GET("api/FichaMedica/listarEvaluacionVisualControl");
  }
  insertarEvaluacionVisual(param:any){
    return this.apiService.POST("api/FichaMedica/insertarEvaluacionVisual",param);
  }
  modificarEvalVisual(param:any){
    return this.apiService.POST("api/FichaMedica/modificarEvalVisual",param);
  }
  // [Post]
  // api/FichaMedica/anularEvaluacionVisual
  // ipImput {"id_evaluacion_visual":1,"usuario_eliminacion":sessionStorage.getItem("Usuario")}




  //EVALUACION AUDITIVA
  listaEvalAuditiva(param:any) {
    return this.apiService.GET("api/FichaMedica/listaEvalAuditiva",param);
  }
  listarEvaluacionAuditivaControl() {
    return this.apiService.GET("api/FichaMedica/listarEvaluacionAuditivaControl");
  }
  insertarEvaluacionAuditiva(param:any){
    //{"id_evaluacion_auditiva":0,"id_ficha_medica_snc":null,"fecha_inicio_evaluacion":null,"hora_inicio_evaluacion":null,"fecha_termino_evaluacion":null,"hora_termino_evaluacion":null,"otoscopia":"na","examen_auditivo_od_250":0,"examen_auditivo_od_500":0,"examen_auditivo_od_1000":0,"examen_auditivo_od_2000":0,"examen_auditivo_od_4000":0,"examen_auditivo_oi_250":0,"examen_auditivo_oi_500":0,"examen_auditivo_oi_1000":0,"examen_auditivo_oi_2000":0,"examen_auditivo_oi_4000":0,"oido_derecho":0,"oido_izquierdo":0,"ambos_oidos":0,"id_resultado_observacion_evalauditiva":null,"resultado_prueba":true,"observacion":"ninguna","activo":true,"usuario_creacion":sessionStorage.getItem("Usuario")}
    return this.apiService.POST("api/FichaMedica/insertarEvaluacionAuditiva",param);
  }
  modificarEvaluacionAuditiva(param:any){
    return this.apiService.POST("api/FichaMedica/modificarEvaluacionAuditiva",param);
  }
// [Post]
// api/FichaMedica/anularEvaluacionAuditiva
// ipImput {"id_evaluacion_auditiva":1,"usuario_eliminacion":sessionStorage.getItem("Usuario")}



//EVALUACION CLINICA I

listarEvaluacionClinicaControl() {
  return this.apiService.GET("api/FichaMedica/listarEvaluacionClinicaControl");
}
listarEvaluacionClinica(param:any) {
  return this.apiService.GET("api/FichaMedica/listarEvaluacionClinica",param);
}

insertarEvaluacionClinica(param:any) {
  return this.apiService.POST("api/FichaMedica/insertarEvaluacionClinica",param);
}
modificarEvalClinica(param:any) {
  return this.apiService.POST("api/FichaMedica/modificarEvalClinica",param);
}
// [Post]
// api/FichaMedica/anularEvaluacionClinica
// ipImput   {"id_evaluacion_clinica":1,"usuario_eliminacion":sessionStorage.getItem("Usuario")}


//EVALUACION CLINICA II Y III
listarAntropometriaControl() {
  return this.apiService.GET("api/FichaMedica/listarAntropometriaControl");
}
listaAntropometria(param:any) {
  return this.apiService.GET("api/FichaMedica/listaAntropometria",param);
}
insertarAntropometria(param:any) {
  return this.apiService.POST("api/FichaMedica/insertarAntropometria",param);
}
modificarAntropometria(param:any) {
  return this.apiService.POST("api/FichaMedica/modificarAntropometria",param);
}
// [Post]
// anularAntropometria
// ipImput {"id_antropometria":1,"usuario_eliminacion":sessionStorage.getItem("Usuario")}

//RESULTADO FINAL

  listar_result_final(param: any) {
    return this.apiService.GET("api/FichaMedica/listar_result_final", param);
  }
  insertarResultadoFinal(param:any) {
    return this.apiService.POST("api/FichaMedica/insertarResultadoFinal",param);
  }
  modificarResultFinal(param:any) {
    return this.apiService.POST("api/FichaMedica/modificarResultFinal",param);
  }
  // [9:31 p. m., 11/2/2022] Fredy Huali: anularResultadoFinal

  listaTiempoTranscurrido(param:any) {
    return this.apiService.GET("api/FichaMedica/listaTiempoTranscurrido",param);
  }
  prueba(){
    return this.http.get("https://rural.vivienda.gob.pe:8080/api/encuestaccpp/00/0/100");
  }
}

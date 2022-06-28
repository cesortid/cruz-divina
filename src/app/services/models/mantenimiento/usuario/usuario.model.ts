export class FiltroMantenimientoUsuario {
    persona: string = "";
    id_perfil: number = 0;
    dni: string = "";
    num_pagina: number = 0;
    num_filas: number = 10;
}
export class UsuarioResetearClave {
    id_usuario: number = 0;
    nuevaClave: string = "";
    repetirClave: string = "";
}

export class Usuario {
    id_usuario: number = 0;
    dni!: string;
    apellido_paterno!: string;
    apellido_materno!: string;
    nombre!: string;
    usuario!: string;
    usuario_creacion!: string;
    usuario_modificacion!: string;
    id_perfil!: number;
    foto!: string;
    id_padre!: number;
    id_perfil_padre!: number;
    correo!: Correo[];
    telefono!: Telefono[];
    departamento!: Departamento[];
    activo!: string;
    id_resp_expd_tecn_funcion!: number;
    id_resp_expd_tecn!: number;
    id_proyecto_detalle!: number;
    perfiles!:any[];
}
export class Correo {
    id_resp_expd_tecn_correo?: number;
    correo_electronico!: string;
    usuario_creacion!: string;
    usuario_modificacion?: string;
    usuario_anulacion?: string;
    id_usuario_correo?: number;
    estado?: boolean;
}
export class Telefono {
    id_resp_expd_tecn_telef?: number;
    numero_telefono!: string;
    usuario_creacion!: string;
    usuario_modificacion?: string;
    usuario_anulacion?: string;
    id_usuario_telefono?: number;
    estado?: boolean;
}
export class Departamento {
    coddepa!: string;
    codprov!: string;
    usuario_creacion?: string;
    usuario_modificacion?: string;
    usuario_eliminacion?: string;
    //id_usuario_departamento?: number;
    id_detalle_perfil_usuario?: number;
    activo?: boolean;
}
export class Perfiles {
    id_perfil?: number;
}

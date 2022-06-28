export class Perfiles {
    public id_perfil!: number;
    public id_organismo!: number;
    public descripcion!: string;
    public flag_etapa!: boolean;
    public usuario_creacion!: string;
    public usuario_modificacion!: string;
    public usuario_eliminacion!: string;
}

export class ModalAsignacion{
    public id_perfil!: number;
	public id_menu!: number;
}
export class AsignacionComponente{
    public id_detalle_perfil_menu_componente!: number;
    public id_componente!: number;
    public id_detalle_perfil_menu!: number;
    public visible!: boolean;
    public usuario_creacion!: string;
    public usuario_modificacion!: string;
    public usuario_anulacion!: string;
}
export class ModalAsignacionComponente{
    public id_perfil!: number;
	public id_componente!: number;
}
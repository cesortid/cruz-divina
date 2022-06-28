export class MenuModal{
    public id_menu!: number
	public nombre_menu!: string
    public url!: string
    public nivel!: number
    public orden!: number
    public id_menu_padre!: number
    public activo!: boolean
    public icono!: string
}

export class Menu{
    public id_menu!: number
	public nombre_menu!: string
    public url!: string
    public nivel!: number
    public orden!: number
    public id_menu_padre!: number
    public activo!: boolean
    public icono!: string
    public usuario_creacion!: string
    public usuario_modificacion!: string
    public usuario_anulacion!: string
}
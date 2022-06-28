import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import { LoginService } from 'src/app/services/login/login.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formUsu!: FormGroup;

  usuario = {
    usuario: "",
    password: ""
  };

  constructor(private servicio: LoginService,private formBuilder: FormBuilder,private router:Router, private fms:FichaMedicaService) {
  }

  ngOnInit(): void {
    this.formUsu = this.formBuilder.group({
      usuario: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.fms.prueba().subscribe((data:any)=>{
      console.log(data);
    });
  }
  ValidarUsuario() {
    let messsage:HTMLElement= document.getElementById("form-login-message") as HTMLElement;
    this.servicio.validarLogin(this.formUsu.get("usuario")?.value, this.formUsu.get("password")?.value).subscribe((data: any) => {
      if(data.hasOwnProperty("error")){
        messsage.innerText="Usuario y contraseño no coinciden";
        setTimeout(()=>{messsage.innerText="";},3000);
      }
      else{


          //GUARDAR INFO EN SESSION y redirigir
          sessionStorage.setItem("Usuario",data.usuario);
          sessionStorage.setItem("IdUsuario",data.id_usuario);
          sessionStorage.setItem("Nombre",data.nombre+' '+data.apellido_paterno);
          sessionStorage.setItem("token",data.access_token);
          sessionStorage.setItem("Menus",data.menus);
          sessionStorage.setItem("Componentes",data.componentes);


          // access_token: "g1L2lyiGowr60Jd-0tTCq5GuPPBDpfVXUBmpFsI2Q3gVv4E8dD9HK4GQ50E07bOvl9aXaI4YCEHgk6lH3Eu9AwSbaLhwU8POsnJpBZOFYpbnTvxsbfl-0nkqHr2ZCGkgvU7iBMbp8d0936HWj9Ctz0_bBo4w1yNvBsr6IYxSWRJH6p6sOn1tCMDrqVqnwISc4jqffbxoeH9tXShnqz6yCZE30A126zgtpqKKBbtnGQIaWbaA3qhK0FfIvNMxNc_b6ZtRkUbfGvlnG3JVZ7d08uU_I5IlhWh3pVa2QAMEc-GC6LjasGUNSDqiTwTq_ACtw1bnPfGCGKDY9A-sABGkTvwT9CVG6MfZJZSHwJ8ApuHwUxkdxQAtWqNi2s3MzIOBkU2ELyUF7lYFVvezw9i1qPMIuYs_4RS8NpIUt2eItX3ot7LkiRZoSn9F8YL8OrKzYAxUH6hp-I6rvEBuAgv37vKWlFlpwateLpLG78W94YioonoxcTonVcraUs0L5xK9Kzj1kB7z1a1976frDLV2PAGIxyxLQ5kPaGYrymP5GA4DMUPhcmw6L2f_MyQTPrRUOL_ney6Mz-WCIo7KKctOkgQHASjrMRfDohHzIk6ZGp9ae0akLc9V-tC62r9ZNMH-wGvOurnazLbXJCGtoIr8vGa6vRQVifjE3CyrcliQ0RCZIBHKMVJfSiWtVA6FJQeNBemr0mMxPcLp0tXX2aKJKYF_NnWrxdmMgK2BJgxuzihboOZES3vq6_scYOYNQ5e3NGW5WqFD-Rzvn5ZamkHq6Q"
          // apellido_materno: "VELIZ"
          // apellido_paterno: "HUALI"
          // cambio_clave: "True"
          // cod_perfil: "PE001"
          // componentes: "[]"
          // correo: "[]"
          // departamento: "[]"
          // expires_in: 14399
          // fecha_modificacion: ""
          // id_padre: ""
          // id_perfil: "5"
          // id_usuario: "4"
          // menus: "[{\"Id_Menu\":13,\"Nombre_Menu\":\"Accidente de Tránsito\",\"Url\":\"/registro\",\"Nivel\":0,\"Orden\":1,\"Id_Menu_Padre\":0,\"Icono\":\"mdi-car-multiple\"},{\"Id_Menu\":8,\"Nombre_Menu\":\"Mantenimiento\",\"Url\":\"#\",\"Nivel\":0,\"Orden\":2,\"Id_Menu_Padre\":0,\"Icono\":\"mdi mdi-cog-outline\"},{\"Id_Menu\":9,\"Nombre_Menu\":\"Menu\",\"Url\":\"/mantenimiento/menus\",\"Nivel\":1,\"Orden\":1,\"Id_Menu_Padre\":8,\"Icono\":\"mdi mdi mdi-menu\"},{\"Id_Menu\":10,\"Nombre_Menu\":\"Perfiles\",\"Url\":\"/mantenimiento/perfiles\",\"Nivel\":1,\"Orden\":2,\"Id_Menu_Padre\":8,\"Icono\":\"mdi mdi mdi-account-box\"},{\"Id_Menu\":11,\"Nombre_Menu\":\"Usuarios\",\"Url\":\"/mantenimiento/usuarios\",\"Nivel\":1,\"Orden\":3,\"Id_Menu_Padre\":8,\"Icono\":\"mdi mdi mdi-account-group\"},{\"Id_Menu\":12,\"Nombre_Menu\":\"Componentes\",\"Url\":\"/mantenimiento/componentes\",\"Nivel\":1,\"Orden\":4,\"Id_Menu_Padre\":8,\"Icono\":\"mdi mdi mdi-video-input-component\"}]"
          // nombre: "FREDDY"
          // perfil: "ADMINISTRADOR"
          // telefono: "[]"
          // token_type: "bearer"
          // usuario: "sessionStorage.getItem("Usuario")"


          this.router.navigate(["dashboard"]);
      }
    },()=>{
      messsage.innerText="Usuario y contraseño no coinciden";
      setTimeout(()=>{messsage.innerText="";},3000);
    });
    //this.router.navigate(["dashboard"]);
  }


  public getError(controlName: string): string {
    let error = '';
    let controls = this.formUsu.get(controlName);
    if(controls!=null){
      // if (controls.touched && controls.errors != null) {
      //    error = JSON.stringify(controls.errors);
      // } 
      if (!controls.valid && (controls.touched || controls.dirty)) {
        error = " Campo requerido";
       // error = JSON.stringify(controls.errors);
      }       
    }
 
    return error;
  }
  ValidarFormulario(){
    this.formUsu.markAllAsTouched();
    this.formUsu.updateValueAndValidity();
    if (this.formUsu.valid) {
      this.ValidarUsuario();
    }
    // else{
    // }
  }
}

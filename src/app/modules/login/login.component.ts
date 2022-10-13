import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
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

  constructor(private servicio: LoginService,private formBuilder: FormBuilder,private router:Router, private fms:FichaMedicaService,private crypto:CryptoService) {
  }

  ngOnInit(): void {
    this.formUsu = this.formBuilder.group({
      usuario: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
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



          let organizacion=JSON.parse(data.organizacion);
            console.log(organizacion);

          let es_nacional=this.crypto.encriptar(String(organizacion[0].Es_Nacional));
          let sede_depa=this.crypto.encriptar(JSON.stringify(organizacion[0].Sede_Depa));
          
          sessionStorage.setItem("Org_1",es_nacional);
          sessionStorage.setItem("Org_2",sede_depa);



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

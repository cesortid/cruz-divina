import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  app={
    nombre_usuario:sessionStorage.getItem('Nombre')
  };
  constructor(private router:Router) { }
  menu:any=[];
  ngOnInit(): void {


    if(sessionStorage.getItem("Menus")!=null){
      let info=JSON.parse(sessionStorage.getItem("Menus")!);
      this.menu=this.getJSONmenu(info);
    }
  }
  MenuInteractivo(){
    document.getElementsByClassName("side-bar")[0].classList.toggle('active');
  }

  getJSONmenu(data: any):any {

    // Icono: "bi bi-file-earmark-person-fill"
    // Id_Menu: 14
    // Id_Menu_Padre: 0
    // Nivel: 0
    // Nombre_Menu: "Postulantes"
    // Orden: 1
    // Url: "/postulantes"


    let menu:any;
    let i:number=0;
    let item:any;
    let rpta:any=[];
    for (i=0;i<data.length;i++)
    {
      item = data[i];
    
      if (item["Nivel"]==0)
      {
        item.hijos=this.cargarMenu(item,data,item["Id_Menu"],(item["Nivel"]+1));
        rpta.push({"trama":item});
      }
    }
    return rpta; 
  }

  cargarMenu(itempadre:any,_data:any,_id_menu:any,_nivel:any)
  {
    let i:number=0;
    let item:any;
    let submenu=[];
    //let items=[];
    
    for (i=0;i<_data.length;i++)
    {
      item = _data[i];
      if (item["Id_Menu_Padre"] == _id_menu && item["Nivel"] == _nivel)
      {
        item.hijos=this.cargarMenu(item,_data,item["Id_Menu"],(item["Nivel"]+1));
        submenu.push({"trama":item});
        //submenu.push({"trama":item,"hijos":this.cargarMenu(item,_data,item["id_menu"],(item["nivel"]+1))});
      }
    }

    return submenu;
  }
  Salir(){
    sessionStorage.clear();
    this.router.navigate(["login"]);  
  }

}

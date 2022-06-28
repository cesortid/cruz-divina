import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CryptoService } from 'src/app/services/comunes/crypto.service';
import { FichaMedicaService } from 'src/app/services/fichamedica/fichamedica.service';
import { Anexo01Component } from '../postulantes-eval/anexo01/anexo01.component';

@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.component.html',
  styleUrls: ['./postulantes.component.scss']
})
export class PostulantesComponent implements OnInit {
  // @HostListener('window:beforeunload', ['$event'])
  bsModalRef? :BsModalRef;

  itemxPagina: number = 10;
  totalRegistros:number=0;
  buscarDesde:number = 0;
  lstPostulantes:any=[];
  filtro={
    "id_ficha_medica_snc":0,
    "id_tipo_documento":0,
    "numero_informe":"",
    "numero_documento":"",
    "apellido_paterno":"",
    "apellido_materno":"",
    "nombres":"",
    "skip":this.buscarDesde,
    "take":this.itemxPagina
  };

  cboTipoDocumento:any=[];


  constructor(private router:Router, private crypto:CryptoService, private modalService: BsModalService , private servicio:FichaMedicaService) { 
  }

  // WindowBeforeUnoad($event: any) {
  //   return false;  
  // }

// beforeunload(event:any) {
//     return true;
//   }


  ngOnInit(): void {
    this.Busqueda();
    this.CargarCombos();


  }
  EvaluarPostulante(e:any){
   this.router.navigate(['dashboard', 'postulantes','evaluacion',this.crypto.encriptar(e.toString())]);
  }

  Abriranexo01(){
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-xl modal-anexo01',
      initialState: {
        //arrPaquetesSeleccionadosEnvioModal: list
        // , activarFormacion: false
      }
    };

    this.bsModalRef = this.modalService.show(Anexo01Component, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any)=> {
        this.Busqueda();
      }
    );
  }

  Busqueda(){
    //let param={"id_ficha_medica_snc":0,"id_tipo_documento":0,"numero_informe":"","numero_documento":"","apellido_paterno":"","apellido_materno":"","nombres":"","skip":this.buscarDesde,"take":this.itemxPagina};
    this.servicio.listaFichaMedica(this.filtro).subscribe((data:any)=>{
      this.totalRegistros=data.cantidad;
      this.lstPostulantes=data.listafichamedica;
    });
  }

  cambiarPagina(pagina:any) {

    this.buscarDesde = ((pagina.page - 1) * this.itemxPagina);
    this.filtro.skip=this.buscarDesde;
    this.Busqueda();
  }
  CargarCombos(){
    this.servicio.listarFichaMedicaControl().subscribe((data:any)=>{
      this.cboTipoDocumento=data.resulttipodocumento;
    });
  }
  Editar(item:any){
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-xl modal-anexo01',
      initialState: {
        OBJETO_EDITAR: item
      }
    };

    this.bsModalRef = this.modalService.show(Anexo01Component, config);
    this.bsModalRef.content.retornoValores.subscribe(
      (data:any)=> {
        this.Busqueda();
      }
    );
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-homonimos',
  templateUrl: './homonimos.component.html',
  styleUrls: ['./homonimos.component.scss']
})
export class HomonimosComponent implements OnInit {

  @Output() retornoValores = new EventEmitter();
  lstHomonimos:any=[];

  constructor(private BsModalRef_me:BsModalRef) { }

  ngOnInit(): void {
  }
  Cerrar(){
    this.BsModalRef_me.hide();
  }
  Seleccionar(fila:any){
    this.retornoValores.emit(fila);
    this.Cerrar();
  }
  Mantener(){
    this.retornoValores.emit(false);
    this.Cerrar();
  }
}

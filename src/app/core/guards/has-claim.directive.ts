import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[hasClaim]'
})
export class HasClaimDirective {
  @Input() set hasClaim(claimType: any) {
    let auth:any=[];
    auth = JSON.parse(sessionStorage.getItem("Componentes")!);
    if (auth != null) {
        let infoClaim = auth.filter((c:any) => c.Nombre_Componente.toLowerCase() == claimType.toLowerCase());
        if(infoClaim.length>0){
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else{
          this.viewContainer.clear();
        }
    }
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
}

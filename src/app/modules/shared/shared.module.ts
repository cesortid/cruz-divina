import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TreeviewModule } from 'ngx-treeview';
import { HasClaimDirective } from 'src/app/core/guards/has-claim.directive';


@NgModule({
  declarations: [
    HasClaimDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    NgSelectModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    TreeviewModule.forRoot(),

  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    HasClaimDirective,
    TabsModule,
    NgSelectModule,
    PaginationModule,
    TooltipModule,
    TreeviewModule
  ]
})
export class SharedModule { }

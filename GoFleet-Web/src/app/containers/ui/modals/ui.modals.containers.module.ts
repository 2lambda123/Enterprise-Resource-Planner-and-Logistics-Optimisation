import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalTemplateComponent } from './modal-template/modal-template.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { ModalNestedComponent } from './modal-nested/modal-nested.component';
import { ModalLongContentComponent } from './modal-long-content/modal-long-content.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalCustomCssComponent } from './modal-custom-css/modal-custom-css.component';
import { ModalAnimationComponent } from './modal-animation/modal-animation.component';
import { ModalEscComponent } from './modal-esc/modal-esc.component';
import { ModalPopoverTooltipComponent } from './modal-popover-tooltip/modal-popover-tooltip.component';
import { ModalBackdropComponent } from './modal-backdrop/modal-backdrop.component';
import { ModalChangeClassComponent } from './modal-change-class/modal-change-class.component';
import { ModalDirectiveComponent } from './modal-directive/modal-directive.component';
import { ModalSizesComponent } from './modal-sizes/modal-sizes.component';
import { ModalChildComponent } from './modal-child/modal-child.component';
import { ModalInnerComponent } from './modal-component/modal-inner-component';
import { ModalModule } from 'ngx-bootstrap/modal';


import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';


@NgModule({
  declarations: [
    ModalTemplateComponent,
    ModalComponentComponent,
    ModalNestedComponent,
    ModalLongContentComponent,
    ModalConfirmComponent,
    ModalCustomCssComponent,
    ModalAnimationComponent,
    ModalEscComponent,
    ModalPopoverTooltipComponent,
    ModalBackdropComponent,
    ModalChangeClassComponent,
    ModalDirectiveComponent,
    ModalSizesComponent,
    ModalChildComponent,
    ModalInnerComponent
  ],
  imports: [
    NgxDatatableModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    SharedModule, 
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [],
  entryComponents: [ModalInnerComponent],
  exports: [
    ModalTemplateComponent,
    ModalComponentComponent,
    ModalNestedComponent,
    ModalLongContentComponent,
    ModalConfirmComponent,
    ModalCustomCssComponent,
    ModalAnimationComponent,
    ModalEscComponent,
    ModalPopoverTooltipComponent,
    ModalBackdropComponent,
    ModalChangeClassComponent,
    ModalDirectiveComponent,
    ModalSizesComponent,
    ModalChildComponent
  ]
})

export class UiModalsContainersModule { }

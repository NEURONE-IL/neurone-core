import { Injector, Input, NgModule } from '@angular/core';
import { NeuroneAngularComponentsComponent, SafePipe } from './neurone-angular-components.component';
import { NeuroneNavbarComponent } from './neurone-navbar/neurone-navbar.component';
import { NeuroneFormsComponent } from './neurone-forms/neurone-forms.component';
import { NeuroneSerpComponent } from './neurone-serp/neurone-serp.component';
import { NeuroneSynthesisComponent } from './neurone-synthesis/neurone-synthesis.component';
import { MouseLogDirective } from './neurone-logger/mouse.directive';
import { NeuroneInputLimiter } from './neurone-input-limiter.directive';
import { KeyboardLogDirective } from './neurone-logger/keyboard.directive';
import { ScrollLogDirective } from './neurone-logger/scroll.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMATS } from './neurone-forms/custom-date-format';

import { createCustomElement } from '@angular/elements';
import { AuthInterceptor } from './auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgxWigModule } from 'ngx-wig';

@NgModule({
  declarations: [
    NeuroneAngularComponentsComponent,
    NeuroneNavbarComponent,
    NeuroneFormsComponent,
    MouseLogDirective,
    KeyboardLogDirective,
    ScrollLogDirective,
    NeuroneInputLimiter,
    NeuroneSerpComponent,
    SafePipe,
    NeuroneSynthesisComponent,

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatToolbarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWigModule
  ],
  exports: [
    NeuroneAngularComponentsComponent,
    NeuroneNavbarComponent,
    NeuroneFormsComponent,
    NeuroneSerpComponent,
    NeuroneSynthesisComponent,
    MouseLogDirective,
    KeyboardLogDirective,
    ScrollLogDirective,
    NeuroneInputLimiter
  ],
  providers: [
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: "outline"} },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class NeuroneAngularComponentsModule {

  constructor (private injector: Injector) {
      const elements: any[] = [
      [NeuroneNavbarComponent, "neurone-navbar"],
      [NeuroneFormsComponent, "neurone-forms"],
      [NeuroneSerpComponent, "neurone-serp"],
      [NeuroneSynthesisComponent, "neurone-synthesis"]
      /*
      [InputComponent, "neurone-forms-input"],
      [ParagraphComponent, "neurone-forms-paragraph"],
      [MultipleChoiceComponent, "neurone-forms-multiple-choice"],
      [MultipleCheckboxComponent, "neurone-forms-multiple-checkbox"],
      */
    ]

    for (const [component, name] of elements){
      const navbarElem = createCustomElement(component, {injector: this.injector});
      customElements.define(name, navbarElem);
    }
  }

}

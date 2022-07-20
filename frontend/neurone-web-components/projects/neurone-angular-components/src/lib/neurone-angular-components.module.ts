import { Injector, NgModule } from '@angular/core';
import { NeuroneAngularComponentsComponent } from './neurone-angular-components.component';
import { NeuroneNavbarComponent } from './neurone-navbar/neurone-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { createCustomElement } from '@angular/elements';
import { AuthInterceptor } from './auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    NeuroneAngularComponentsComponent,
    NeuroneNavbarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule
  ],
  exports: [
    NeuroneAngularComponentsComponent,
    NeuroneNavbarComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
})
export class NeuroneAngularComponentsModule {

  constructor (private injector: Injector) {
      const elements: any[] = [
      [NeuroneNavbarComponent, "neurone-navbar"],
      /*
      [NeuroneFormsComponent, "neurone-forms"],
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

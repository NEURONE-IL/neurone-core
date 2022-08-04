import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';

/* // TODO: deprecated, consider removing
import { InputComponent } from './neurone-forms-old/input/input.component';
import { ParagraphComponent } from './neurone-forms-old/paragraph/paragraph.component';
import { MultipleChoiceComponent } from './neurone-forms-old/multiple-choice/multiple-choice.component';
import { MultipleCheckboxComponent } from './neurone-forms-old/multiple-checkbox/multiple-checkbox.component';
import { ListComponent } from './neurone-forms-old/list/list.component';
import { DatePickerComponent } from './neurone-forms-old/date-picker/date-picker.component';
import { SubmitComponent } from './neurone-forms-old/submit/submit.component';
*/

import { NeuroneAngularComponentsModule } from 'neurone-angular-components';
import { NeuroneRestrictInputDirective } from './neurone-restrict-input.directive';


@NgModule({
  declarations: [
    AppComponent,
    NeuroneRestrictInputDirective,
    /*
    InputComponent,
    ParagraphComponent,
    MultipleChoiceComponent,
    MultipleCheckboxComponent,
    ListComponent,
    DatePickerComponent,
    SubmitComponent,*/
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
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
    NeuroneAngularComponentsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor (private injector: Injector) {
    const elements: any[] = [
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

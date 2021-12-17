import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NeuroneNavbarComponent } from './neurone-navbar/neurone-navbar.component';
import { AuthInterceptor } from './auth-interceptor';
import { InputComponent } from './neurone-forms/input/input.component';
import { ParagraphComponent } from './neurone-forms/paragraph/paragraph.component';
import { MultipleChoiceComponent } from './neurone-forms/multiple-choice/multiple-choice.component';
import { MultipleCheckboxComponent } from './neurone-forms/multiple-checkbox/multiple-checkbox.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ListComponent } from './neurone-forms/list/list.component';
import { DatePickerComponent } from './neurone-forms/date-picker/date-picker.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    NeuroneNavbarComponent,
    InputComponent,
    ParagraphComponent,
    MultipleChoiceComponent,
    MultipleCheckboxComponent,
    ListComponent,
    DatePickerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: "outline"}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor (private injector: Injector) {
    const elements: any[] = [
      [NeuroneNavbarComponent, "neurone-navbar"],
      [InputComponent, "neurone-forms-input"],
      [ParagraphComponent, "neurone-forms-paragraph"],
      [MultipleChoiceComponent, "neurone-forms-multiple-choice"],
      [MultipleCheckboxComponent, "neurone-forms-multiple-checkbox"],
    ]

    for (const [component, name] of elements){
      const navbarElem = createCustomElement(component, {injector: this.injector});
      customElements.define(name, navbarElem);
    }
  }
}

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

import { NeuroneNavbarComponent } from './neurone-navbar/neurone-navbar.component';
import { AuthInterceptor } from './auth-interceptor';
import { NeuroneFormsComponent } from './neurone-forms/neurone-forms.component';

@NgModule({
  declarations: [
    AppComponent,
    NeuroneNavbarComponent,
    NeuroneFormsComponent
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
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor (private injector: Injector) {
    const elements: any[] = [
      [NeuroneNavbarComponent, "neurone-navbar"],
      [NeuroneFormsComponent, "neurone-forms"],
    ]

    for (const [component, name] of elements){
      const navbarElem = createCustomElement(component, {injector: this.injector});
      customElements.define(name, navbarElem);
    }
  }
}

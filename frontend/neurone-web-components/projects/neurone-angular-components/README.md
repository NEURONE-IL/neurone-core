# Dependencies and installation

```
ng add @angular/material
npm i @angular/elements
npm i lodash.throttle
npm i @types/lodash.throttle
npm install ngx-wig@12.0.0
npm i neurone-angular-components
```

# Neurone Components included in HTML

```html
<neurone-navbar-component>
<neurone-serp-component>
<neurone-forms-component>
<neurone-synthesis-component>
```

# Neurone Angular directives

```
neurone-logger-mouse
neurone-logger-keyboard
neurone-logger-scroll
```

# Use of Auth Service from components
```ts
//...
import { AuthService } from 'neurone-angular-components';
//...
export class ExampleComponent {

  constructor(private authService: AuthService) { }

}

```

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.0.

## Code scaffolding

Run `ng generate component component-name --project neurone-angular-components` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project neurone-angular-components`.
> Note: Don't forget to add `--project neurone-angular-components` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build neurone-angular-components` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build neurone-angular-components`, go to the dist folder `cd dist/neurone-angular-components` and run `npm publish`.

## Running unit tests

Run `ng test neurone-angular-components` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

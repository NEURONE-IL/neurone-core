import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

// pipe that forces link variables as resources in iframe, useful for neurone SERP
// https://stackoverflow.com/questions/62063494/unsafe-value-used-in-a-resource-url-context-iframe
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'lib-neurone-angular-components',
  template: `
    <p>
      neurone-angular-components works! Add any other neurone component like the navbar
    </p>
  `,
  styles: [
  ]
})
export class NeuroneAngularComponentsComponent implements OnInit {
//  title = 'neurone-angular-components';

  constructor(){}

  ngOnInit(): void {
  }

  onSubmit(){
    console.log("works");
  }
}

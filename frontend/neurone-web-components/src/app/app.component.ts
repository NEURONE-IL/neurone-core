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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'neurone-web-components';

  constructor(){}

  ngOnInit(): void {
  }

  onSubmit(){
    console.log("works");
  }
}

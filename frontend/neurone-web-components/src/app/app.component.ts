import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'neurone-angular-components';
  hasSubmittedForm = false;
  serpBookmarks = 0;
  serpSnippets = 0;

  constructor(){}

  ngOnInit(): void {
  }

  updateSubmittedForm(submitted: boolean) {
    this.hasSubmittedForm = submitted;
  }

  onSubmit(){
    console.log("works");
  }
}

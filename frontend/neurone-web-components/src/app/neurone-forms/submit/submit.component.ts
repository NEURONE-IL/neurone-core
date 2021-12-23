import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'neurone-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css', '../neurone-forms-style.css']
})
export class SubmitComponent implements OnInit {

  isLoading = false;
  @Input() title = "Submit";

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log("works");
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-neurone-forms-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.css']
})
export class MultipleChoiceComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "";
  @Input() options: string = "";
  radioOptions: string[] = ["Example Option 1", "Example Option 2", "Example Option 3"];

  constructor() { }

  ngOnInit(): void {
    if (this.options != ""){
      this.radioOptions = this.options.split("/");
    }
  }

}

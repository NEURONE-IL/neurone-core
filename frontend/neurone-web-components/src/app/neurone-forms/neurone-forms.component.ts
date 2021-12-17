import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-neurone-forms',
  templateUrl: './neurone-forms.component.html',
  styleUrls: ['./neurone-forms.component.css']
})
export class NeuroneFormsComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  @Input() options: string = "";
  radioOptions: string[] = ["Example Option 1", "Example Option 2", "Example Option 3"];

  constructor() { }

  ngOnInit(): void {
    if (this.options != ""){
      this.radioOptions = this.options.split("/");
    }
  }

}

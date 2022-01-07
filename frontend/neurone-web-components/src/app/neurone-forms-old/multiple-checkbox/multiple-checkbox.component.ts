import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'neurone-multiple-checkbox',
  templateUrl: './multiple-checkbox.component.html',
  styleUrls: ['./multiple-checkbox.component.css']
})
export class MultipleCheckboxComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  @Input() options: string = "";
  optionsArray: string[] = ["Example Option 1", "Example Option 2", "Example Option 3"];

  checked = false;
  indeterminate = false;

  constructor() { }

  ngOnInit(): void {
    if (this.options != ""){
      this.optionsArray = this.options.split("/");
    }
  }

}

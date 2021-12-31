import { Component, Input, OnInit } from '@angular/core';

interface Options {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-neurone-forms-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css', '../neurone-forms-style.css']
})
export class ListComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  @Input() options: string = "";
  optionsArray: string[] = ["Example Option 1", "Example Option 2", "Example Option 3"];
  optionsObj: Options[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.options != ""){
      this.optionsArray = this.options.split("/");
    }

    let i = 0;
    for (let option of this.optionsArray){
      let newOption: Options = {value: "option-" + i, viewValue: option}
      this.optionsObj.push(newOption);
      i++;
    }
  }

}

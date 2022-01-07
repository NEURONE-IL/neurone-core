import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'neurone-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css', '../neurone-forms-style.css']
})
export class DatePickerComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";

  constructor() { }

  ngOnInit(): void {
  }

}

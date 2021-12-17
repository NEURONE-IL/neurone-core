import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-neurone-forms-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";

  constructor() { }

  ngOnInit(): void {
  }

}

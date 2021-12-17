import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-neurone-forms-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.css']
})
export class ParagraphComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  //todo @Input() sizeHeight = 3;

  constructor() { }

  ngOnInit(): void {
  }

}

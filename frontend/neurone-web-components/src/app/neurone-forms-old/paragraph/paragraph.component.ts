// TODO: consider remove
import { Component, Input, OnInit } from '@angular/core';
//import { AuthService } from 'src/app/auth.service';
import { FormService } from '../form.service';

@Component({
  selector: 'neurone-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.css']
})
export class ParagraphComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  //todo @Input() sizeHeight = 3;
  formType = "paragraph";
  userInput = "";

  constructor(/*private authService: AuthService,*/ private formService: FormService) { }

  ngOnInit(): void {
  }

    // todo: check auth when data is attempted to be sumbitted and show error message
    saveToDB(): void {
      /*
      if (this.authService.getAuth()){
        const userId: string = this.authService.getUserId();
        this.formService.uploadForm(userId, this.title, this.formType, this.userInput, undefined);

      } else {
        console.log("User is not authenticated");
        return;
      }*/
    }

}

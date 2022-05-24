import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { FormService } from '../form.service';

@Component({
  selector: 'neurone-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() title = "Example title";
  @Input() hint = "Example hint";
  @Input() required: string = "false";
  formType = "input";
  userInput = "";


  constructor(private authService: AuthService, private formService: FormService) { }

  ngOnInit(): void {
  }

  // todo: check auth when data is attempted to be sumbitted and show error message
  saveToDB(): void {
    if (this.authService.getAuth()){
      const userId: string = this.authService.getUserId();
      this.formService.uploadForm(userId, this.title, this.formType, this.userInput, undefined);
    } else {
      console.log("User is not authenticated");
      return;
    }
  }

}

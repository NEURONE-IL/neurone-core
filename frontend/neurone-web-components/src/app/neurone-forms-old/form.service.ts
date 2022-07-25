// TODO: deprecated, consider removing
import { Injectable } from '@angular/core';
//import { HttpClient } from "@angular/common/http";
import { NeuroneFormData } from './form-data.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(/*private http: HttpClient*/) {}

  uploadForm(userId: string, question: string, formType: string, answerString?: string, answerNum?: number){
    /*
    const formData: NeuroneFormData = { userId: userId, question: question, formType: formType, answerNum: answerNum, answerString: answerString }
    this.http.post("http://localhost:3002/profile/form", formData)
      .subscribe(response => {
        console.log(response);
      })*/
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JsonFormData, JsonFormControls } from './neurone-form.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-neurone-forms',
  templateUrl: './neurone-forms.component.html',
  styleUrls: ['./neurone-forms.component.css']
})
export class NeuroneFormsComponent implements OnChanges, OnInit {

  @Input('form') formName = "";
  @Input() mode: "creator" | "answer" = "answer"; // creator to enable saving/deleting the form in the database, answer to simply answer the form
  jsonFormData: JsonFormData = { formName: "plalceholder", controls: [] }

  form: FormGroup = this.formBuilder.group({});
  submitAttempted = false;
  isLoading = false;
  submitError = false;
  loadFormError = false;
  deleteFormError = false;
  saveButtonText = "";
  deleteButtonText = "";

  private authListenerSubs: Subscription | undefined;
  userIsAuthenticated = false;

  constructor(private authService: AuthService, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // load input file
    if (this.formName !== "") {
      this.loadForm(this.formName);
    }
    // load default example file if there isn't an input
    else if (this.formName === "" && this.mode === "creator"){
      this.formName = "assets/example-form.json";
      this.loadForm(this.formName);
    }
    else if (this.formName === "" && this.mode === "answer"){
      this.formName = "questionnaire_example";
      this.loadForm(this.formName);
    }

    // we get the login status from the service
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        // with this we update the login status in this header
        this.userIsAuthenticated = isAuthenticated;
        this.isLoading = false;
        // reload form if user is logged in now
        if (this.userIsAuthenticated){
          this.loadForm(this.formName);
          this.loadFormError = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {

    //console.log("Form data has changed\n");


  }

  loadForm(formName: string) {
    if (this.mode === "answer"){
      // todo: change port to env
      this.http
      .get("http://localhost:3002/form/" + formName)
      .subscribe({
        next: (value: any) => {
          this.jsonFormData = value.form;
          /*
          console.log("JSON LOADED:\n");
          console.log(this.jsonFormData);
          */
          this.createForm(this.jsonFormData.controls);
        },
        error: (error: any) => {
          this.loadFormError = true;
          console.error(error);
        }
      });
    }
    else if (this.mode === "creator") {
      // TODO: loading the local file doesn't work in the web component
      this.http
      .get(formName)
      .subscribe({
        next: (value: any) => {
          this.jsonFormData = value;
          /*
          console.log("JSON LOADED:\n");
          console.log(this.jsonFormData);
          */
          this.loadFormError = false;
          this.createForm(this.jsonFormData.controls);
        },
        error: (error) => {
          this.loadFormError = true;
          console.error(error);
        }
      });
    }
  }

  createForm(controls: JsonFormControls[]){
    console.log("Creating form " + this.jsonFormData.formName + "...");
    for (const control of controls) {

      const validatorsToAdd = [];
      // loop through the validators array for this form to save them and add them to the form itself later
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      console.log("Adding: " + control.name + " Type: " + control.type);
      if (control.type === "checkbox" && control.choices){
        // todo: do required validators make sense in checkbox forms?
        for (const choice of control.choices){
          this.form.addControl(control.name + ' - ' + choice, this.formBuilder.control(false, validatorsToAdd));
        }
      } else {
        this.form.addControl(control.name, this.formBuilder.control(control.value, validatorsToAdd));
      }

    }
    console.log("Final form:");
    console.log(this.form);
  }


  // for the rating form
  onStarClick(rating: number, controlName: string) {
    this.form.controls[controlName].patchValue(rating);
    return;
  }

  // for the rating form
  showStar(index:number, controlName: string) {

    if (this.form.controls[controlName].value >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }

  }

  onSubmitAnswers() {
    this.isLoading = true;

    // show that the form has been attempted to be submitted at least once
    this.submitAttempted = true;

    /*
    console.log('Form valid: ', this.form.valid);
    console.log('Form values: ', this.form.value);
    */

    // don't submit if form isn't valid
    if (!this.form.valid) {
      this.isLoading = false;
      return;
    }

    // build form data for neurone-profile
    let questions: Object[] = [];
    const clientDate = Date.now();
    const userId = this.authService.getUserId();
    const formId = this.jsonFormData.formName;

    let formData = { questions: questions, clientDate: clientDate, userId: userId, formId: formId };
    console.log(formData);

    // get all questions/forms and add them to the questions array in a fashion compatible with backend
    for (let control of this.jsonFormData.controls){
      if (control.type != 'checkbox') {
        const controlName = control.name;
        const formQuestion = { question: control.name, title: control.title, formType: control.type, answer: this.form.value[controlName]}
        formData.questions.push(formQuestion);
      } else {
        // the checkbox is a special case, the different checkbox options are grouped manually since they are separate elements
        if (control.choices){
          const answers: Object[] = [];
          let formQuestion = { question: control.name, formType: control.type, answer: answers, title: control.title};

          for (let choice of control.choices){
            const controlNameCheckbox = control.name + ' - ' + choice;
            const formQuestionOption = { question: choice, answer: this.form.value[controlNameCheckbox]}
            formQuestion.answer.push(formQuestionOption);
          }
          formData.questions.push(formQuestion);
        } else {
          console.error("This checkbox form doesn't have any choice.");
        }
      }
    }

    console.log(formData);

    // todo: change to env port
    this.http.post("http://localhost:3002/profile/form", formData)
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.submitError = false;
          console.log(response);
        },
        error: error => {
          this.isLoading = false;
          this.submitError = true;
          console.error(error);
        }
      });
  }

  onSubmitForm() {

    // send the current questionnaire to the backend
    const formDataQuestionnaire = {
      formName: this.jsonFormData.formName,
      questions: this.jsonFormData.controls
    }

    // todo: change to env port
    this.http.put("http://localhost:3002/form/" + formDataQuestionnaire.formName, formDataQuestionnaire)
      .subscribe({
        next: response => {
          this.saveButtonText = "Saved!";
          console.log(response);
        },
        error: error => {
          this.saveButtonText = "Error saving";
          console.error(error);
        }
      });

    return;
  }

  onDeleteForm() {
    // todo: change to env port
    this.http.delete("http://localhost:3002/form/" + this.jsonFormData.formName)
      .subscribe({
        next: response => {
          this.deleteButtonText = "Deleted!";
          console.log(response);
        },
        error: error => {
          this.deleteButtonText = "Could not delete form.";
          console.error(error);
        }
      });
  }

  getRange(min: number, max: number, step: number) {

    let finalArray: number[] = []

    for (let i = min; i <= max; i += step){
      finalArray.push(i);
    }

    return finalArray
  }

}

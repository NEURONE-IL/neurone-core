import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JsonFormData, JsonFormControls } from './neurone-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NeuroneConfig } from '../neurone-components-config';
import { MatFormFieldAppearance } from '@angular/material/form-field';


@Component({
  selector: 'neurone-forms-component',
  templateUrl: './neurone-forms.component.html',
  styleUrls: ['./neurone-forms.component.css']
})
export class NeuroneFormsComponent implements OnInit {

  /**
   * Name of the form, in local modes a path, in db mode it's formName field in the database
   *
   * Example of local name in the default Angular assets folder: `assets/example-form.json`
   *
   * If Neurone-Profile doesn't find the form (in db mode), it will return an example form
  */
  @Input('form') formName = "";
  /**
   * dev: load form locally, enable buttons to save/delete on db
   *
   * local: load form locally
   *
   * db: load form from database using the formName field as an ID
   *  */
  @Input() mode: "dev" | "local" | "db" = "db";
  /** Customizable material appearance
   *
   * `MatFormFieldAppearance = "legacy" | "standard" | "fill" | "outline"`
  */
  @Input('appearance') formAppearance: MatFormFieldAppearance = 'outline';

  /**
   * Will send a "true" once the user has submitted an answer and the backend has responded with no errors
   */
  @Output() userHasSubmitted = new EventEmitter<boolean>();

  jsonFormData: JsonFormData = { formName: "plalceholder", questions: [] }

  form: FormGroup = this.formBuilder.group({});
  submitAttempted = false;
  isLoading = false;
  submitError = false;
  loadFormError = false;
  deleteFormError = false;
  saveButtonText = "";
  deleteButtonText = "";

  private authListenerSubs: Subscription = new Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // load input file
    if (this.formName !== "") {
      this.loadForm(this.formName);
    }
    // load default example file if there isn't an input
    else if (this.formName === "" && this.mode === "dev"){
      this.formName = "assets/example-form.json";
      this.loadForm(this.formName);
    }
    else if (this.formName === "" && this.mode === "db"){
      this.formName = "questionnaire_example";
      this.loadForm(this.formName);
    }

    // properly know login status on init
    this.userIsAuthenticated = this.authService.getAuth();

    // we get the login status from the service
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        // with this we update the login status
        this.userIsAuthenticated = isAuthenticated;
        this.isLoading = false;
        // reload form if user is logged in now
        if (this.userIsAuthenticated){
          this.loadForm(this.formName);
          this.loadFormError = false;
        }
      });
  }

  /**
   * retriever of the form JSON file
   * @param formName name of the form in the database, or the path of the form locally
   */
  loadForm(formName: string) {
    if (this.mode === "db"){
      this.http
      .get("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/form/" + formName)
      .subscribe({
        next: (value: any) => {

          this.jsonFormData = value.form;
          /*
          console.log("JSON LOADED:\n");
          console.log(this.jsonFormData);
          */
          this.createForm(this.jsonFormData.questions);
        },
        error: (error: any) => {
          this.loadFormError = true;
          console.error(error);
        }
      });
    }
    else if (this.mode === "dev" || this.mode === "local") {
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
          this.createForm(this.jsonFormData.questions);
        },
        error: (error) => {
          this.loadFormError = true;
          console.error(error);
        }
      });
    }
  }

  /**
   * function in charge of creating the main form
   * @param questions all the form questions
   */
  createForm(questions: JsonFormControls[]){
    console.log("Creating form " + this.jsonFormData.formName + "...");

    for (const control of questions) {

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

      //console.log("Adding: " + control.name + " Type: " + control.type);
      if (control.type === "checkbox" && control.choices){
        // todo: do required validators make sense in checkbox forms?
        for (const choice of control.choices){
          this.form.addControl(control.name + ' - ' + choice, this.formBuilder.control(false, validatorsToAdd));
        }
      } else {
        this.form.addControl(control.name, this.formBuilder.control(control.placeholder, validatorsToAdd));
      }

    }
  }

  /**
   * saves the rating in the form when a star of the star rating type of question is clicked
   * @param rating what start position was clicked
   * @param controlName name of the question
   */
  onStarClick(rating: number, controlName: string) {
    this.form.controls[controlName].patchValue(rating);
  }

  /**
   * helper to indicate what type of star to show in the question type of star rating
   * @param index the position of the start in the list of stars
   * @param controlName name of the question
   * @returns string indicating the type of star to show
   */
  showStar(index:number, controlName: string) {

    if (this.form.controls[controlName].value >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }

  }

  /**
   * answer submission to Neurone-Profile
   */
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

    // get all questions/forms and add them to the questions array in a fashion compatible with backend
    for (let control of this.jsonFormData.questions){
      if (control.type != 'checkbox') {
        const controlName = control.name;
        const formQuestion = {
          question: control.name,
          title: control.title,
          formType: control.type,
          answer: this.form.value[controlName] ? this.form.value[controlName] : "" }
        formData.questions.push(formQuestion);
      } else {
        // the checkbox is a special case, the different checkbox options are grouped manually since they are separate elements
        if (control.choices){
          const answers: Object[] = [];
          let formQuestion = {
            question: control.name,
            formType: control.type,
            answerArray: answers,
            title: control.title
          }

          for (let choice of control.choices){
            const controlNameCheckbox = control.name + ' - ' + choice;
            const formQuestionOption = { question: choice, answer: this.form.value[controlNameCheckbox]}
            formQuestion.answerArray.push(formQuestionOption);
          }
          formData.questions.push(formQuestion);
        } else {
          console.error("This checkbox form doesn't have any choice.");
        }
      }
    }

    this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/profile/form", formData)
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.submitError = false;
          console.log(response);
          // tell the parent that user has submitted an answer
          this.userHasSubmitted.emit(true);
        },
        error: error => {
          this.isLoading = false;
          this.submitError = true;
          console.error(error);
        }
      });
  }

  /**
   * form submission (not answers) to Neurone-Profile
   */
  onSubmitForm() {

    // send the current questionnaire to the backend
    const formDataQuestionnaire = {
      formName: this.jsonFormData.formName,
      username: this.authService.getUsername(),
      questions: this.jsonFormData.questions
    }

    this.http.put("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/form/" + formDataQuestionnaire.formName, formDataQuestionnaire)
      .subscribe({
        next: response => {
          this.saveButtonText = "Saved!";
          console.log(response);
        },
        error: error => {
          this.saveButtonText = "Error saving. Are you authenticated?";
          console.error(error);
        }
      });

    return;
  }

  /**
   * form deletion (not answers)
   */
  onDeleteForm() {
    this.http.delete("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/form/" + this.jsonFormData.formName)
      .subscribe({
        next: response => {
          this.deleteButtonText = "Deleted!";
          console.log(response);
        },
        error: error => {
          this.deleteButtonText = "Could not delete form. Are you authenticated?";
          console.error(error);
        }
      });
  }

  /**
   * helper function to properly calculate the numbers that are in the scale type of question
   * @param min start of scale
   * @param max end of scale
   * @param step difference between each scale number
   * @returns the number array with all the numbers of the scale
   */
  getRange(min: number, max: number, step: number) {

    let finalArray: number[] = []

    for (let i = min; i <= max; i += step){
      finalArray.push(i);
    }

    return finalArray;
  }

}

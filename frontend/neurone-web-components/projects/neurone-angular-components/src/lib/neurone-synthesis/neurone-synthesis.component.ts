import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service'
import { NeuroneConfig } from '../neurone-components-config';
import { interval, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface snippetResponse {
  snippet: string,
  dateClient: string,
  dateServer: string,
  timestampClient: number,
  timestampServer: number,
  userId: string,
  website: string,
  websiteUrl: string,
  websiteTitle: string
}

@Component({
  selector: 'neurone-synthesis-component',
  templateUrl: './neurone-synthesis.component.html',
  styleUrls: ['./neurone-synthesis.component.css']
})
export class NeuroneSynthesisComponent implements OnInit, OnDestroy {

  @Input() question = "This is the Synthesis component! Please enter text here.";
  @Input() placeholder = "I think that...";
  @Input() autosaveInterval = 30; // timer for auto saving the answer in seconds
  @Input() autosaveDisabled = false;

  intervalSubs: Subscription = new Subscription; // for the autosave

  startTime: number = 0; // date when the component was loaded
  synthForm = new FormControl('');
  wordCount = 0;
  charCount = 0;
  loading = false;
  startedAns = false; // false if the user hasn't started writing an asnwer

  // search snippet data
  snippets: snippetResponse[] = [];

  userIsAuthenticated = false;
  private authStatusSubs: Subscription = new Subscription;

  constructor(private authService: AuthService, private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.startTime = Date.now();

    // autosave setup every few seconds
    const source = interval(this.autosaveInterval * 1000);
    this.intervalSubs = source.subscribe((_) => this.submitAnswer(true));

    // listen for login status from the neurone auth service
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    // initial auth status
    this.userIsAuthenticated = this.authService.getAuth();

      // get search snippets
      this.getSnippets();
  }

  testInput() {
    console.log(this.synthForm.value, "\nWords: " + this.wordCount, "\nChars: " + this.charCount);
  }

  removeHTML(htmlText: string) {
    let reducedText = htmlText.replace(/<[^>]+>/gm, ' ');  // dgacitua: Delete HTML markup
    reducedText = reducedText.replace(/\&nbsp;/g, ' ');   // remove &nbsp

    return reducedText;
  }

  countWords(newText: string){

    const reducedText = this.removeHTML(newText);
    const possibleCount = reducedText.match(/\S+/g);  // dgacitua: Count words

    // null check
    if (possibleCount) {
      this.wordCount = possibleCount.length;
    }
    this.charCount = reducedText.length;  // dgacitua: Count chars
  }


  getSnippets() {
    this.http.get("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/snippet/" + this.authService.getUserId())
      .subscribe({
        next: (response: any) => {
          this.snippets = response.snippets;
          console.log(this.snippets);
        },
        error: error => {
          console.error(error);
        }
      });
  }


  submitAnswer(autoSaved: boolean) {

    if (this.autosaveDisabled && autoSaved || !this.authService.getAuth()) {
      return;
    }

    // if the user hasn't started writing, don't submit or autosave
    if (!this.startedAns && this.charCount > 0) {
      this.startedAns = true;
    }
    else if (!this.startedAns) {
      return;
    }

    const answer = {
      userId: this.authService.getUserId(),
      username: this.authService.getUsername(),
      startTime: this.startTime,
      question: this.question,
      answer: this.removeHTML(this.synthForm.value),
      answerHTML: this.synthForm.value,
      completeAnswer: !autoSaved,
      clientDate: Date.now(),
    }

    this.loading = true;
    this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/synthesis", answer)
      .subscribe({
        next: response => {
          console.log(response);
          this.loading = false;

          if (autoSaved){
            this._snackBar.open('Answer auto saved!', 'Close', {
              duration: 3000
            });
          }

        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });

  }

  ngOnDestroy() {
    this.intervalSubs.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}

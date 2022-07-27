import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service'
import { NeuroneConfig } from '../neurone-components-config';

@Component({
  selector: 'neurone-synthesis-component',
  templateUrl: './neurone-synthesis.component.html',
  styleUrls: ['./neurone-synthesis.component.css']
})
export class NeuroneSynthesisComponent implements OnInit {

  @Input() question = "This is the Synthesis component! Please enter text here.";
  @Input() placeholder = "I think that...";
  @Input() autosaveInterval = 20; // timer for auto saving the answer

  startTime: number = 0; // date when the component was loaded
  synthForm = new FormControl('');
  wordCount = 0;
  charCount = 0;
  loading = false;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.startTime = Date.now();
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

  // TODO: auto save after certain ammount of time
  autoSave() {
    console.log("TODO");
  }

  submitAnswer() {

    const answer = {
      userId: this.authService.getUserId(),
      username: this.authService.getUsername(),
      startTime: this.startTime,
      question: this.question,
      answer: this.removeHTML(this.synthForm.value),
      answerHTML: this.synthForm.value,
      completeAnswer: true,
      clientDate: Date.now()
    }

    this.loading = true;
    this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/synthesis", answer)
      .subscribe({
        next: response => {
          console.log(response);
          this.loading = false;
        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });

  }

}

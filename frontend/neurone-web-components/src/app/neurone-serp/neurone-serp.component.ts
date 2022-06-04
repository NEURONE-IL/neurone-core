import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

interface searchDocument {
  docId_s: string,
  id: string,
  title_t: string,
  indexedBody_t: string,
  url_t: string,
  searchSnippet_t: string[]
}

@Component({
  selector: 'app-neurone-serp',
  templateUrl: './neurone-serp.component.html',
  styleUrls: ['./neurone-serp.component.css']
})
export class NeuroneSerpComponent implements OnInit {

  mode: 'serp' | 'page' = 'serp';
  selectedPage: string = ''; // current page for the page mode
  loading = true;
  searchOnline = false;
  searchForm = new FormControl('');
  documents: searchDocument[] = [];  // documents found by neurone-seach
  highlights: any;  // highlights for the documents, also provided by neurone search. it's an object with keys representing the doc ID
  routes: any; // routes of the downloaded documents, similar format to  highlights
  safeUrl = "url";


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    // prod mode: simply ping the main neurone-search page, dev mode: refresh neurone-search index
    this.loading = true;
    if (environment.production){
      this.http.
      get("http://localhost:" + environment.neuroneSearchPort, {responseType: 'text'})
      .subscribe({
        next: () => {
          console.log("Connection with Neurone-Search back-end successful");
          this.searchOnline = true;
          this.loading = false;
        },
        error: (e) => {
         console.error("Error connecting with Neurone-Search back-end.");
          console.error(e);
         this.loading = false;
        }
      })
    }
    else {
    this.http.
      get("http://localhost:" + environment.neuroneSearchPort + "/refresh")
      .subscribe({
        next: () => {
          console.log("Connection with Neurone-Search back-end successful");
          this.searchOnline = true;
          this.loading = false;
        },
        error: (e) => {
          console.error("Error connecting with Neurone-Search back-end.");
          console.error(e);
          this.loading = false;
        }
      })
    };

  }

  switchToSerpMode(){
    this.mode = 'serp';
    this.selectedPage = '';
    return
  }

  switchToPageMode(url: string) {
    console.log("SWITCHING TO Page MODE: new url: ", url);
    this.mode = 'page';
    this.selectedPage = url;
    return;
  }

  buildSnippet(texts: string[]) {
    if (!texts) {
      return "";
    }

    let finalString = "...";
    for (const text of texts) {
      finalString += text + "... "
    }
    return finalString;
  }

  /**
   * makes a search query to NEURONE Search
   */
  makeSearchQuery() {
    console.log(this.searchForm.value);
    this.http.
    get("http://localhost:" + environment.neuroneSearchPort + "/search/" + this.searchForm.value)
    .subscribe({
      next: (res: any) => {

        console.log(res);

        // save documents if there is any
        this.documents = res.result.response.docs ? res.result.response.docs : [];

        // if there is no highlight provided by the search index, use manually saved snippet
        console.log("HIGHLIGHTS RECEIVED:");
        console.log(res.result.highlighting);
        this.highlights = {}
        for (const doc of this.documents) {
          this.highlights[doc.id] = res.result.highlighting[doc.id]?.length > 0 ? res.result.highlighting[doc.id] : doc.searchSnippet_t;
        }

        // save route for the downloaded document and add the localhost section
        this.routes = res.result.route;
        for (const key in this.routes) {
          this.routes[key] = "http://localhost:" + environment.neuroneSearchPort + "//" + this.routes[key];
        }

        console.log("Documents is now: ", this.documents);
        console.log("Highlights is now: ", this.highlights);
        console.log("Routes is now: ", this.routes);
      },
      error: (e: any) => {
        console.error(e);
      }
    })
  }

}

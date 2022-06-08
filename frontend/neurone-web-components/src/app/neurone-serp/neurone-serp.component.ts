import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
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
  styleUrls: ['./neurone-serp.component.css', 'wikipedia.css'], // TODO: keep testing wiki style or remove
  encapsulation: ViewEncapsulation.None
})
export class NeuroneSerpComponent implements OnInit {

  mode: 'serp' | 'page' = 'serp';
  noQueriesMade = true;
  selectedPage: string = ''; // current page for the page mode
  loading = true;
  searchOnline = false;
  lastQuery = '';

  // pagination
  currentPage = 0;
  docsInPage = 10;
  totalDocsFound = 0;
  pageSizeOptions = [1, 2, 5, 10, 50];

  searchForm = new FormControl('');

  documents: searchDocument[] = [];  // documents found by neurone-seach
  highlights: any;  // highlights for the documents, also provided by neurone search. it's an object with keys representing the doc ID
  routes: any; // routes of the downloaded documents, similar format to  highlights


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
      });
    }
    else {
      this.http.
        get("http://localhost:" + environment.neuroneSearchPort + "/refresh")
        .subscribe({
          next: () => {
            console.log("Connection with Neurone-Search back-end successful, index refreshed (development mode).");
            this.searchOnline = true;
            this.loading = false;
          },
          error: (e) => {
            console.error("Error connecting with Neurone-Search back-end.");
            console.error(e);
            this.loading = false;
          }
        });
    };

  }

  test(){
    console.log("XD")
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

  /**
   * builds a string to show below the page links in the SERP
   * @param texts each snippet saved (from index or database as a backup)
   * @returns string with the content to show in the SERP
   */
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

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex
    this.docsInPage = pageData.pageSize
    this.makeSearchQuery(this.lastQuery);
  }

  onSeachRequest() {
    if (this.searchForm.value !== '') {
      this.lastQuery = this.searchForm.value;
    }
    this.currentPage = 0;
    this.makeSearchQuery(this.searchForm.value);
  }

  /**
   * makes a search query to NEURONE Search using the search form
   */
  makeSearchQuery(query: string) {

    // don't do the query if the input is empty
    if (this.searchForm.value === '') {
      return;
    }

    this.noQueriesMade = false;
    console.log("New Query:" + query);
    this.loading = true;

    this.http.
    get("http://localhost:" + environment.neuroneSearchPort + "/search/" + query+ "/" + this.currentPage + "/" + this.docsInPage)
    .subscribe({
      next: (res: any) => {

        this.loading = false;
        console.log(res);

        // save total number of docs found
        this.totalDocsFound = res.result.response.numFound;

        // save documents if there is any
        this.documents = res.result.response.docs ? res.result.response.docs : [];

        // if there is no highlight provided by the search index, use manually saved snippet
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
        this.loading = false;
        console.error(e);
      }
    })
  }

}

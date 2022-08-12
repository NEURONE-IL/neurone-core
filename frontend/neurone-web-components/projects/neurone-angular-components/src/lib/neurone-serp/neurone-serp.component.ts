import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth.service';
import { NeuroneConfig } from '../neurone-components-config';

interface searchDocument {
  docId_s: string, // id in the database
  id: string, // unique name
  title_t: string,
  indexedBody_t: string,
  url_t: string,
  searchSnippet_t: string[],
  relevant_b: boolean,
  tags_t: string[]
}

// TODO: add task/domain
interface logDocument {
  userId: string,
  userEmail: string,
  date: number,
  description:string,
  query: string,
  selectedPageName: string,
  selectedPageUrl: string,
  relevant: boolean,
  currentPageNumber: number,
  resultDocumentRank: number,
  resultNumberTotal: number,
  searchResults: string[]
}

@Component({
  selector: 'neurone-serp-component',
  templateUrl: './neurone-serp.component.html',
  styleUrls: ['./neurone-serp.component.css', 'wikipedia.css'], // TODO: keep testing wiki style or remove
  encapsulation: ViewEncapsulation.None // this makes styling of the innerHTML possible
})
export class NeuroneSerpComponent implements OnInit {

  mode: 'serp' | 'page' = 'serp';
  fullScreenMode = true;
  showUserSaveButtons = false;
  selectedPageName = ''; // name of the document that serves as an id
  selectedPageRoute: string = ''; // route in the server for current page for the page mode
  bookmarkSaveMode: 'save' | 'unsave' = 'save';
  loading = true;
  searchOnline = false;
  lastQuery = '';

  @Input() logEnabled = true; // log for neurone-profile
  @Input() refreshIndex = false; // request an index refresh to the search backend when loading the page, useful for dev
  @Input() tags: string = '';
  @Input() logoImgSrc = 'https://cdn.discordapp.com/attachments/999698056884801618/999698245347446854/searchlogo.png';

  // pagination
  currentPage = 0;
  docsInPage = 10;
  totalDocsFound = 0;
  pageSizeOptions = [1, 2, 5, 10, 50];

  searchForm = new FormControl('');

  documents: searchDocument[] = [];  // documents found by neurone-seach
  highlights: any;  // highlights for the documents, also provided by neurone search. it's an object with keys representing the doc ID
  routes: any; // routes of the downloaded documents, similar format to  highlights

  // listen to iframe messages
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent){

    // text selection iframe message, triggered by serp function that requests the selected text
    if (event.data.type === 'textSelection'){
      if (typeof event.data.selection === 'string' && event.data.selection !== ''){
        this.saveSnippet(event.data.selection);
      }
    }

  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {

    // prod mode: simply ping the main neurone-search page, dev mode: refresh neurone-search index
    this.loading = true;

    this.http.
    get("http://localhost:" + NeuroneConfig.neuroneSearchPort, {responseType: 'text'})
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

    if (this.refreshIndex) {
      this.http.
        get("http://localhost:" + NeuroneConfig.neuroneSearchPort + "/refresh")
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


  /**
   * finds all of the document names and sends them in an array in the order they are shown in the results page
   * @returns array with document names
   */
  getAllDocumentNames(){
    let allDocNames: string[] = [];

    for (const doc of this.documents) {
      allDocNames.push(doc.id);
    }
    return allDocNames;
  }

  /**
   * finds the rank of the last opened document in the documents array
   * @returns number with the rank (highest rank is 1)
   */
  calculateDocRank() {
    // find index in documents array
    let docRank = this.documents.findIndex(doc => {
      return doc.id === this.selectedPageName
    });
    // adjustment to consider the page number the user is in and make the best rank 1
    docRank = docRank + 1 + (this.currentPage * this.docsInPage);

    return docRank;
  }

  /**
   * enables search results view mode and sends a log of it in case it's enabled
   * @returns void
   */
  switchToSerpMode(){
    this.mode = 'serp';

    // log to database
    // find document for easy access to its data
    let currentDoc;
    for (const doc of this.documents) {
      if (doc.id === this.selectedPageName) {
        currentDoc = doc;
      }
    }
    if (!currentDoc){
      console.error("Could not find document in the saved documents array");
      return;
    }

    const docRank = this.calculateDocRank();

    const logDoc: logDocument = {
      userId: this.authService.getUserId(),
      userEmail: this.authService.getEmail(),
      date: Date.now(),
      description: "Returned to SERP",
      query: this.lastQuery,
      selectedPageName: currentDoc.id,
      selectedPageUrl: currentDoc.url_t,
      relevant: currentDoc.relevant_b,
      currentPageNumber: this.currentPage,
      resultDocumentRank: docRank,
      resultNumberTotal: this.totalDocsFound,
      searchResults: this.getAllDocumentNames()
    }

    this.logNavigation(logDoc);

    return;
  }

  /**
   * switches to the full screen iframe mode that shows the document selected from the SERP
   * @param document document to show in the iframe
   * @param elem element in template to scroll to after clicking a search result
   * @returns void
   */
  switchToPageMode(document: searchDocument, elem: HTMLElement) {
    console.log("SWITCHING TO Page MODE: new url: ", this.routes[document.id]);

    this.mode = 'page';
    this.selectedPageRoute = this.routes[document.id];
    this.selectedPageName = document.id;
    // only show buttons if the user is logged in
    this.showUserSaveButtons = this.authService.getAuth();

    // scroll to toolbar
    elem.scrollIntoView({behavior: 'smooth'});

    // check if this page is part of the bookmarks in neurone profile and change the button behavious accordingly
    if (this.authService.getAuth()){
      this.http.get("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/bookmark/saved/" + this.authService.getUserId())
        .subscribe({
          next: (res: any) => {

            // check if current page is part of saved bookmarks
            for (const bookmark of res.data) {
              if (this.selectedPageName === bookmark.website) {
                this.bookmarkSaveMode = 'unsave';
                break;
              } else {
                this.bookmarkSaveMode = 'save';
              }
            }

          },
          error: (err) => {
            console.error(err);
          }
        })
    }

    // log to database
    const docRank = this.calculateDocRank();

    const logDoc: logDocument = {
      userId: this.authService.getUserId(),
      userEmail: this.authService.getEmail(),
      date: Date.now(),
      description: "Opened Web Page",
      query: this.lastQuery,
      selectedPageName: document.id,
      selectedPageUrl: document.url_t,
      relevant: document.relevant_b,
      currentPageNumber: this.currentPage,
      resultDocumentRank: docRank,
      resultNumberTotal: this.totalDocsFound,
      searchResults: this.getAllDocumentNames()
    }
    this.logNavigation(logDoc);

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

  /**
   * executed when paginator is clicked, makes a new search request based on the previous one and logs it
   * @param pageData event of the paginator with event data
   */
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex
    this.docsInPage = pageData.pageSize
    this.makeSearchQuery(this.lastQuery, "Navigated to other results page");
  }

  /**
   * what happens once the user does a query with the search bar
   */
  onSeachRequest() {
    if (this.searchForm.value !== '') {
      this.lastQuery = this.searchForm.value;
    }
    this.currentPage = 0;
    this.makeSearchQuery(this.searchForm.value, "Search Query Made");
  }


  /**
   * makes a search query to neurone search
   * @param query string with query to be made
   * @param logDescription description for the logger in case it's enabled
   * @returns void
   */
  makeSearchQuery(query: string, logDescription?: string) {

    // don't do the query if the input is empty
    if (this.searchForm.value === '') {
      return;
    }

    this.fullScreenMode = false;
    console.log("New Query:" + query);
    this.loading = true;

    this.http
    .get("http://localhost:" + NeuroneConfig.neuroneSearchPort + "/search/" + query+ "/" + this.currentPage + "/" + this.docsInPage + '/' + this.tags)
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
          this.routes[key] = "http://localhost:" + NeuroneConfig.neuroneSearchPort + "//" + this.routes[key];
        }

        console.log("Documents is now: ", this.documents);
        console.log("Highlights is now: ", this.highlights);
        console.log("Routes is now: ", this.routes);

        // save log to database
        const logObj: logDocument = {
          userId: this.authService.getUserId(),
          userEmail: this.authService.getEmail(),
          date: Date.now(),
          description: logDescription ? logDescription : '',
          query: this.lastQuery,
          selectedPageName: '',
          selectedPageUrl: '',
          relevant: false,
          currentPageNumber: this.currentPage,
          resultDocumentRank: -1,
          resultNumberTotal: this.totalDocsFound,
          searchResults: this.getAllDocumentNames()
        }

        this.logNavigation(logObj);

      },
      error: (e: any) => {
        this.loading = false;
        console.error(e);
      }
    });
  }

  /**
   * sends a log to neurone profile, can be disabled with "logEnable = false", requires user authentication with the neurone navbar and neurone auth
   * @param logObj the object with the log information
   */
  logNavigation(logObj: logDocument){

    if (this.logEnabled && this.authService.getAuth()) {
      this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/logger/search/", logObj)
      .subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  /**
   * save current opened page in neurone serp to the bookmarks in backend
   */
  saveBookmark() {

    if (!this.authService.getAuth()){
      return;
    }

    // find the url using the selected doc name
    const websiteUrlToSave = this.documents.find(elem => elem.id === this.selectedPageName)?.url_t;

    const bookmarkData = {
      userId: this.authService.getUserId(),
      website: this.selectedPageName,
      websiteUrl: websiteUrlToSave,
      date: Date.now(),
      saved: this.bookmarkSaveMode === 'save' // true if save, false if unsave
    }

    let isBookmarkNew = true;

    // get bookmarks to check if the bookmark to save is already in the database, this will lead to a different api request depending on the result
    this.http.get("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/bookmark/saved/" + this.authService.getUserId())
      .subscribe({
        next: (res: any) => {

          // check if the bookmark is new (post request) or an already existing one (put request)
          if (res.data) {
            for (const bookmark of res.data) {
              if (bookmark.website === this.selectedPageName){
                isBookmarkNew = false;
              }
            }
          }

          if (!isBookmarkNew) {
          // update bookmark to be saved, if it's a new bookmark it will be created
          this.http.put("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/bookmark/" + this.authService.getUserId() + "/" + this.selectedPageName, bookmarkData)
            .subscribe({
              next: (res: any) => {
                if (this.bookmarkSaveMode === 'save') {
                  alert("Bookmark saved!");
                  this.bookmarkSaveMode = 'unsave'
                } else if (this.bookmarkSaveMode === 'unsave') {
                  alert("Bookmark deleted!");
                  this.bookmarkSaveMode = 'save'
                }

              },
              error: (err) => {
                alert("Bookmark could not be saved.");
                console.error(err);
              }
            });
          }

          // bookmark is new so we create it
          else {
            this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/bookmark", bookmarkData)
              .subscribe({
                next: (res) => {
                  alert("Bookmark saved!");
                  this.bookmarkSaveMode = 'unsave';
                },
                error: (err) => {
                  alert("Bookmark could not be saved.");
                  console.error(err);
                }
              });
          }


        },
        error: (err) => {
          console.error(err);
        }
      })


  }

  /**
   * get saved bookmarks and snippets
   * @alert should an alert pop up once data is received
   */
  getBookmarks(shouldAlert: boolean) {

    if (!this.authService.getAuth()) {
      return;
    }

    this.http.get("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/user/" + this.authService.getUserId())
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (shouldAlert){
            let alertString = "Bookmarks:\n";
            for (const bookmark of res.bookmarks) {
              if (bookmark.saved){
                alertString = alertString + bookmark.website + "\n";
              }
            }
            alertString = alertString + "\nSnippets:\n"
            for (const snippet of res.snippets) {
              alertString = alertString + snippet.website + ": " + snippet.snippet + "\n\n";
              console.log(snippet);
            }

            alert(alertString);
          }
        },
          error: (err: any) => {
            console.error(err);
            alert("Could not get user data.");
          }
      })
  }


  /**
   * send a message to an iframe requesting the snippet (text selection) to use (the webpage in the iframe has to implement this)
   * @param iframe html iframe element that will receive the message request
   */
  sendSnippetRequest(iframe: HTMLIFrameElement) {

    if (!this.authService.getAuth()){
      return;
    }

    // send iframe message to send string to neurone-serp
    iframe.contentWindow?.postMessage({message: "get_snippet"}, "*");
  }

  /**
   * save text snippet to neurone-search backend
   * @param snippet text to save
   */
  saveSnippet(snippet: string) {

    if (!this.authService.getAuth()){
        return;
      }

    // find the url using the selected doc name
    const websiteUrlToSave = this.documents.find(elem => elem.id === this.selectedPageName)?.url_t;

    // find the website title
    const websiteTitleToSave = this.documents.find(elem => elem.id === this.selectedPageName)?.title_t;

    const snippetData = {
      userId: this.authService.getUserId(),
      snippet: snippet,
      website: this.selectedPageName,
      websiteUrl: websiteUrlToSave,
      websiteTitle: websiteTitleToSave,
      date: Date.now()
    }

    console.log("snippetData to send: ", snippetData);
    this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/search/snippet", snippetData)
      .subscribe({
        next: (res: any) => {
          alert("Snippet saved!");
          console.log(res);
        },
        error: (err: any) => {
          alert("Snippet could not be saved.")
          console.error(err);
        }
      })

  }
}

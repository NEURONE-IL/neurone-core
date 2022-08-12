export interface searchDocument {
  docId_s: string, // id in the database
  id: string, // unique name
  title_t: string,
  indexedBody_t: string,
  url_t: string,
  searchSnippet_t: string[],
  relevant_b: boolean,
  tags_t: string[]
}

export interface logDocument {
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

export interface bookmark {
  log: {
    dateClient: string,
    dateServer: string,
    saved: boolean,
    timestampClient: number,
    timestampServer: number
  }[],
  saved: boolean,
  userId: string,
  website: string,
  websiteUrl: string,
  __v: number,
  _id: string
}

export interface snippet {
  dateClient: string,
  dateServer: string,
  snippet: string,
  timestampClient: number,
  timestampServer: number,
  userId: string,
  website: string,
  __v: number,
  _id: string
}

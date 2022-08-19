# Back-end

The back-end consists of different components that serve different components. For user accounts the Auth and Profile components are essential, while the Search provides all the document search functionalities, including the downloader that can be accessed with its API. This also means that a completely new front-end can be made that communicates with these components.

It's possible to only use the necessary components, for example, if only the search front-end wants to be used, Neurone-Search is enough, while if only the form maker wants to be used, Neurone-Auth and Neurone-Search are enough.

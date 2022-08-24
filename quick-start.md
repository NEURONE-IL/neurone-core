---
description: >-
  How to download the Angular components and run the different back-end programs
  that support them.
---

# Quick Start

### Requirements

* [Node.js **16.17.0**](https://nodejs.org/en/download/)****
* [Angular **13.0.0+**](https://angular.io/guide/setup-local)****
* [TypeScript compiler](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)
* Apache Solr **9.0.0** with a core named "neurone" (installation instructions included in this document).
* MongoDB database. It could be a cloud database, or a local database installed in the OS or mounted with Docker.
* Recommended: Linux operating system for development, with a distribution based on Ubuntu. These instructions were made and tested on Ubuntu in mind.
* Recommended: [PM2](https://pm2.keymetrics.io/)

## Angular components (front-end)

The components can be installed in a new Angular project (version 13+) using NPM

```
npm i neurone-angular-components
```

To use them in the Angular project, import them in a module like this:

```typescript
//...
import { NeuroneAngularComponentsModule } from 'neurone-angular-components';
//...
@NgModule({
//...
    imports: [
        NeuroneAngularComponentsModule,
    //...
    ]
//...
})
```

Now they will be available to use in the module's components inside their templates:

```html
<neurone-navbar-component></neurone-navbar-component>
<neurone-serp-component></neurone-serp-component>
<neurone-forms-component></neurone-forms-component>
<neurone-synthesis-component></neurone-synthesis-component>
```

The source code repository also has a project that has the components already setup and ready to be used in a singular page, as an [example for their use with their configurable parameters](frontend/neurone-web-components/src/app/app.component.html). Open in a terminal the folder in `frontend/neurone-web-components` and use `ng serve` to run the project.

## Back-end components

They are separate Node.js applications, and they are necessary to properly make use of the front-end components, otherwise they are very limited. Not all of the back-end components are used in every front-end component.

The back-end components are[:](https://github.com/cccarl/neurone-auth)

* [Neurone Auth](https://github.com/cccarl/neurone-auth): handles user accounts and auth services.
* [Neurone Profile](https://github.com/cccarl/neurone-profile): saves the user data of each user using the mongoDB database.
* [Neurone Search](https://github.com/cccarl/neurone-search): used mainly by the SERP front-end, handles the communication with Solr, it is also used to download, clean and store the webpages that are shown in the SERP.

If the main repository of NEURONE is cloned ([using recursive-submodules to download the external back-end submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)) you can use [PM2](https://pm2.keymetrics.io/) to execute the [pm2-neurone-backend.config.js](pm2-neurone-backend.config.js) [ecosystem file](https://pm2.keymetrics.io/docs/usage/application-declaration/) and quickly have the back-end running, make sure to check and change the environment variables to fit your needs.&#x20;

You can also download/clone the back-end components separately and run them with the same PM2 ecosystem file, just make sure to target the correct folders shown in the `script` fields of the file.

Without PM2, you can run the back-end components manually using in the root folder of the components `tsc && node dist/app.js` or in development mode using `npm run dev:server` , which will also enable reloading the server once there is a change in a file. Note that you will need a `.env` file with the environment variables, or set them directly in the terminal.

## Installation of Solr for Neurone-Search and Neurone-SERP

Neurone-Search is in charge of downloading, and storing documents that will be provided in Neurone-SERP. It currently uses Apache Solr to index and execute search queries. The installation process for ubuntu based linux distributions is:

#### 1. Install Java

Open the terminal and input:

```bash
sudo apt install openjdk-11-jdk
```

#### 2. Install Apache Solr

<pre class="language-bash"><code class="lang-bash">cd /tmp
<strong>wget https://dlcdn.apache.org/solr/solr/9.0.0/solr-9.0.0.tgz
</strong>tar xzf solr-9.0.0.tgz solr-9.0.0/bin/install_solr_service.sh --strip-components=2
sudo bash ./install_solr_service.sh solr-9.0.0.tgz</code></pre>

This downloads the installer in a temporal folder, extracts it, and installs it.

Check the status of the service with:

```bash
sudo service solr status
```

You can manually start and stop the service with:

```bash
sudo service solr start
sudo service solr stop
```

#### 3. Create the neurone core

```bash
 sudo su - solr -c "/opt/solr/bin/solr create -c neurone -n data_driven_schema_configs"
```

Note that you can name the core any name you want, and use the environment variables of Neurone-Search to change the default name, but "neurone" is the default name Neurone-Search will look for.

#### 4. Downloading documents for Neurone-SERP

Using a program like [Postman](https://www.postman.com/) you can use the Neurone-Search API to download webpages and have them available to search in the SERP. Simply do a POST request to [http://localhost:3001/download](http://localhost:3001/download) (3001 being the default port) once Neurone-Search is running, the download data will be read in a JSON, here is an example:

```json
{
    "url": "https://imagine.gsfc.nasa.gov/science/objects/milkyway1.html",
    "docName": "milky-way",
    "title": "The Milky Way",
    "searchSnippet": ["There are billions of other galaxies in the Universe. Only three galaxies outside our own Milky Way Galaxy can be seen without a telescope, and appear ", "but its getting closer, and researchers predict that in about 4 billion years it will collide with the Milky Way"],
    "tags": ["galaxy", "educational"],
    "keywords": ["galaxy", "milky", "astronomy"],
    "locale": "en",
    "relevant": true,
    "maskedUrl": "https://imagine.gsfc.nasa.gov/milky-way"
}
```

For more details, read the documentation in each component's page, it's also posible to communicate directly with the API provided by the back-end components instead of using the Angular components, so a completely different front-end can be built for this framework.

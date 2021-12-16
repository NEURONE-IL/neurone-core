const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files = [
    './dist/neurone-web-components/runtime.js',
    './dist/neurone-web-components/polyfills.js',
    //'./dist/neurone-web-components/scripts.js',
    './dist/neurone-web-components/main.js'
  ]

  await fs.ensureDir('elements');
  try{
    await concat(files, 'elements/neurone-web-components.js')
  } catch(err) {
    console.error(err);
  }
}) ();

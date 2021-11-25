module.exports = {
  apps : [{
    name   : "Neurone Forms",
    script : "cd ./backend/neurone-forms/ && npm install && tsc && node dist/app.js"
  },
  {
    name   : "Neurone Search",
    script : "cd backend/neurone-search/ && npm install && tsc && node dist/app.js"
  }]
}

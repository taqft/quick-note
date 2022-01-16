const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// Generate unique ids for notes
const {
  v4: uuidv4
} = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Parse JSON and urlencoded form data
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for notes data (from json db)
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

/**
 *  Function to write data to a JSON file given a destination and some content
 *  @param {string} destination The file to be written to.
 *  @param {object} content The content to be written to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`Data written to ${destination}`)
  );

/**
 *  Function to read data from a given JSON file and append some content
 *  @param {object} content The content to be appended to the file
 *  @param {string} file The path to the file for appending content to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// Post Route for notes data (into json db)
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  // Destructuring assignment for the items in req.body
  const {
    title,
    text,
  } = req.body;

  // only continue if properties are present in the response body
  if (title && text) {
    // create the new note for storage
    const newNote = {
      title: title,
      text: text,
      id: uuidv4(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    readAndAppend(newNote, './db/db.json');
    res.status(201).json(`Note added successfully ✔️`);
  } else {
    res.status(500).json('Error in saving note');
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

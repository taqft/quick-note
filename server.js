const express = require('express');
const path = require('path');

// Generate unique ids for notes
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Parse JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
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

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
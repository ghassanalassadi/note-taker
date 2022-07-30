const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require('path');
const uuid = require("./helpers/uuid");

const PORT = 3002;
const app = express();

// set up middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully added note!'));
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(400).json('Error posting note')
    }
});

app.delete('/notes/api/:note_id', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

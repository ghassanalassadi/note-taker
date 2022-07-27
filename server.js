const express = require("express");
const fs = require("fs");
const path = require('path');
const savedNotes = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.post('/notes', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };

        fs.readFile(savedNotes, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile(savedNotes, JSON.stringify(parsedNotes, null, 2));
            }
        })

        const response = {
            status: 'success',
            body: newNote
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(400).json('Error posting note')
    }
})


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

const express = require("express");
const fs = require("fs");
const path = require('path');
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;
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
    res.sendFile(path.join(__dirname, './db/db.json'));
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
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.info('Note saved successfully.')
                    }
                })
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

// deleting notes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const notes = JSON.parse(data);
            const deleteNotes = notes.filter((note) => note.id !== noteId);
            fs.writeFile('./db/db.json', JSON.stringify(deleteNotes, null, 4), (err) => {
                if (err) {
                    console.error(err)
                } else {
                    console.info('Note successfully deleted.')
                }
            })
        }
    })
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

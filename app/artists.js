const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const Artist = require('../models/Artist');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
})

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    Artist.find()
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.post('/', upload.single('photo'), (req, res) => {
    const artistData = req.body;
    if (req.file) {
        artistData.image = req.file.filename;
    }
    const artist = new Artist(artistData);
    artist.save()
        .then(result => res.send(result))
        .catch((error) => res.sendStatus(400).send(error))
})


module.exports = router;

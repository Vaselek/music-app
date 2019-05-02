const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');



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

router.post('/:id/publish', [auth, permit('admin')], (req, res) => {
    Artist.findById(req.params.id)
        .then(artist => {
            artist.published = true;
            artist.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', upload.single('photo'), (req, res) => {
    const artistData = {
        name: req.body.name,
        description: req.body.description

    };
    if (req.file) {
        artistData.photo = req.file.filename;
    }
    const artist = new Artist(artistData);
    artist.save()
        .then(result => res.send(result))
        .catch((error) => res.sendStatus(400).send(error))
});

router.delete('/:id', [auth, permit('admin')], (req, res) => {
    Artist.findById(req.params.id)
        .then(artist => {
            artist.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});



module.exports = router;

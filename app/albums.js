const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');

const Album = require('../models/Album');
const ObjectId = require('mongoose').Types.ObjectId;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.artist)
        return Album.find({artist: new ObjectId(req.query.artist)}).sort([['issuedAt', 1]])
            .then(albums => res.send(albums))
            .catch(() => res.sendStatus(500))
    Album.find()
        .then(albums => res.send(albums))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Album.findById(req.params.id).populate('artist')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404);
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', upload.single('image'), (req, res) => {
    const albumData = {
        title: req.body.title,
        artist: req.body.artist,
        issuedAt: req.body.issuedAt

    };
    if (req.file) {
        albumData.image = req.file.filename;
    }
    const album = new Album(albumData);
    album.save()
        .then(result => res.send(result))
        .catch((error) => res.sendStatus(400).send(error))
});

router.delete('/:id', [auth, permit('admin')], (req, res) => {
    Album.findById(req.params.id)
        .then(album => {
            album.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/:id/publish', [auth, permit('admin')], (req, res) => {
    Album.findById(req.params.id)
        .then(album => {
            album.published = true;
            album.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});


module.exports = router;

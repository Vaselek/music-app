const express = require('express');

const Track = require('../models/Track');
const Album = require('../models/Album');
const ObjectId = require('mongoose').Types.ObjectId;
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');


const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.album)
        return Track.find({album: new ObjectId(req.query.album)}).sort([['sequence', 1]])
            .then(tracks => res.send(tracks))
            .catch(() => res.sendStatus(500))
    if (req.query.artist) {
        return Album.find({artist: new ObjectId(req.query.artist)})
            .then(albums => {
                const tracks = albums.map(album => Track.find({ album: new ObjectId(album._id) }))
                Promise.all(tracks).then(function(results) {
                    return res.send(results[0])
                })

            })
            .catch(() => res.sendStatus(500))
    }
    Track.find()
        .then(tracks => res.send(tracks))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Track.findById(req.params.id).populate('author')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404);
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', (req, res) => {
    const trackData = {
        title: req.body.title,
        album: req.body.album,
        sequence: req.body.sequence,
        duration: req.body.duration

    };
    const track = new Track(trackData);
    track.save()
        .then(result => res.send(result))
        .catch((error) => res.sendStatus(400).send(error))
});

router.delete('/:id', [auth, permit('admin')], (req, res) => {
    Track.findById(req.params.id)
        .then(track => {
            track.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/:id/publish', [auth, permit('admin')], (req, res) => {
    Track.findById(req.params.id)
        .then(track => {
            track.published = true;
            track.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});


module.exports = router;

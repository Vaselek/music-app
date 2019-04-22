const express = require('express');

const TrackHistory = require('../models/TrackHistory');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const auth = require('../middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId;

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const trackHistoryData = req.body;
    trackHistoryData.dateTime = new Date().toISOString();
    trackHistoryData.user = req.user.id;

    const trackHistory = new TrackHistory(trackHistoryData);
    trackHistory.save()
        .then(result => res.send(result))
        .catch((error) => res.send(error))
});

router.get('/', auth, async (req, res) => {
    return TrackHistory
        .find({user: new ObjectId(req.user.id)})
        .sort([['dateTime', -1]])
        .populate('track')
        .then(async trackHistories => {
            const populatedTrackHistories = await Promise.all(trackHistories.map(async trackHistory => {
                const album = await Album.findOne({_id: new ObjectId(trackHistory.track.album)});
                const artist = await Artist.findOne({_id: new ObjectId(album.artist)});
                const trackHistoryObj = trackHistory.toObject();
                trackHistoryObj.artist = artist;
                return trackHistoryObj
            }))
            res.send(populatedTrackHistories)
        })
        .catch(() => res.sendStatus(500))
});


module.exports = router;
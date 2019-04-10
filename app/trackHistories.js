const express = require('express');

const TrackHistory = require('../models/TrackHistory');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const token = req.get('token');
    const user = await User.findOne({token: token});
    if(user) {
        const trackHistoryData = req.body;
        trackHistoryData.dateTime = new Date().toISOString();
        trackHistoryData.user = user.id;

        const trackHistory = new TrackHistory(trackHistoryData);
        trackHistory.save()
            .then(result => res.send(result))
            .catch((error) => res.send(error))
    } else {
        return res.status(401).send({error: 'Unauthorized'});
    }
});


module.exports = router;
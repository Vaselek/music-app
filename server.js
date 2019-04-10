// const Link = require('./models/Link');
// const links = require('./app/links');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const albums = require('./app/albums');
const artists = require('./app/artists');
const tracks = require('./app/tracks');
const users = require('./app/users');
const trackHistories = require('./app/trackHistories');

const port = 8000;

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/albums', albums);
    app.use('/artists', artists);
    app.use('/tracks', tracks);
    app.use('/users', users);
    app.use('/track_histories', trackHistories);
    app.listen(port, () => {
        console.log(`Server started on ${port} port`)
    })
})
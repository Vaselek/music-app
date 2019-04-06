const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: {
        type: String, required: true
    },
    surname: {
        type: String
    },
    photo: {
        type: String
    },
    description: {
        type: String
    }
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
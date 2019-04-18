const mongoose = require('mongoose');
const config = require('./config');

const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Track = require('./models/Track');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }

    let artists = await Artist.create(
        {name: 'LP', photo: 'lp.jpg', description: 'Great artist!'},
        {name: 'Muse', photo: 'muse.jpg', description: 'Super group!'},
    )

    let albums = await Album.create(
        {
            title: 'Recovery',
            artist: artists[0]._id,
            issuedAt: '2015-10-05T14:48:00.000',
            issuedYear: '2015',
            image: 'recovery_album.jpg'
        },
        {
            title: 'Forever',
            artist: artists[0]._id,
            issuedAt: '2016-10-05T14:48:00.000',
            issuedYear: '2016',
            image: 'lp_forever_album.jpg'
        },
        {
            title: 'Simulation Theory',
            artist: artists[1]._id,
            issuedAt: '2018-10-05T14:48:00.000',
            issuedYear: '2018',
            image: 'simulation_theory_album.jpg'
        }
    )

    await Track.create(
        {
            title: 'Lost on you',
            album: albums[0]._id,
            duration: 2.30,
            sequence: 1
        },
        {
            title: 'Lost on you 2',
            album: albums[0]._id,
            duration: 2.30,
            sequence: 2
        },
        {
            title: 'Algorithm',
            album: albums[2]._id,
            duration: 3.00,
            sequence: 1
        }
    )

    await connection.close();
};

run().catch(error => {
    console.error('Smt went wrong', error);
});


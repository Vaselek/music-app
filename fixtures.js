const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require('nanoid');

const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Track = require('./models/Track');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }

    await User.create({
        username: 'user',
        password: '123',
        role: 'user',
        token: nanoid()
    }, {
        username: 'admin',
        password: '123',
        role: 'admin',
        token: nanoid()
    });

    let artists = await Artist.create(
        {name: 'LP', photo: 'lp.jpg', description: 'Great artist!', published: true},
        {name: 'Muse', photo: 'muse.jpg', description: 'Super group!', published: true},
    )

    let albums = await Album.create(
        {
            title: 'Recovery',
            artist: artists[0]._id,
            issuedAt: '2015-10-05T14:48:00.000',
            image: 'recovery_album.jpg',
            published: true

        },
        {
            title: 'Forever',
            artist: artists[0]._id,
            issuedAt: '2016-10-05T14:48:00.000',
            image: 'lp_forever_album.jpg',
            published: true
        },
        {
            title: 'Simulation Theory',
            artist: artists[1]._id,
            issuedAt: '2018-10-05T14:48:00.000',
            image: 'simulation_theory_album.jpg',
            published: true
        }
    );

    const trackSeeds = albums.map(album => {
        return ['track 1', 'track 2', 'track 3', 'track 4', 'track 5'].map((track, index) => {
            return {
                title: track,
                album: album._id,
                duration: Math.floor(Math.random()*100)/10,
                sequence: (index + 1),
                published: true
            }
        })
    });

    await Track.create(trackSeeds.flat(2));

    await connection.close();
};

run().catch(error => {
    console.error('Smt went wrong', error);
});


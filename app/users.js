const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    const user = new User(req.body);
    user.generateToken();
    user.save()
        .then(user => res.send({message: 'User registered', user}))
        .catch(error => res.status(400).send(error))
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
        return res.status(400).send({error: 'Username not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
        return res.status(400).send({error: 'Password is wrong'});
    }
    user.generateToken();
    await user.save();
    return res.send({message: 'Login successful', user})
});

module.exports = router;
const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    mongoOptions: {useNewUrlParser: true},
    dbUrl: 'mongodb://localhost/music',
    facebook: {
        appId: '634350103696443',
        appSecret: 'c2c42220b9c7a2e65dcc0d3643119726'
    }
}
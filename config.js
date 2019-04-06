const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    mongoOptions: {useNewUrlParser: true},
    dbUrl: 'mongodb://localhost/music'
}
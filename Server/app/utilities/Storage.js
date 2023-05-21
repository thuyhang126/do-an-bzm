'use strict'

const path = require('path');
const multer = require('multer');
const appConfig = require('@config/app');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appConfig.uploadDestination);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

const multipleFile = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'card_visit', maxCount: 1 }, {name: 'images', maxCount: 10}]);

module.exports = multipleFile;


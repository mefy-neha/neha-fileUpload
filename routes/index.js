var express = require('express');
var router = express.Router();
// import multer and the AvatarStorage engine
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var AvatarStorage = require('../helpers/AvatarStorage');
var file = require('../image.model');
var fs = require('fs');
var upload = multer({ dest: 'fileUpload/' });




/**************API FOR  ONLY IMAGE POST AND GET**************************** */
// setup a new instance of the AvatarStorage engine 
var storage = AvatarStorage({
    square: true,
    responsive: true,
    greyscale: true,
    quality: 90
});

var limits = {
    files: 1, // allow only 1 file per request
    fileSize: 1024 * 1024, // 1 MB (max file size)
};

var fileFilter = function (req, file, cb) {
    // supported image file mimetypes
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (_.includes(allowedMimes, file.mimetype)) {
        // allow supported image files
        cb(null, true);
    } else {
        // throw error for invalid files
        cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
    }
};

// setup multer
var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Upload Avatar', avatar_field: 'avatar' });
});

router.post('/upload', upload.single('avatar'), function (req, res, next) {

    var files;
    var file = req.file.filename;
    var fileId = file.split('_')
    console.log('fileId', fileId)
    console.log(file)
    var matches = file.match(/^(.+?)_.+?\.(.+)$/i);
    let imageResponse = {}
    if (matches) {
        files = _.map(['lg', 'md', 'sm'], function (size) {
            return matches[1] + '_' + size + '.' + matches[2];
        });
    } else {
        files = [file];
    }

    files = _.map(files, function (file) {
        var port = req.app.get('port');
        var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
        var url = path.join(req.file.baseUrl, file).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

        return (req.file.storage == 'local' ? base : '') + '/' + url;
    });
    // console.log('dfgsdhfshdfb...............',res.json(imageResponse.file.originalname))
    // console.log(res.json(imageResponse))

    res.json({
        error: false,
        images: files,
        imageId: fileId[0],
        message: "file uploaded successful.",
        // response:res.file

    });

});
//storage for files
var storagee = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, './fileUpload')
    },

    filename: function (request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

    }

});
/************** END OF API FOR  ONLY IMAGE POST AND GET**************************** */


/*********************Api for FILE(any file) Upload*************************************/

router.post('/uploaded', (request, response) => {
    var image;
    let imageResponse = {};

    var upload = multer({
        storage: storagee,
        fileFilter: function (request, file, cb) {
            var ext = path.extname(file.originalname);
            cb(null, true)
        }
    }).single('file');

    upload(request, response, function (error) {

        if (error) {
            console.log('erorr', error)
            // throw error;
            imageResponse.error = true;
            imageResponse.message = `Error :` + error.message;
            response.status(500).json(imageResponse);
        }
        else if (request.file) {
            // console.log(request);
            image = request.file;

            let data = new file({
                file: image
            });

            data.save((error, result) => {
                if (error) {
                    imageResponse.error = true;
                    imageResponse.message = `Error :` + error.message;
                    response.status(500).json(imageResponse);
                }
                else if (result) {
                    imageResponse.error = false;
                    imageResponse.upload = result;
                    imageResponse.message = `file uploaded successful.`;
                    response.status(200).json(imageResponse);
                }
                else {
                    imageResponse.error = true;
                    imageResponse.message = `file not uploded.`;
                    response.status(500).json(imageResponse);
                }
            });
        }
    });
});
/* Api for get Image through their Id
*/
router.get('/getImage', (request, response) => {
    let imageResponse = {};
    console.log("image display");
    console.log(request.query);
    file.findById(request.query.imageId, (error, result) => {
        if (error) {
            imageResponse.error = true;
            imageResponse.message = `Server error : ` + error.message;
            response.status(500).json(imageResponse);
        }
        else if (result) {
            response.set({
                "Content-Disposition": 'attachment; filename="' + result.file.originalname + '"',
                "Content-Type": result.file.mimetype
            });
            fs.createReadStream(result.file.path).pipe(response);
        }
        else {
            imageResponse.error = true;
            imageResponse.message = `No such image available`;
            response.status(500).json(imageResponse);
        }
    })
});

module.exports = router;

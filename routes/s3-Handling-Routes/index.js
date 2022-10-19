const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../../images/'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    } 
})

const upload = multer({storage: fileStorageEngine })

const { uploadFileToS3 } = require('../../services/s3-handling.service')

router.post('/', upload.single('image'), uploadFileToS3);

module.exports = router;

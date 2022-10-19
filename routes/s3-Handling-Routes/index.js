const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')

const { uploadFileToS3, getFileFromS3, listFilesFromS3, 
        updateFileInS3, deleteFileFromS3, getFilePublicUrl } = require('../../services/s3-handling.service')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../../images/'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    } 
})

const upload = multer({storage: fileStorageEngine })

router.post('/', upload.single('image'), uploadFileToS3);
router.get('/list', listFilesFromS3);
router.get('/signedUrl', getFilePublicUrl);
router.get('/:imageId', getFileFromS3);
router.put('/', upload.single('image'), updateFileInS3);
router.delete('/', deleteFileFromS3);


module.exports = router;

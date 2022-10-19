const AWS = require('aws-sdk');
const fs = require('fs')

const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const constant = require('../helpers/constant');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const uploadFileToS3 = async (req, res) => {
    try {
        const imagePath = req.file.path;
        const blob = fs.readFileSync(imagePath);

        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${Date.now()}`,
            Body: blob,
        }).promise()
        // uploadedImage.Location  (s3 location of the image)   
        // delete the file from the server after upload to s3
        await unlinkAsync(req.file.path)
        res.status(200).send(constant.success)
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

const getFileFromS3 = async (req, res) => {
    try {
        const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: req.params.imageId };
        s3.getObject(params, function (err, data) {
            if (err) {
                return res.status(500).send(constant.unknownError)
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.write(data?.Body, 'binary');
            res.end(null, 'binary');
        });
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

const listFilesFromS3 = async (req, res) => {
    try {
        const params = { Bucket: process.env.AWS_S3_BUCKET_NAME };
        s3.listObjectsV2(params, function (err, data) {
            if (err) {
                return res.status(500).send(constant.unknownError)
            }
            res.status(200).send({ data })
        });
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

const updateFileInS3 = async (req, res) => {
    try {
        const { imageKey } = req.body;
        const imagePath = req.file.path;
        const blob = fs.readFileSync(imagePath);

        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKey,
            Body: blob,
        }).promise()
        // uploadedImage.Location  (s3 location of the image)   
        // delete the file from the server after upload to s3
        await unlinkAsync(req.file.path)
        res.status(200).send(constant.success)
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

const deleteFileFromS3 = async (req, res) => {
    try {
        const { imageKey } = req.body;
        var params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: imageKey };

        s3.deleteObject(params, function (err, data) {
            if (err)  return res.status(500).send(constant.unknownError)
            res.status(200).send(constant.success)
        });
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

const getFilePublicUrl = async (req, res) => {
    try {
        const { imageKey } = req.body;

        const signedUrlExpireSeconds = 60 * 5; // 5 min access to the image
        const url = s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKey,
            Expires: signedUrlExpireSeconds
        })
        res.status(200).send({signedUrl: url});
    } catch (error) {
        res.status(500).send(constant.unknownError)
    }
}

exports.uploadFileToS3   = uploadFileToS3
exports.getFileFromS3    = getFileFromS3
exports.listFilesFromS3  = listFilesFromS3
exports.updateFileInS3   = updateFileInS3
exports.deleteFileFromS3 = deleteFileFromS3
exports.getFilePublicUrl = getFilePublicUrl
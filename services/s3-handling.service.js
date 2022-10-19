const AWS = require('aws-sdk');
const fs = require('fs')

const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const constant = require('../helpers/constant');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})

const uploadFileToS3 = async (req, res) => {
    try {
        const imagePath = req.file.path;
        const blob = fs.readFileSync(imagePath);

        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: Date.now(),
            Body: blob,
        }).promise()
        // uploadedImage.Location  (s3 location of the image)   
        // delete the file from the server after upload to s3
        await unlinkAsync(req.file.path)
        res.status(200).send(constant.success)
    } catch (error) {
        console.log(error)
        res.status(500).send(constant.unknownError)
    }
}

exports.uploadFileToS3 = uploadFileToS3


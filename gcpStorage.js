const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const { AUDIO_FILE_EXTENTION, SERVICE_ACCOUNT_JSON_FILE_PATH, CLOUD_STORAGE_BUCKET_NAME } = require('./constant');

/**
 * Provide path of your service account credential file
 * generally you keep it in the same folder
 * keyFilename = YOUR_SERVICE_ACCOUNT_CREDENTIAL_JSON_FILE_PATH
 * bucketName = YOUR_GCP_CLOUD_STORAGE_BUCKET_NAME
 */
const storage = new Storage({
    keyFilename: SERVICE_ACCOUNT_JSON_FILE_PATH,
});

const bucketName = CLOUD_STORAGE_BUCKET_NAME;

const uploadAudioFile = async (audioFilePath) => {
    try {
        const destinationFileName = `${uuidv4()}.${AUDIO_FILE_EXTENTION}`;
        await storage.bucket(bucketName).upload(audioFilePath, {
            destination: destinationFileName,
        });
        console.log(`Audio file ${audioFilePath} uploaded to ${bucketName}/${destinationFileName}`);
        await storage
            .bucket(bucketName)
            .file(destinationFileName)
            .makePublic();
        console.log(`Audio file is now publicly accessible.`);
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
        return {
            status: 1,
            publicUrl: publicUrl
        };
    } catch (err) {
        console.log(`Error at uploadAudioFile -> ${error}`);
        return {
            status: 0,
            publicUrl: ""
        };
    }
};

module.exports = {
    uploadAudioFile
};

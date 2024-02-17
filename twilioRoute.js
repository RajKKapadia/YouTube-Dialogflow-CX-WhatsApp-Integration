const express = require('express');
const router = express.Router();

const { detectIntentText } = require('./dialogflowApi');
const { uploadAudioFile } = require('./gcpStorage');
const { textToSpeechOpenai } = require('./openaiApi');
const { sendTwilioMessage } = require('./twilioApi');

router.post('/webhook', async (req, res) => {
    try {
        const query = req.body.Body;
        const senderId = req.body.From;
        console.log(query);
        console.log(senderId);
        /**
         * (1) detect the intent and get response from Dialogflow
         * (2) convert the text to audio
         * (3) upload the file on the GCP storage
         * (4) send message back to WhatsApp as audio note
         */
        const dialogflowResponse = await detectIntentText(query, `${senderId}`);
        console.log(dialogflowResponse);
        const openaiResponse = await textToSpeechOpenai(dialogflowResponse.response);
        console.log(openaiResponse);
        const gcpStorageResponse = await uploadAudioFile(openaiResponse.audioFilePath);
        console.log(gcpStorageResponse);
        await sendTwilioMessage(gcpStorageResponse.publicUrl, senderId);
        console.log('Request success.');
    } catch (error) {
        console.log(`Error at /twilio/webhook -> ${error}`);
    }
    res.send('OK');
});

module.exports = {
    router
};

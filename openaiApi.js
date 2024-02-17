const fs = require("fs");
const path = require('path');
const os = require("os");

const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require("openai");
require("dotenv").config();

const { AUDIO_FILE_EXTENTION, OPENAI_API_KEY } = require('./constant');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const textToSpeechOpenai = async (text) => {
    try {
        const audioFilePath = path.join(os.tmpdir(), `${uuidv4()}.${AUDIO_FILE_EXTENTION}`);
        const aac = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
            response_format: `${AUDIO_FILE_EXTENTION}`
        });
        const buffer = Buffer.from(await aac.arrayBuffer());
        await fs.promises.writeFile(audioFilePath, buffer);
        return {
            status: 1,
            audioFilePath: audioFilePath
        }
    } catch (error) {
        console.log(`Error at textToSpeechOpenai -> ${error}`);
        return {
            status: 0,
            audioFilePath: ''
        };
    }
};

module.exports = {
    textToSpeechOpenai
};

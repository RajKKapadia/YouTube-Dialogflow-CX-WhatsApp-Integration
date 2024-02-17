require('dotenv').config();

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

const sendTwilioMessage = async (mediaUrl, senderID) => {

    try {
        const response = await client.messages.create({
            to: senderID,
            mediaUrl: [mediaUrl],
            from: process.env.FROM
        });
        console.log(response.sid);
    } catch (error) {
        console.log(`Error at sendMessage --> ${error}`);
    }
};

module.exports = {
    sendTwilioMessage
};

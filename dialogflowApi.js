const fs = require('fs');

const { SessionsClient } = require('@google-cloud/dialogflow-cx');

const { SERVICE_ACCOUNT_JSON_FILE_PATH, DIALOGFLOW_CX_AGENT_ID, DIALOGFLOW_CX_AGENT_LOCATION } = require('./constant');

/**
 * Replace this things with your actual values
 * projectId = 'YOUR_GCP_PROJECT_ID'
 * location = 'LOCATION_OF_THE_AGENT'
 * agentId = 'DIALOGFLOW_CX_AGENT_ID'
 * languageCode = 'en'
 * Provide path of your service account credential file
 * generally you keep it in the same folder
 * Also make sure this part has the same location
 * apiEndpoint: 'us-central1-dialogflow.googleapis.com'
 */

const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_JSON_FILE_PATH));
const projectId = credentials.project_id;
const location = DIALOGFLOW_CX_AGENT_LOCATION;
const agentId = DIALOGFLOW_CX_AGENT_ID;
const languageCode = 'en';

const client = new SessionsClient({
    credentials: {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        client_email: credentials.client_email,
        private_key: credentials.private_key
    },
    apiEndpoint: `${location}-dialogflow.googleapis.com`
});


const detectIntentText = async (query, sessionId) => {
    try {
        const sessionPath = client.projectLocationAgentSessionPath(
            projectId,
            location,
            agentId,
            sessionId
        );
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                },
                languageCode,
            },
        };
        const [response] = await client.detectIntent(request);
        for (const message of response.queryResult.responseMessages) {
            if (message.text) {
                return {
                    status: 1,
                    response: message.text.text[0]
                };
            }
        }
        return {
            status: 0,
            response: 'We are facing a technical issue at this time, please try after sometimes.'
        };
    } catch (error) {
        console.log(`Error at detectIntentText -> ${error}`);
        return {
            status: 0,
            response: 'We are facing a technical issue at this time, please try after sometimes.'
        };
    }
};

module.exports = {
    detectIntentText
};

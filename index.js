'use strict';
const line = require('@line/bot-sdk');
require('dotenv').config();
const env = process.env;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: env.CLIENT_SECLET,
    channelAccessToken: env.ACCESS_TOKEN
}

const client = new line.Client(config);

// const app = express();
app.listen(process.env.PORT || 3000);

app.get('/',  (req, res) => {
    res.send('hello world');
})

app.post('/callback', line.middleware(config), (req, res) => {
    res.sendStatus(200);
    console.log(req);
    Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

function handleEvent(event) {
    if (event.type === 'things') {
        handleThingsEvent(event);
    } else {
        handleMessageEvent(event);
    }
}

function handleThingsEvent(event) {
    console.log('event', event);
    const echo =  { type: 'text', text: 'Things Event' };
    return client.replyMessage(event.replyToken, echo)
    .then((res) => console.log('Success: ', res))
    // .catch((error) => console.log('Error: ', error));
}

function handleMessageEvent(event) {
    const echo =  { type: 'text', text: 'Message Event' };
    return client.replyMessage(event.replyToken, echo)
    .then((res) => console.log('Success: ', res))
    // .catch((error) => console.log('Error: ', error));
}

console.log(`Server running at ${PORT}`);
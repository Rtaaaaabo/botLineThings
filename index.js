'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

const config = {
    channelAccessToken: 'PBX1BDMTYQeXKp82t70h07ykClW2uOyh7V0tgwnFASTCflrQ29R4jJxiHsT5LoUEGzwFNkIxue0LTI3HiIkhG0FKdHeX1u4WKc3aZ4jAll0EvTk97/hlc+IT8UmApgD/DYtUDdQrA4RjTyILdrXjzQdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'e515e7e7cf93bd9782f02408380f2b1f'
}

const client = new line.Client(config);
const app = express();

app.get('/',  (req, res) => {
    res.send('hello world')
})

app.post('/callback', line.middleware(config), (req, res) => {
    res.sendStatus(200);
    Promise.all(req.body.events.map(handleEvent))
});

function handleEvent(event) {
    if (event.type === 'things') {
        handleThingsEvent(event);
    } else {
        handleMessageEvent(event);
    }
}

function handleThingsEvent(event) {
    const echo =  { type: 'text', text: 'Things Event' };
    return client.replyMessage(event.replyMessage, echo)
    .then((res) => console.log('Success: ', res))
    .catch((error) => console.log('Error: ', error));
}

function handleMessageEvent(event) {
    const echo =  { type: 'text', text: 'Message Event' };
    return client.replyMessage(event.replyMessage, echo)
    .then((res) => console.log('Success: ', res))
    .catch((error) => console.log('Error: ', error));
}
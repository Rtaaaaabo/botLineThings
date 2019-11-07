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

const BufferData = {
  count0: { value: [0], message: 'センサー 0個', countSensor: 0 },
  count1: { value: [1, 2, 4, 8], message: 'センサー 1個', countSensor: 1 },
  count2: { value: [3, 5, 6, 9, 10, 12], message: 'センサー 2個', countSensor: 2 },
  count3: { value: [7, 11, 13, 14], message: 'センサー 3個', countSensor: 3 },
  count4: { value: [15], message: 'センサー 4個', countSensor: 4 },
};

const client = new line.Client(config);

let currentSensor = 0;

  // const app = express();
  app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('hello world');
})

app.post('/callback', line.middleware(config), (req, res) => {
  res.sendStatus(200);
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
  const payLoad = event.things.result.bleNotificationPayload;
  const buffPayLoad = Buffer.from(payLoad, 'base64');
  const countSensor = new Int8Array(buffPayLoad);
  const message = jugmentCountSensor(countSensor[0])
  const echo = { type: 'text', text: message };
  return client.replyMessage(event.replyToken, echo)
};

function handleMessageEvent(event) {
  const echo = { type: 'text', text: 'Message Event' };
  return client.replyMessage(event.replyToken, echo)
};

function jugmentCountSensor(sensor) {
  if (BufferData.count0.value.indexOf(sensor) > -1) {
    if (currentSensor !== BufferData.count0.countSensor) {
      currentSensor = BufferData.count0.countSensor;
      return (BufferData.count0.message)
    }
  } else if (BufferData.count1.value.indexOf(sensor) > -1) {
    if (currentSensor !== BufferData.count1.countSensor) {
      currentSensor = BufferData.count1.countSensor;
      return (BufferData.count1.message)
    }
  } else if (BufferData.count2.value.indexOf(sensor) > -1) {
    if (currentSensor !== BufferData.count2.countSensor) {
      currentSensor = BufferData.count2.countSensor;
      return (BufferData.count2.message)
    }
  } else if (BufferData.count3.value.indexOf(sensor) > -1) {
    if (currentSensor !== BufferData.count3.countSensor) {
      currentSensor = BufferData.count3.countSensor;
      return (BufferData.count3.message)
    }
  } else if (BufferData.count4.value.indexOf(sensor) > -1) {
    if (currentSensor !== BufferData.count4.countSensor) {
      currentSensor = BufferData.count4.countSensor;
      return (BufferData.count4.message)
    }
  }
}

console.log(`Server running at ${PORT}`);
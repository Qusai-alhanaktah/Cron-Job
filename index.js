var admin = require("firebase-admin");
const express = require("express");
const cron = require("node-cron");
var serviceAccount = require('./simple-app-416f2-firebase-adminsdk-gb9xl-e1cedd7a5a.json');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://simple-app-416f2-default-rtdb.firebaseio.com"
});

var message = {
  notification: {
    title: 'Miss You :)',
    body: 'We will be glad when see you activate the app 🔥🔥'
  },
  data: {},
  android: {
    notification: {
      sound: 'default'
    }
  },
  apns: {
    payload: {
      aps: {
        sound: 'default'
      }
    }
  },
  token: 'efzPTQgfSHuNee-z4esT4N:APA91bHXnEse492QxnLb8krKF45yDYwyPobRw8Kkqj3z0T4_sJ_sFW8cwjbK02tYvyRASe9Cgnq75XrwuJTWLbFks--rBcZpgJYiFi3vc7M7aPwRPFH5_ReX8O6asOHbSHrDtAQpaX5G'
}

let task = cron.schedule(`*/1 * * * *`, () => {
  admin.messaging().send(message)
  .then(response => {
    console.log('Message sent Sucessfully', response);
  })
  .catch(error => {
    console.log('error sending a message', error);
  });
}, {
  scheduled: false,
});

app.get('/api/v1/scheduleNotificaions', (req, res) => {
    try {
      task.start();
      res.status(200).send('The notification will send');
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Erorr');
    }
});
app.get('/api/v1/stopScheduleNotificaions', (req, res) => {
    try {
      task.stop();
      res.status(200).send('The notification schedual is stop');
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Erorr');
    }
});

let PORT = 3000;
app.listen(PORT, ()=> console.log(`listenning on port ${3030}`));

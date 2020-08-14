const express = require('express');
const cors = require('cors');
// Firebase
var firebase = require("firebase");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyCO5rfKK8VwJ-v2gS0rXIqZg4aDxj7jCsE",
    authDomain: "ekitchen-daily.firebaseapp.com",
    databaseURL: "https://ekitchen-daily.firebaseio.com",
    projectId: "ekitchen-daily",
    storageBucket: "ekitchen-daily.appspot.com",
    messagingSenderId: "521351929172",
    appId: "1:521351929172:web:eb57221e58dc60765d3cc1",
    measurementId: "G-60CT2EJZYD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(
    express.urlencoded({
        extended: false
    })
);

// Controllers importing
const sendMessageService = require('./controllers/sendMessageService');
const couponController = require('./controllers/couponController');
const addTestDataController = require('./controllers/testDataController');
// Routes registering
const whatsappBotRoute = require('./routes/whatsappRoute');
const dailyMessageRoute = require('./routes/dailyMessageRoute');

app.use(express.json());
app.use('/api/whatsapp/', whatsappBotRoute);
app.use('/api/dailyMessage/', dailyMessageRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        errors: {
            message: err.message
        }
    });
});

app.listen(PORT, () => console.log(`App Listening on port ${PORT}`));

// addTestDataController.addMessages();
// setInterval(() => {
//     orderListServiceController.SendMessage('14155238886', '94710949733', 'Hello Boy', 'https://www.thesun.co.uk/wp-content/uploads/2020/07/AD-COMPOSITE-Mia-Khalifa-V2.jpg?strip=all&quality=100&w=1200&h=800&crop=1').then(
//         res => {
//             console.log(res);
//         },
//         error => {
//             console.log(error);
//         }
//     )
// }, 10000);
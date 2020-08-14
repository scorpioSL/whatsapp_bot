

const twilio = require('twilio');
const accountSid = "ACcb051d059ee888b876c62ba256b9764d";
const TwilloAuthToken = "2e86917ed7e56635624ff0adaafea17a";
const client = twilio(
    accountSid,
    TwilloAuthToken
);


const { MessagingResponse } = twilio.twiml;
var firebase = require("firebase");
const db = firebase.database();
const messageService = require('../controllers/sendMessageService');

var daily = (req, res, next) => {
    const twiml = new MessagingResponse();
    db.ref('customers').once('value', customersSnapshot => {
        if (customersSnapshot.val() != null) {
            let customersRef = customersSnapshot.val();
            let customers = [];
            for (var key in customersRef) {
                if (customersRef.hasOwnProperty(key)) {
                    customers.push({ key: customersRef[key] });
                }
            }
            var index = 0;
            console.log(customers, 'customers');

            db.ref('/messages').orderByChild('type').equalTo("Start").once('value', messageSnapshot => {
                if (messageSnapshot.val() != null) {
                    let msg = messageSnapshot.val();
                    var interval = setInterval(function () {
                        console.log(customers[index], 'customers index');
                        var toSorted = customers[index].key.contactNumber;
                        console.log(toSorted, 'number');

                        let customerMessage = {
                            customer: customers[index].key.userId,
                            message: msg[Object.keys(msg)[0]]
                        }

                        let showMessage = msg[Object.keys(msg)[0]].message;
                        if (msg[Object.keys(msg)[0]].stringFunc) {
                            if (msg[Object.keys(msg)[0]].stringValue == "name") {
                                showMessage = showMessage.replace(/_/g, customers[index].key.fullName);
                            }
                        }
                        


                        if (toSorted != undefined) {
                            messageService.SendMessage('14155238886', toSorted, showMessage)
                                .then(
                                    res => {
                                        console.log(res);
                                        db.ref('/customer_messages').push(customerMessage);
                                    },
                                    error => {
                                        console.log(error);
                                    }
                                );
                        }
                        if (index == customers.length - 1) {
                            clearInterval(interval);
                        }
                        index++;
                    }, 5000)
                }
            });
        }
    });

    res.set('Content-Type', 'text/html');
    return res.status(200).json({ type: 'success' });
}

module.exports = {
    daily
}
const twilio = require('twilio');
const accountSid = "ACcb051d059ee888b876c62ba256b9764d";
const TwilloAuthToken = "2e86917ed7e56635624ff0adaafea17a";

var firebase = require("firebase");
const db = firebase.database();

const sendMessageService = require('../controllers/sendMessageService');

const client = twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;

class WhatsappBot {
    /**
     * @memberof WhatsappBot
     * @param {object} req - Request sent to the route
     * @param {object} res - Response sent from the controller
     * @param {object} next - Error handler
     * @returns {object} - object representing response message
     */
    static async orderResponse(req, res, next) {
        const twiml = new MessagingResponse();
        var answer = req.body.Body;
        var to = req.body.To;
        var from = req.body.From;
        var toSorted = from.split('+')[1];

        try {

            db.ref('/customers').orderByChild('contactNumber').equalTo(toSorted).once('value', (snapshot) => {
                if (snapshot.val() == null && snapshot.val() == undefined) {
                    // Customer not registered in the db
                    twiml.message(`Hello user. I don't know you yet. Please go to the website to get registered!. Thanks`);
                } else {
                    // Known customer
                    console.log('Known Customer');

                    let customer = snapshot.val();
                    // Check previously sent message
                    console.log('Checking previous sent messages');

                    db.ref('/customer_messages').orderByChild('customer').equalTo(Object.keys(customer)[0]).limitToLast(1).once('value', (customerMessageSnapshot) => {
                        // No previous sent message
                        if (customerMessageSnapshot.val() == null || customerMessageSnapshot.val() == undefined) {
                            console.log('No previous messages found!');
                            db.ref('/messages').orderByChild("id").equalTo(1).once('value', (messageSnapshot) => {
                                if (messageSnapshot.val() != null && messageSnapshot.val() != undefined) {

                                    let msg = messageSnapshot.val();
                                    let expectedAnswers = '';

                                    if (msg[Object.keys(msg)[0]].answers.length != undefined) {
                                        expectedAnswers = '\n Please provide one of following answers.\n';
                                        msg[Object.keys(msg)[0]].answers.forEach((element, index) => {
                                            if (element.displayProperty != 'hide')
                                                expectedAnswers += `\n${element.answer}.${element.displayProperty}`;
                                        });
                                    }


                                    let customerMessage = {
                                        customer: Object.keys(customer)[0],
                                        message: msg[Object.keys(msg)[0]]
                                    }

                                    let showMessage = msg[Object.keys(msg)[0]].message;
                                    if (msg[Object.keys(msg)[0]].stringFunc) {
                                        if (msg[Object.keys(msg)[0]].stringValue == "name") {
                                            showMessage = showMessage.replace(/_/g, customer[Object.keys(customer)[0]].fullName);
                                        } else {
                                            db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {
                                                if (couponSnap.val() != null) {
                                                    let items = "";
                                                    let coupons = [];
                                                    let result = couponSnap.val();
                                                    for (var key in result) {
                                                        if (result.hasOwnProperty(key)) {
                                                            coupons.push({ key: result[key] });
                                                        }
                                                    }

                                                    var index = 0;
                                                    var interval = setInterval(function () {
                                                        let splitted = customer[Object.keys(customer)[0]].contactNumber.split('+');
                                                        sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, `${index + 1}.` + coupons[index].key.title, coupons[index].key.artWorkLink)
                                                            .then(res => {
                                                            }, error => {
                                                                console.log(error);
                                                            });
                                                        if (index == coupons.length - 1) {
                                                            console.log('here');

                                                            clearInterval(interval);

                                                            setTimeout(() => {
                                                                sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, 'Please provide one of above answers')
                                                                    .then(
                                                                        res => {
                                                                            console.log(res);
                                                                        },
                                                                        error => {
                                                                            console.log(error);

                                                                        }
                                                                    );
                                                            }, 5000);
                                                        }
                                                        index++;
                                                    }, 5000)

                                                    showMessage = showMessage.replace(/_/g, "");

                                                    if (expectedAnswers != '')
                                                        twiml.message(`${showMessage}`);
                                                    else
                                                        twiml.message(`${showMessage}`);
                                                    res.set('Content-Type', 'text/xml');
                                                    return res.status(200).send(twiml.toString());
                                                }
                                            });
                                        }
                                    }
                                    db.ref('/customer_messages').push(customerMessage);
                                    if (expectedAnswers != '')
                                        twiml.message(`${showMessage}${expectedAnswers}`);
                                    else
                                        twiml.message(`${showMessage}`);
                                    res.set('Content-Type', 'text/xml');
                                    return res.status(200).send(twiml.toString());
                                }
                            });
                        } else {

                            console.log('Found previous messages');

                            // Found previous sent message
                            let customerMassage = customerMessageSnapshot.val();

                            let answers = customerMassage[Object.keys(customerMassage)[0]].message.answers;
                            // Expects an answer for last massage
                            console.log('Checking prevous message expect a answer or not');
                            if (customerMassage[Object.keys(customerMassage)[0]].message.expect) {
                                console.log('Previous message expect an answer')
                                if (answers != undefined) {
                                    console.log('Expecting answers were found');

                                    let reply = null;
                                    if (answers.length != 0) {
                                        let found = false;
                                        answers.forEach(element => {
                                            // Check for matching answer

                                            console.log('checking customer answers are matching to expecting answers');

                                            if (element.answer.toLowerCase().trim() == answer.toLowerCase().trim()) {
                                                console.log('customer answer matches');

                                                found = true;
                                                db.ref('/messages').orderByChild('id').equalTo(element.replyMessage).once('value', replySnap => {
                                                    reply = replySnap.val();

                                                    let expectedAnswers = '';

                                                    if (reply[Object.keys(reply)[0]].answers != undefined) {
                                                        expectedAnswers = '\n Please provide one of following answers.\n';
                                                        reply[Object.keys(reply)[0]].answers.forEach((element, index) => {
                                                            if (element.displayProperty != 'hide')
                                                                expectedAnswers += `\n${element.answer}.${element.displayProperty}`;
                                                        });
                                                    }

                                                    let customerNewMessage = {
                                                        customer: Object.keys(customer)[0],
                                                        message: reply[Object.keys(reply)[0]]
                                                    }
                                                    db.ref('/customer_messages').push(customerNewMessage);



                                                    let showMessage = reply[Object.keys(reply)[0]].message;
                                                    // Check message needed to be edited
                                                    let date = new Date();
                                                    let orderDate = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

                                                    switch (element.func) {
                                                        case 'AddOrder/SendMessage':
                                                            console.log('Answer type was AddOrder/SendMessage');

                                                            // CHeck finished property
                                                            //here check customer date and finished properties
                                                            console.log(customer[Object.keys(customer)[0]], 'id');
                                                            console.log(customer[Object.keys(customer)[0]].userId, 'obj');

                                                            console.log('Checking customer previous orders');

                                                            db.ref('/whatsapp_order').orderByChild('customerid').equalTo(customer[Object.keys(customer)[0]].userId).limitToLast(1).once('value', orderSnap => {
                                                                if (orderSnap.val() == null) {
                                                                    console.log('No previous order found');

                                                                    // new Order

                                                                    let newOrder = Object.assign(
                                                                        {
                                                                            customer: customer[Object.keys(customer)[0]],
                                                                            customerid: customer[Object.keys(customer)[0]].userId,
                                                                            order_date: orderDate,
                                                                            finished: false,
                                                                            coupons: []
                                                                        }
                                                                    );
                                                                    db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {
                                                                        if (couponSnap.val() != null) {
                                                                            let result = couponSnap.val();
                                                                            let coupons = [];
                                                                            for (var key in result) {
                                                                                if (result.hasOwnProperty(key)) {
                                                                                    coupons.push({ key: result[key] });
                                                                                }
                                                                            }
                                                                            console.log('Adding new order with 1 quantity')
                                                                            switch (answer) {
                                                                                case '1':
                                                                                    if (couponSnap.val() != null) {
                                                                                        coupons[0].key['Quantity'] = 1
                                                                                        newOrder.coupons.push(coupons[0].key);
                                                                                        db.ref('/whatsapp_order').push(newOrder);
                                                                                    }
                                                                                    break;
                                                                                case '2':
                                                                                    if (couponSnap.val() != null) {
                                                                                        coupons[1].key['Quantity'] = 1
                                                                                        newOrder.coupons.push(coupons[1].key);
                                                                                        db.ref('/whatsapp_order').push(newOrder);
                                                                                    }
                                                                                    break;
                                                                                case '3':
                                                                                    if (couponSnap.val() != null) {
                                                                                        coupons[2].key['Quantity'] = 1
                                                                                        newOrder.coupons.push(coupons[2].key);
                                                                                        db.ref('/whatsapp_order').push(newOrder);
                                                                                    }
                                                                                    break;
                                                                                default:
                                                                                    break;
                                                                            }
                                                                        }
                                                                    });
                                                                } else {

                                                                    console.log('Customer previous order found!');


                                                                    let lastOrder = orderSnap.val();
                                                                    console.log(lastOrder);

                                                                    console.log('here check');

                                                                    console.log('Check customer previous order finished or not');

                                                                    if (lastOrder[Object.keys(lastOrder)[0]].finished == false) {
                                                                        console.log('Customer previous order not finished');

                                                                        db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {

                                                                            let result = lastOrder;
                                                                            let coupons = [];
                                                                            for (var key in result) {
                                                                                if (result.hasOwnProperty(key)) {
                                                                                    coupons.push({ key: result[key] });
                                                                                }
                                                                            }

                                                                            console.log(lastOrder[Object.keys(lastOrder)[0]], 'Last coupon');
                                                                            console.log(Object.keys(lastOrder)[0], 'Last coupon2');
                                                                            console.log('Adding the new coupon to customer order');
                                                                            if (couponSnap.val() != null) {
                                                                                switch (answer) {
                                                                                    case '1':
                                                                                        if (couponSnap.val() != null) {
                                                                                            lastOrder[Object.keys(lastOrder)[0]].coupons.push(coupons[0].key);
                                                                                        }
                                                                                        break;
                                                                                    case '2':
                                                                                        if (couponSnap.val() != null) {
                                                                                            lastOrder[Object.keys(lastOrder)[0]].coupons.push(coupons[0].key);
                                                                                        }
                                                                                        break;
                                                                                    case '3':
                                                                                        if (couponSnap.val() != null) {
                                                                                            lastOrder[Object.keys(lastOrder)[0]].coupons.push(coupons[0].key);
                                                                                        }
                                                                                        break;
                                                                                    default:
                                                                                        break;
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    else {
                                                                        // call new order function
                                                                        console.log('Customer previous order has finished');
                                                                        let newOrder = Object.assign(
                                                                            {
                                                                                customer: customer[Object.keys(customer)[0]],
                                                                                customerid: customer[Object.keys(customer)[0]].userId,
                                                                                order_date: orderDate,
                                                                                finished: false,
                                                                                coupons: []
                                                                            }
                                                                        );
                                                                        db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {
                                                                            if (couponSnap.val() != null) {
                                                                                let result = couponSnap.val();
                                                                                let coupons = [];
                                                                                for (var key in result) {
                                                                                    if (result.hasOwnProperty(key)) {
                                                                                        coupons.push({ key: result[key] });
                                                                                    }
                                                                                }
                                                                                console.log('Adding new order with 1 quantity')
                                                                                switch (answer) {
                                                                                    case '1':
                                                                                        if (couponSnap.val() != null) {
                                                                                            coupons[0].key['Quantity'] = 1
                                                                                            newOrder.coupons.push(coupons[0].key);
                                                                                            db.ref('/whatsapp_order').push(newOrder);
                                                                                        }
                                                                                        break;
                                                                                    case '2':
                                                                                        if (couponSnap.val() != null) {
                                                                                            coupons[1].key['Quantity'] = 1
                                                                                            newOrder.coupons.push(coupons[1].key);
                                                                                            db.ref('/whatsapp_order').push(newOrder);
                                                                                        }
                                                                                        break;
                                                                                    case '3':
                                                                                        if (couponSnap.val() != null) {
                                                                                            coupons[2].key['Quantity'] = 1
                                                                                            newOrder.coupons.push(coupons[2].key);
                                                                                            db.ref('/whatsapp_order').push(newOrder);
                                                                                        }
                                                                                        break;
                                                                                    default:
                                                                                        break;
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    // Check order finish
                                                                    // Order already added
                                                                }
                                                            });
                                                            break;
                                                        case 'UpdateOrder/SendMessage':
                                                            console.log('Updating coupon quantity');
                                                            console.log(customer[Object.keys(customer)[0]], 'obj');
                                                            console.log(customer[Object.keys(customer)[0]].userId, 'obj');


                                                            db.ref('/whatsapp_order').orderByChild('customerid').equalTo(customer[Object.keys(customer)[0]].userId).limitToLast(1).once('value', orderSnap => {
                                                                console.log('Updateing the customer order with quantity');
                                                                console.log(orderSnap.val(), 'QUantity update db values');
                                                                if (orderSnap.val() != null) {
                                                                    let lastOrder = orderSnap.val();

                                                                    let updateCoupons = lastOrder[Object.keys(lastOrder)[0]].coupons;
                                                                    console.log(updateCoupons, 'UpdateCoupons 1');
                                                                    console.log(answer, 'answer 1');

                                                                    // Just for now
                                                                    updateCoupons[0].Quantity = answer;
                                                                    lastOrder[Object.keys(lastOrder)[0]].coupons = updateCoupons;
                                                                    console.log(lastOrder[Object.keys(lastOrder)[0]], 'after update');
                                                                    console.log(Object.keys(lastOrder)[0], 'update id');

                                                                    db.ref('/whatsapp_order').child(Object.keys(lastOrder)[0]).update(
                                                                        lastOrder[Object.keys(lastOrder)[0]]
                                                                    );
                                                                }
                                                            });
                                                            break;
                                                        case 'Pay':
                                                            console.log('Customer confirmed payment');

                                                            db.ref('/whatsapp_order').orderByChild('customerid').equalTo(customer[Object.keys(customer)[0]].userId).limitToLast(1).once('value', orderSnap => {
                                                                console.log('Updateing the order payment');
                                                                console.log(orderSnap.val(), 'db order');

                                                                if (orderSnap.val() != null) {
                                                                    let lastOrder = orderSnap.val();
                                                                    let updateFinish = lastOrder[Object.keys(lastOrder)[0]];
                                                                    updateFinish.finished = true;
                                                                    lastOrder[Object.keys(lastOrder)[0]] = updateFinish;
                                                                    console.log(lastOrder[Object.keys(lastOrder)[0]], 'with finished true');
                                                                    console.log(Object.keys(lastOrder)[0], 'update id');

                                                                    db.ref('/whatsapp_order').child(Object.keys(lastOrder)[0]).update(
                                                                        lastOrder[Object.keys(lastOrder)[0]]
                                                                    );
                                                                }
                                                            });


                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    // Alread reply messages decided on top

                                                    if (reply[Object.keys(reply)[0]].stringFunc) {
                                                        if (reply[Object.keys(reply)[0]].stringValue == "name") {
                                                            showMessage = showMessage.replace(/_/g, customer[Object.keys(customer)[0]].fullName);

                                                            if (expectedAnswers != '')
                                                                twiml.message(`${showMessage}${expectedAnswers}`);
                                                            else
                                                                twiml.message(`${showMessage}`);
                                                            res.set('Content-Type', 'text/xml');
                                                            return res.status(200).send(twiml.toString());

                                                        } else {
                                                            db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {
                                                                if (couponSnap.val() != null) {
                                                                    let items = "";
                                                                    let coupons = [];
                                                                    let result = couponSnap.val();
                                                                    for (var key in result) {
                                                                        if (result.hasOwnProperty(key)) {
                                                                            coupons.push({ key: result[key] });
                                                                        }
                                                                    }

                                                                    var index = 0;
                                                                    var interval = setInterval(function () {
                                                                        let splitted = customer[Object.keys(customer)[0]].contactNumber.split('+');
                                                                        sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, `${index + 1}.` + coupons[index].key.title, coupons[index].key.artWorkLink)
                                                                            .then(res => {
                                                                            }, error => {
                                                                                console.log(error);
                                                                            });
                                                                        if (index == coupons.length - 1) {
                                                                            clearInterval(interval);
                                                                            setTimeout(() => {
                                                                                sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, 'Please provide one of above answers')
                                                                                    .then(
                                                                                        res => {
                                                                                            console.log(res);
                                                                                        },
                                                                                        error => {
                                                                                            console.log(error);

                                                                                        }
                                                                                    );
                                                                            }, 5000);
                                                                        }
                                                                        index++;
                                                                    }, 5000)

                                                                    showMessage = showMessage.replace(/_/g, "");
                                                                    if (expectedAnswers != '')
                                                                        twiml.message(`${showMessage}`);
                                                                    else
                                                                        twiml.message(`${showMessage}`);
                                                                    res.set('Content-Type', 'text/xml');
                                                                    return res.status(200).send(twiml.toString());
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        if (expectedAnswers != '')
                                                            twiml.message(`${showMessage}${expectedAnswers}`);
                                                        else
                                                            twiml.message(`${showMessage}`);
                                                        res.set('Content-Type', 'text/xml');
                                                        return res.status(200).send(twiml.toString());
                                                    }

                                                });
                                            }
                                        });

                                        if (found == false) {
                                            console.log('customer messages are not matching for expecting answers');
                                            twiml.message(`Sorry I can't understand your answer. Please repeat`);
                                            res.set('Content-Type', 'text/xml');
                                            return res.status(200).send(twiml.toString());
                                        }
                                    }
                                    else {

                                    }
                                }
                                else {

                                }

                                // db.ref('/messages').orderByChild("id").equalTo(customerMassage[Object.keys(customerMassage)[0]].message).on('value', responseSnapshot => {
                                //     console.log(responseSnapshot.val());
                                //     twiml.message(`mmm`);
                                //     res.set('Content-Type', 'text/xml');
                                //     return res.status(200).send(twiml.toString());
                                // });
                            }
                            else {
                                console.log('Previous message not expecting an answer');
                                // Not expecting an answer for last message
                                db.ref('/messages').orderByChild("type").equalTo("Start").limitToLast(1).once('value', messageSnapshot => {
                                    if (messageSnapshot.val() != null && messageSnapshot.val() != undefined) {

                                        let msg = messageSnapshot.val();
                                        let expectedAnswers = '';

                                        if (msg[Object.keys(msg)[0]].answers.length != undefined) {
                                            expectedAnswers = '\n Please provide one of following answers.\n';
                                            msg[Object.keys(msg)[0]].answers.forEach((element, index) => {
                                                if (element.displayProperty != 'hide')
                                                    expectedAnswers += `\n${element.answer}.${element.displayProperty}`;
                                            });
                                        }


                                        let customerMessage = {
                                            customer: Object.keys(customer)[0],
                                            message: msg[Object.keys(msg)[0]]
                                        }

                                        let showMessage = msg[Object.keys(msg)[0]].message;
                                        if (msg[Object.keys(msg)[0]].stringFunc) {
                                            if (msg[Object.keys(msg)[0]].stringValue == "name") {
                                                showMessage = showMessage.replace(/_/g, customer[Object.keys(customer)[0]].fullName);
                                            } else {
                                                db.ref('/coupons').orderByKey().limitToLast(3).once('value', couponSnap => {
                                                    if (couponSnap.val() != null) {
                                                        let items = "";
                                                        let coupons = [];
                                                        let result = couponSnap.val();
                                                        for (var key in result) {
                                                            if (result.hasOwnProperty(key)) {
                                                                coupons.push({ key: result[key] });
                                                            }
                                                        }

                                                        var index = 0;
                                                        var interval = setInterval(function () {
                                                            let splitted = customer[Object.keys(customer)[0]].contactNumber.split('+');
                                                            sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, `${index + 1}.` + coupons[index].key.title, coupons[index].key.artWorkLink)
                                                                .then(res => {
                                                                }, error => {
                                                                    console.log(error);
                                                                });
                                                            if (index == coupons.length - 1) {
                                                                console.log('here2');

                                                                clearInterval(interval);
                                                                setTimeout(() => {
                                                                    sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, 'Please provide one of above answers')
                                                                        .then(
                                                                            res => {
                                                                                console.log(res);
                                                                            },
                                                                            error => {
                                                                                console.log(error);

                                                                            }
                                                                        );
                                                                }, 5000);
                                                            }
                                                            index++;
                                                        }, 5000);


                                                        // sendMessageService.SendMessage('14155238886', `${splitted[splitted.length - 1]}`, 'Please provide one of above answers')
                                                        //     .then(
                                                        //         res => {
                                                        //             console.log(res);
                                                        //         },
                                                        //         error => {
                                                        //             console.log(error);

                                                        //         }
                                                        //     );

                                                        showMessage = showMessage.replace(/_/g, "");

                                                        if (expectedAnswers != '')
                                                            twiml.message(`${showMessage}`);
                                                        else
                                                            twiml.message(`${showMessage}`);
                                                        res.set('Content-Type', 'text/xml');
                                                        return res.status(200).send(twiml.toString());
                                                    }
                                                });
                                            }
                                        }
                                        db.ref('/customer_messages').push(customerMessage);
                                        if (expectedAnswers != '')
                                            twiml.message(`${showMessage}${expectedAnswers}`);
                                        else
                                            twiml.message(`${showMessage}`);
                                        res.set('Content-Type', 'text/xml');
                                        return res.status(200).send(twiml.toString());
                                    }
                                });
                            }

                        }
                    });
                }
                res.set('Content-Type', 'text/xml');
                return res.status(200).send(twiml.toString());
            });


        } catch (error) {
            return next(error);
        }
    }
}

module.exports = WhatsappBot;
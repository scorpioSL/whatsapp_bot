var firebase = require("firebase");
const db = firebase.database();

class AddTestData {

    static addMessages() {
        // let messages =
        //     [
        //         {
        //             id: 1,
        //             message: "Hello Ms./Mr./Mrs./Dr./Prof._ Welcome to the eKitchen experience! You have now connected to a whole new world of flavors and made your lunch hour much more enjoyable and hassle free. Choose from an array of meal choices from a wide variety of restaurants delivered straight to your desk. Stay in touch. We’ll be here to take your lunch order on a daily basis. Cheers!",
        //             expect: true,//Detects whether server expects a reply or not
        //             stringFunc: true, //Detect if string needs to be altered
        //             stringValue: "name", //Which to add to _ place
        //             serverFunc: false,//Detects server needs to run any order function
        //             type: "Start",
        //             answers: [
        //                 {
        //                     answer: "Thanks!",
        //                     replyMessage: 2,
        //                     func: null
        //                 },
        //                 {
        //                     answer: "Send me the Menu",
        //                     replyMessage: 3,
        //                     func: "SendMessage"
        //                 },
        //                 {
        //                     answer: "Tell a Friend",
        //                     replyMessage: 5,
        //                     func: "SendMessage"
        //                 }
        //             ]
        //         },
        //         {
        //             id: 2,
        //             message: "You are welcome, Have a great day, Cheers!",
        //             expect: false,//Detects whether server expects a reply or not
        //             stringFunc: false, //Detect if string needs to be altered
        //             serverFunc: false,//Detects server needs to run any order function
        //             type: "Greeting",
        //             answers: [
        //             ]
        //         }, {
        //             id: 3,
        //             message: "Select a dish of your choice and reply the dish number._",
        //             expect: true,//Detects whether server expects a reply or not
        //             stringFunc: true, //Detect if string needs to be altered
        //             serverFunc: true,//Detects server needs to run any order function
        //             stringValue: "menu", //Which to add to _ place
        //             type: "Functioning",
        //             answers: [
        //                 {
        //                     answer: "1",
        //                     replyMessage: 4,
        //                     func: "AddOrder/SendMessage"

        //                 },
        //                 {
        //                     answer:'2',
        //                     replyMessage:4,
        //                     func:"AddOrder/SendMessage"
        //                 },
        //                 {
        //                     answer:'3',
        //                     replyMessage:4,
        //                     func:"AddOrder/SendMessage"
        //                 }
        //             ]
        //         }, {
        //             id: 4,
        //             message: "How many portions would you like?",
        //             expect: true,//Detects whether server expects a reply or not
        //             stringFunc: false, //Detect if string needs to be altered
        //             serverFunc: true,//Detects server needs to run any order function
        //             type: "Functioning",
        //             answers: [
        //                 {
        //                     answer: "1",
        //                     replyMessage: 7,
        //                     func: "UpdateOrder/SendMessage"
        //                 }
        //             ]
        //         }, {
        //             id: 5,
        //             message: "Tell a friend",
        //             expect: false,//Detects whether server expects a reply or not
        //             stringFunc: false, //Detect if string needs to be altered
        //             serverFunc: false,//Detects server needs to run any order function
        //             type: "Greeting",
        //             answers: [
        //                 {
        //                     answer: "Thanks!",
        //                     replyMessage: 2,
        //                     func: null
        //                 }
        //             ]
        //         },
        //         {
        //             id: 6,
        //             message: "Hello there Mr./Mrs./Dr./Prof._ How about lunch today… Can we interest you in one of our delicious dishes?",
        //             expect: true,//Detects whether server expects a reply or not
        //             stringFunc: true, //Detect if string needs to be altered
        //             serverFunc: true,//Detects server needs to run any order function
        //             stringValue: "name", //Which to add to _ place
        //             type: "Functioning",
        //             answers: [
        //                 {
        //                     answer: "Sure!",
        //                     replyMessage: 3,
        //                     func: "AddOrder/SendMessage"
        //                 },
        //                 {
        //                     answer: "Send me the Menu",
        //                     replyMessage: 3,
        //                     func: "AddOrder/SendMessage"
        //                 },
        //                 {
        //                     answer: "Not today",
        //                     replyMessage: 5,
        //                     func: "SendMessage"
        //                 }
        //             ]
        //         },
        //         {
        //             id: 7,
        //             message: "Thank you! Have a great day!",
        //             expect: false,//Detects whether server expects a reply or not
        //             stringFunc: false, //Detect if string needs to be altered
        //             serverFunc: false,//Detects server needs to run any order function
        //             type: "End",
        //             answers: [
        //             ]
        //         }
        //     ];


        let messages = [
            {
                id: 1,
                message: "Hello there Mr._ How about lunch today… Can we interest you in one of our delicious dishes?",
                expect: true,//Detects whether server expects a reply or not
                stringFunc: true, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "Start",
                answers: [
                    {
                        answer: "1",
                        displayProperty: "Send me the Menu",
                        replyMessage: 3,
                        func: "SendMessage"
                    },
                    {
                        answer: "2",
                        replyMessage: 3,
                        displayProperty: "Sure",
                        func: "SendMessage"
                    },
                    {
                        answer: "3",
                        displayProperty: "Not today",
                        replyMessage: 8,
                        func: null
                    }
                ]
            },
            {
                id: 2,
                message: "Check out our Menu for today?",
                expect: true,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "Start",
                answers: [
                    {
                        answer: "1",
                        displayProperty: "Sure",
                        replyMessage: 3,
                        func: "SendMessage"
                    },
                    {
                        answer: "2",
                        displayProperty: "Not today",
                        replyMessage: 8,
                        func: null
                    }
                ]
            },
            {
                id: 3,
                message: "Select a dish of your choice and reply the dish number. Give me few moments to show you our dishes",
                expect: true,//Detects whether server expects a reply or not
                stringFunc: true, //Detect if string needs to be altered
                stringValue: "menu", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "Functioning",
                answers: [
                    {
                        answer: "1",
                        displayProperty: "1",
                        replyMessage: 4,
                        func: "AddOrder/SendMessage"
                    },
                    {
                        answer: "2",
                        displayProperty: "2",
                        replyMessage: 4,
                        func: "AddOrder/SendMessage"
                    },
                    {
                        answer: "3",
                        displayProperty: "3",
                        replyMessage: 4,
                        func: "AddOrder/SendMessage"
                    }
                ]
            },
            {
                id: 4,
                message: "How many portions would you like?",
                expect: true,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "Functioning",
                answers: [
                    {
                        answer: "1",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "2",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "3",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    ,
                    {
                        answer: "4",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "5",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "6",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "7",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "8",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "9",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    },
                    {
                        answer: "10",
                        displayProperty: "hide",
                        replyMessage: 5,
                        func: "UpdateOrder/SendMessage"
                    }
                ]
            },
            {
                id: 5,
                message: "You’re all set. Ready to order?",
                expect: true,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "Functioning",
                answers: [
                    {
                        answer: "1",
                        displayProperty: "Confirm and Pay",
                        replyMessage: 6,
                        func: "Pay"
                    },
                    {
                        answer: "2",
                        displayProperty: "Make Changes / Cancel",
                        replyMessage: 3,
                        func: "SendMessage"
                    }
                ]
            },
            {
                id: 6,
                message: "Done! Your lunch order will be dispatched shortly.",
                expect: false,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "End",
                answers: [

                ]
            },
            {
                id: 7,
                message: "Your lunch has arrived… Enjoy!",
                expect: false,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "End",
                answers: [

                ]
            },
            {
                id: 8,
                message: "Thank you for your response, Have a great day!",
                expect: false,//Detects whether server expects a reply or not
                stringFunc: false, //Detect if string needs to be altered
                stringValue: "name", //Which to add to _ place
                serverFunc: false,//Detects server needs to run any order function
                type: "End",
                answers: [

                ]
            }
        ]

        messages.forEach(element => {
            db.ref('messages').push(element);
        });
    }
}

module.exports = AddTestData;
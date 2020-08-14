const twilio = require('twilio');
const accountSid = "ACcb051d059ee888b876c62ba256b9764d";
const TwilloAuthToken = "2e86917ed7e56635624ff0adaafea17a";
const client = twilio(
    accountSid,
    TwilloAuthToken
);

class orderListService {
    constructor() {

    }
    static SendMessage(from, to, body, image = null) {
        if (image != null) {
            return client.messages
                .create({
                    from: `whatsapp:+${from}`,
                    to: `whatsapp:+${to}`,
                    body: body,
                    mediaUrl: image,
                });
        } else {
            return client.messages
                .create({
                    from: `whatsapp:+${from}`,
                    to: `whatsapp:+${to}`,
                    body: body
                });
        }
    }
}

module.exports = orderListService;


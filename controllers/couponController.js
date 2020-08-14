var firebase = require("firebase");
const db = firebase.database();

class couponController {
    static async getAllCoupons() {
        let ref = db.ref('coupons');
        var coupons = [];
        try {
            ref.on('value', snap => {
                let result = snap.val();
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        coupons.push({ key: result[key] });
                    }
                }
                return coupons;
            });
        } catch (error) {
            return error
        }


    }
}




module.exports = couponController;
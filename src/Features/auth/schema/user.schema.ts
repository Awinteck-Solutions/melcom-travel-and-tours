const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: false },
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    image: {type: String, default: null},
    otp: { type: String, required: false },
    role: { type: String, default: "USER" },
    googleId: { type: String, unique: true, sparse: true },
    notifications: {
        type: Object,
        default: {
            flightAlerts: true,
            ridesAlerts: false,
            hotelAlerts: false,
            promotions: true,
            accountSecurity: true,
            emails: true,
        },
    },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const User = mongoose.model('User', userSchema);

export default User
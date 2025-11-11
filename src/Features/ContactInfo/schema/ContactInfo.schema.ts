const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ContactInfoSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    workingHours: String,
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true })

const ContactInfo = mongoose.model('ContactInfo', ContactInfoSchema);

export default ContactInfo

       
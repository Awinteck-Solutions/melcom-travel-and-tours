const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const HotelsSchema = new Schema({
    data: { type: String, required: false },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Hotels = mongoose.model('Hotels', HotelsSchema);

export default Hotels

       
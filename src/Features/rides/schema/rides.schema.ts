const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const RidesSchema = new Schema({
    data: { type: String, required: false },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Rides = mongoose.model('Rides', RidesSchema);

export default Rides

       
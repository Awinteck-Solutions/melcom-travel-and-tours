const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const FlightsSchema = new Schema({
    data: { type: String, required: false },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Flights = mongoose.model('Flights', FlightsSchema);

export default Flights

       
const mongoose = require('mongoose')


const ReservationsSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Auth',
        required : true
    },
    startDate : {
        type : Date,
        required : true 
    },
    endDate : {
        type : Date,
        required : true 
    },
    summary :{
        type : String,
        required : true
    },
    address :{
        type : String,
        required : true
    },
    price :{
        type : Number,
        required : true
    },
    total : {
        type : String,
        required : true
    },
    isReserved : {
        type : Boolean,
        default : false
    },
    reservedBy : {
        type :mongoose.Schema.Types.ObjectId
    }
    
},
{versionKey: false, toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }}}
)
module.exports = mongoose.model('Reservations', ReservationsSchema);
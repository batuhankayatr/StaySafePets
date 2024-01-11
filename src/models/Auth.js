const mongoose = require ('mongoose');
const userRoles = {
    petOwner: 'petOwner',
    homeOwner: 'homeOwner',
  };

const AuthSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    }, 
    email : {
        type : String ,
        required : true,
        unique : true
        
    },
    password : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : [userRoles.petOwner,userRoles.homeOwner],
        required : true
    },
    city : {
        type : String,
        required : true
    }
    

}, {versionKey: false, toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }}})
module.exports=mongoose.model('Auth',AuthSchema)
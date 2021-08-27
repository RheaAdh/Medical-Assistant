import mongoose, { Schema, Document } from "mongoose"

const User = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    height:{
        type:Number,
    },
    weight:{
        type:Number
    },
    bloodGroup:{
        type:String,
        enum:["A+","B+","AB+","O+","A-","B-","AB-","O-"]
    },
    gender:{
        type:String,
        enum:["Male","Female"]
    },
    address:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    motherName:{
        type:String
    },
    fatherName:{
        type:String
    },
    pointOfContact:{
        type:String
    },
    isDoctor:{
        type:Boolean,
        default: false
    },
    isMerchant:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    history:[{
        imageLink:{type:String},
        isVerified:{type:Boolean,default:false},
        uploadedBy:{type:Schema.Types.ObjectId,ref:"user"},
        description:{type:String}
    }],
    friends:[{
        userId:{type:Schema.Types.ObjectId,ref:"user"},
        hasAccepted:{type:Boolean,default:false},
    }],
    requests:[{
        userId:{type:Schema.Types.ObjectId,ref:"user"},
        hasAccepted:{type:Boolean,default:false},
    }]
})

module.exports = mongoose.model("user",User)
const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true,
    min:2,
    max:255
},
email:{
    type:String,
    required:true,
    max:255,
    min:6
},
password:{
    type:String,
    required:true,
    max:1024,
    min:6
},
date:{
    type:Date,
    default:Date.now
},
address:{
    type: String,
    required: true,
    max: 1024,
    min: 10
},
phonenum:{
    type: Number,
    required:true,
    min:7
},
history:{
    type:Array,
    default:[]
},
avatar:{
    type:String
}
})

module.exports=mongoose.model('User',userSchema);
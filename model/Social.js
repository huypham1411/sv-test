const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
id:{
    type:String
},
name:{
    type:String,
    min:2,
    max:255
},
email:{
    type:String,
    max:255,
    min:6
},
phonenum:{
    type: Number,
    min:7
},
avatar:{
    type:String
},
role: {
    type: String,
    enum: ["facebook", "gmail"]
},
address:{
    type: String,
    max: 1024,
    min: 10
},
history:{
    type:Array,
    default:[]
}
})

module.exports=mongoose.model('Social',userSchema);
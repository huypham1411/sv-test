const router = require('express').Router();
const generatePassword = require("password-generator");
const User=require('../model/User');
const nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: 'unclefarmveggies@gmail.com',
    pass: 'khangpro123'
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/',async (req,res)=>{
 // console.log('a')
    var email = req.body.email;
    console.log(email);
    var content = generatePassword(10, false);
     //Hash password
   const salt = await bcrypt.genSalt(10);
   const hashPassword= await bcrypt.hash(content,salt);
   //console.log(hashPassword)
    await User.findOneAndUpdate({email:email}, {password:hashPassword}, {
        new: true
      });
    var mail = {
        from: 'UncleVeggie',
        to: email, 
        subject: 'Here is your new password',
        text: content
      }
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({msg:'fail'})
        }
      })
      res.json({msg:'success'})
});



module.exports =router;

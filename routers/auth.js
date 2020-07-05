const router = require('express').Router();
const User=require('../model/User');
const Social=require('../model/Social');
const Payment=require('../model/Payment');
const {registerValidation,loginValidation} =require('../validation.js');
const jwt=require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const verify = require('./verifyToken');
//const { default: ProductList } = require('../../client/src/components/Product/ProductList');
//Register
router.post('/SignUp',async (req,res)=>{
   //Validate
   const {error} = registerValidation(req.body);
   if(error) {return res.status(400).send(error.details); }

   //Checking if user already in database
   const emailExist=await User.findOne({email:req.body.email})
   if(emailExist){return res.status(400).send([{'message':'Email exist'}])}

   //Hash password
   const salt = await bcrypt.genSalt(10);
   const hashPassword= await bcrypt.hash(req.body.password,salt);
   //Create new user
   const user=new User({
      name:req.body.name,
      email:req.body.email,
      password:hashPassword,
      phonenum:req.body.phonenum,
      address:req.body.address
   })
   try {
      const saveUser=await user.save();
      res.send({user:user._id});
   } catch (error) {
      res.status(404).send(error);
   }
})

//Login
router.post('/login',async (req,res)=>{

   if (req.body.role == 'signup'){
      //Validate
      const {error} = loginValidation(req.body.data);
      if(error) {return res.status(400).send(error.details);}
      //Checking if user already in database
      const user=await User.findOne({email:req.body.data.email})
      if(!user){return res.status(400).send([{'message':'Email or password is wrong!'}])}
      //Check password
      const validPassword=await bcrypt.compare(req.body.data.password,user.password);
      if(!validPassword){return res.status(400).send([{'message':'Email or password is wrong!'}])}
      //Create and assign token

      const token=jwt.sign({name:user.name,id:user._id,email:user.email,address:user.address,phonenum:user.phonenum,history:user.history},process.env.TOKEN_SECRET)
      res.header('auth-token',token).status(201).send({name:user.name, id:user._id})
   } else {
      const user=await Social.findOne({id:req.body.id})
      .then(data=> 
         {
            //console.log(data,'data')
            const token=jwt.sign({name:data.name,role:data.role,id:data._id,email:data.email,address:data.address,phonenum:data.phonenum,history:data.history},process.env.TOKEN_SECRET)
             res.header('auth-token',token).status(201).send({name:data.name, id:data._id})
            })
      .catch(err=>console.log(err))
     
      
   }
})

router.get('/login',async(req,res)=>{
   const token=req.header('auth-token');
   const user = jwt.decode(token);
   res.status(201).send(user);
})


router.post('/social',async (req,res)=>{
   const userExist=await Social.find({id:req.body.id})
   if(userExist.length!==0){return res.json({message:'Account exist'})}
   const social=new Social({
      id: req.body.id,
      name:req.body.name,
      email:req.body.email,
      address:req.body.address,
      avatar:req.body.avatar,
      role:req.body.role
   })
   //console.log(social)
   try {
      const saveSocial=await social.save();
      res.send({
         social:social.id,
         status: 'success'
      });
   } catch (error) {
      res.status(404).send(error);
   }
})

router.get('/user',async (req,res)=>{
   try{
     const user= await Social.find({})
     const user2= await User.find({})
     user2.forEach(element => { 
      user.push(element)
    }); 
     res.status(201).send(user);
   }
   catch(err){res.status(404).send(err)}
 })



router.get('/user/:id',async (req,res)=>{
   try{
      user= await Social.findOne({_id:req.params.id})
      if (!user) {
         user= await User.findOne({_id:req.params.id})
      }

      res.status(201).send(user);
   }
   catch(err){res.status(404).send(err)}
 })

 router.delete('/user',async (req,res)=>{
   try{
      user= await Social.findOne({_id:req.body.id})
      if (!user) {
         User.findByIdAndDelete({_id:req.body.id}, (err, result) => {
            if (err) return res.send(500, err)
            console.log('got deleted');
            return res.status(200).json({
               status : 'success',
               user : 'signup'
            });
            });
      } else {
         Social.findByIdAndDelete({_id:req.body.id}, (err, result) => {
            if (err) return res.send(500, err)
            console.log('got deleted');
            return res.status(200).json({
               status : 'success',
               user : 'social'
            });
            });
      }
   }
   catch(err){res.status(404).send(err)}
 })


 router.post('/payment',verify,(req,res)=>{
   // console.log(req.body);
   // res.send('pay success');
   let history=[];
   let transactionData={};
   //Put Payment information into User collection
   req.body.cartDetails.forEach((item)=>{
      history.push({
         dateOfPurchase:Date.now(),
         name:item.name,
         id:item._id,
         price:item.price,
         quantity:item.quantity,
         patmentId: req.body.paymentData.paymentID
      })
   })
   //Put payment information into paypal collection
   let user=jwt.decode(req.header("auth-token"));
   transactionData.user={
      id:user.id,
      name:user.name,
      email:user.email
   }
   transactionData.data=req.body.paymentData;
   transactionData.product=history;

   if (user.role) {
      console.log('social')
      Social.findOneAndUpdate({_id:user.id},{$push:{history:history}},{new:true},(err,user)=>{if(err) return res.json({success:false,err});
      const payment=new Payment(transactionData)
      payment.save((err,doc)=>{
         if(err) return res.json({success:false,err});
         // let product=[];
         // doc.product.forEach(item=>{
         //    product.push({id:item.id,quantity:item.quantity})
         // })
         res.json({success:true})
      })
      })
   } else {
      console.log('web')
      User.findOneAndUpdate({_id:user.id},{$push:{history:history}},{new:true},(err,user)=>{if(err) return res.json({success:false,err});
      const payment=new Payment(transactionData)
      payment.save((err,doc)=>{
         if(err) return res.json({success:false,err});
         // let product=[];
         // doc.product.forEach(item=>{
         //    product.push({id:item.id,quantity:item.quantity})
         // })
         res.json({success:true})
      })
      })
   }
})

router.post('/user/checkpass',async (req,res)=>{
   const user=await User.findOne({_id:req.body.id})

   const validPassword=await bcrypt.compare(req.body.password,user.password);
   if(!validPassword){return res.status(400).send([{'message':'Password is wrong!'}])}

   res.json({status: 'success'})
})

router.post('/user/changepass',async (req,res)=>{
   const user=await User.findOne({_id:req.body.id})

   const salt = await bcrypt.genSalt(10);
   const hashPassword= await bcrypt.hash(req.body.password,salt);

   user.password = hashPassword;
   user.save(function (err) {
      if (err) return res.json(err);
      res.json({
         status: 'success',
      })
   })
})


 router.put('/user/:id',async (req,res)=>{
   user= await Social.findOne({_id :req.params.id })

   if (!user) {
      user= await User.findOne({_id:req.params.id})
   }

   if (typeof req.body.name !== 'undefined') {
      user.name = req.body.name;
   }
   if (typeof req.body.address !== 'undefined') {
      user.address = req.body.address;
   }
   if (typeof req.body.phonenum !== 'undefined') {
      user.phonenum = req.body.phonenum;
   }
   if (req.body.avatar) {
      user.avatar = req.body.avatar;
   }
   user.save(function (err) {
      if (err) return res.json(err);
      res.json({
         status: 'success',
         data: user
      })
   })
 })
module.exports =router;

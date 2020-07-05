const router = require('express').Router();
const Product=require('../model/Product');

router.get('/',async (req,res)=>{
  const type=req.query.filter;
  const sort=req.query.sort;
  const name=req.query.name;
  const page=parseInt(req.query.page);
  const limit=9;
  const startIndex= (page-1)*limit;
  const endIndex=page*limit;
  const docLength = await Product.countDocuments();
  let myproducts=[];
  let productMap={};
  if(name){
    myproducts = await Product.find({name:{$regex:new RegExp(name)}});//search match with word
    return res.json(myproducts);
  }

  if(sort){//?sort=...
    switch(sort){
      case 'a-z':
        if(type){
          await Product.find({type:type},(err,products)=>{
            products.sort((x,y)=>x.name>y.name?1:-1);
            myproducts=products;
        })}
        else await Product.find({},(err,products)=>{
          products.sort((x,y)=>x.name>y.name?1:-1);
          myproducts=products;
        });
        if(page){
          productMap.result=myproducts.slice(startIndex,endIndex)
          productMap.maxPage=Math.ceil(myproducts.length/limit);
          if(endIndex < myproducts.length){
            productMap.next={
              page:page+1
            }
          }
          if(startIndex > 0){
            productMap.previous={
              page:page-1
            }
          }
          return res.json(productMap); 
        }
        res.json(myproducts);
        return;
      case 'z-a':
        if(type){
         await Product.find({type:type},(err,products)=>{
            products.sort((x,y)=>x.name<y.name?1:-1);
            myproducts=products;
        })}
       else await Product.find({},(err,products)=>{
          products.sort((x,y)=>x.name<y.name?1:-1);
          myproducts=products;
        });
        if(page){productMap.result=myproducts.slice(startIndex,endIndex)
          productMap.maxPage=Math.ceil(myproducts.length/limit);
          if(endIndex < myproducts.length){
            productMap.next={
              page:page+1
            }
          }
          if(startIndex > 0){
            productMap.previous={
              page:page-1
            }
          }
          return res.json(productMap); 
          }
        res.json(myproducts);
        return;
      case 'high_low':
        if(type){
          await Product.find({type:type},(err,products)=>{
            products.sort((x,y)=>x.price<y.price?1:-1);
            myproducts=products;
        })}
        else await Product.find({},(err,products)=>{
          products.sort((x,y)=>x.price<y.price?1:-1);
          myproducts=products;
        });
        if(page){productMap.result=myproducts.slice(startIndex,endIndex)
          productMap.maxPage=Math.ceil(myproducts.length/limit);
          if(endIndex < myproducts.length){
            productMap.next={
              page:page+1
            }
          }
          if(startIndex > 0){
            productMap.previous={
              page:page-1
            }
          }
          return res.json(productMap); 
          }
        res.json(myproducts);
        return;
      case 'low_high':
        if(type){
          await Product.find({type:type},(err,products)=>{
            products.sort((x,y)=>x.price>y.price?1:-1);
            myproducts=products;
        })}
        else await Product.find({},(err,products)=>{
          products.sort((x,y)=>x.price>y.price?1:-1);
          myproducts=products;
        });
        if(page){productMap.result=myproducts.slice(startIndex,endIndex)
          productMap.maxPage=Math.ceil(myproducts.length/limit);
          if(endIndex < myproducts.length){
            productMap.next={
              page:page+1
            }
          }
          if(startIndex > 0){
            productMap.previous={
              page:page-1
            }
          }
          return res.json(productMap); 
          }
        return res.json(myproducts);
    }
    }
   if(type){
    switch(type){//?filter=....
      case 'fruit':
      myproducts = await Product.find({type:"fruit"});
      if(page){productMap.result=myproducts.slice(startIndex,endIndex)
        productMap.maxPage=Math.ceil(myproducts.length/limit);
        if(endIndex < myproducts.length){
          productMap.next={
            page:page+1
          }
        }
        if(startIndex > 0){
          productMap.previous={
            page:page-1
          }
        }
        return res.json(productMap); 
      }
      return res.json(myproducts);
      
      case 'vegetable':
      myproducts = await Product.find({type:"vegetable"});
      if(page){productMap.result=myproducts.slice(startIndex,endIndex)
        productMap.maxPage=Math.ceil(myproducts.length/limit);
        if(endIndex < myproducts.length){
          productMap.next={
            page:page+1
          }
        }
        if(startIndex > 0){
          productMap.previous={
            page:page-1
          }
        }
        return res.json(productMap); 
        }
      return res.json(myproducts);
      
      case 'spice':
      myproducts = await Product.find({type:"spice"});
      if(page){productMap.result=myproducts.slice(startIndex,endIndex)
        productMap.maxPage=Math.ceil(myproducts.length/limit);
        if(endIndex < myproducts.length){
          productMap.next={
            page:page+1
          }
        }
        if(startIndex > 0){
          productMap.previous={
            page:page-1
          }
        }
        return res.json(productMap); 
        }
      return res.json(myproducts);
    }
  }
  else
  {
    productMap.maxPage=Math.ceil(docLength/limit);
    myproducts = await Product.find({});
    if(page){
      if(endIndex < docLength){
        productMap.next={
          page:page+1
        }
      }
      if(startIndex > 0){
        productMap.previous={
          page:page-1
        }
      }
      productMap.result=myproducts.slice(startIndex,endIndex)
      return res.json(productMap); 
    }
  return res.json(myproducts);
 }
})



 router.get('/:id',async (req,res)=>{
  const id= req.params.id;
  try{
    const product=await Product.findById(id);
    res.status(201).send(product);
  }
  catch(err){res.status(404).send(err)}
})

router.delete('/',async (req,res)=>{
  try{
    Product.findByIdAndDelete({_id:req.body.id}, (err, result) => {
      if (err) return res.send(500, err)
      console.log('got deleted');
      return res.status(200).json({
         status : 'success',
         message : 'Delete product'
      });
      });
  }
  catch(err){res.status(404).send(err)}
})


router.put('/:id',async (req,res)=>{
  Product.findOne({id : req.params.id}, function (err, product) {
      if (err) return res.send(err)

      if (typeof req.body.name !== 'undefined') {
          product.name = req.body.name;
      }
      if (typeof req.body.type !== 'undefined') {
          product.type = req.body.type;
      }
      if (typeof req.file !== 'undefined') {
          product.avatar = req.file.path;
      }
      if (typeof req.body.status !== 'undefined') {
          product.status = req.body.status;
      }
      if (typeof req.body.description !== 'undefined') {
          product.description = req.body.description;
      }
      if (typeof req.body.price !== 'undefined') {
        product.price = req.body.price;
      }

      product.save(function (err) {
          if (err) return res.json(err);

          res.json({
              message: 'Update succes',
              data: product
          })
      })
  })
})

 module.exports =router;
//Validation
const Joi=require('@hapi/joi');
const registerValidation=(data)=>{//req.body
const schema=Joi.object({
   name:Joi.string().min(2).required(),
   email:Joi.string().min(6).required().email(),
   password:Joi.string().min(6).required(),
   address:Joi.string().min(10).required(),
   phonenum:Joi.number().min(7).required()
})
//Validate user
return schema.validate(data);
}

const loginValidation=(data)=>{//req.body
    const schema=Joi.object({
       email:Joi.string().min(6).required().email(),
       password:Joi.string().min(6).required()
    })
    //Validate user
    return schema.validate(data);
    }

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {z} = require('zod')
mongoose.connect(process.env.mongoUrl);
const jwt = require('jsonwebtoken');
const { Router } = require ('express');
const { userModel } = require('../db');
const { userAuth } = require('../auth');

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

const userRoute = Router();


userRoute.post('/signup', async function(req, res){

    const dataValidation = z.object({
        firstName : z.string().min(3).max(50),
        lastName : z.string().min(3).max(50),
        email : z.string().min(3).max(500).email(),
        password : z.string().min(3).max(20)
    })

    const parsedData = dataValidation.safeParse(req.body);

    if(!parsedData.success){
        res.status(403).json({
            message : "Validation error"
        })
        return
    }   
    const {firstName, lastName, email, password} = req.body;
     let check = false
    try{
        await userModel.create({
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password})
            
            console.log("done")
}catch(e){
   
    check = true
    res.status(403).json({
        message:"Error"
    })
}

if (!check){
       res.json({
        message : "User registered!"
    })
}
 

});


userRoute.post('/login',async function(req, res){
    const email = req.body.email
    const password = req.body.password

    const checkId = await userModel.findOne({
        email,
        password
    })

    if(checkId){
        const token = jwt.sign({
            id : checkId._id
        }, USER_JWT_SECRET)

        res.json({
            token : token
        })
    }else{
        res.status(403).json({
            message : "Loggin failed"
        })
    }
});


userRoute.get('/purchases',userAuth, async function(req, res){
    const userID = req.id;
     
    
});

module.exports = {
    userRoute
};
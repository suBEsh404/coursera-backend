const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {z} = require('zod')
mongoose.connect(process.env.mongoUrl);
const jwt = require('jsonwebtoken');
const { Router } = require ('express');
const { userModel, purchaseModel, courseModel } = require('../db');
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

    const hashedPass = await bcrypt.hash(password, 5);
    try{
        await userModel.create({
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : hashedPass})
            
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
    })

    const checkPass = bcrypt.compare(password, checkId.password);
    if(checkId && checkPass ){
        const token = jwt.sign({
            id : checkId._id
        }, USER_JWT_SECRET)

        res.json({
            token : token
        })

        await userModel.updateOne({
            _id : checkId._id
        },{
            token : token
        })
    }else{
        res.status(403).json({
            message : "Invalid Credentials"
        })
    }
});

userRoute.post('/purchase',userAuth, async function(req, res){
    const userID = req.id;
    const courseID = req.body.courseId;

    try{
        await purchaseModel.create({
            userID,
            courseID
        })

        res.json({
            message : "Course Purchased"
        })
    }catch(e){
        res.status(403).json({
            message : "Error occurred"
        })
    }
    
});

userRoute.get('/myCourses',userAuth, async function(req, res){
    const userID = req.id;
        const myCourses = await purchaseModel.find({userID})
        const myCourseDetails = await courseModel.find({
            _id : {$in : myCourses.map(x => x.courseID)}
        })
        res.json({
            myCourses,
            myCourseDetails
        })

        if(!myCourses){
            res.status(404).json({
                message : "Courses not found"
            })
        }

    
    
});

module.exports = {
    userRoute
};
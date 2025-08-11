const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const {z} = require('zod')
mongoose.connect(process.env.mongoUrl);
const jwt = require('jsonwebtoken');
const { Router } = require ('express');
const { adminModel, courseModel } = require('../db');
const { adminAuth } = require('../auth');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const adminRoute = Router();

adminRoute.post('/signup', async function(req, res){
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
        await adminModel.create({
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

adminRoute.post('/login',async function(req, res){
    const email = req.body.email
    const password = req.body.password

    const checkId = await adminModel.findOne({
        email,
    })

    const checkPass = bcrypt.compare(password, checkId.password);
    if(checkId && checkPass ){
        const token = jwt.sign({
            id : checkId._id
        }, ADMIN_JWT_SECRET)

        res.json({
            token : token
        })

        await adminModel.updateOne({
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

adminRoute.post('/course',adminAuth,async function(req, res){
    const courseTitle = req.body.title;
    const courseDescription = req.body.description;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const adminId = req.id;
    
    let check = false
    try{
        await courseModel.create({
        
        title : courseTitle,
        description : courseDescription,
        price,
        imgUrl,
        adminId
        
    });
}catch(e){
    check = true
    res.status(403).json({
        message : "Error creating course"
    })
}

if(!check){
    res.json({
        message : "Course created"
    })
}
});

adminRoute.put('/course',adminAuth, async function(req, res){
    const courseId = req.body.courseId
    const courseTitle = req.body.title;
    const courseDescription = req.body.description;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const adminId = req.id;
    
    try{
        const fetchCourse = await courseModel.updateOne({
        _id : courseId,
        adminId
    },{
        title : courseTitle,
        description : courseDescription,
        price,
        imgUrl,
        adminId
    })

    if(!fetchCourse){
        return res.status(403).json({
            message : "Course not found"
        })
    }

    res.json({
        message : "Course updated!",
        courseId : fetchCourse._id
    })
}catch(e){
    check = true
    res.status(403).json({
        message : "Error Updating course"
    })
}

});

adminRoute.get('/course', adminAuth,async function(req, res){
    const adminId = req.id
    const allCourses = await courseModel.find({
        adminId
    })

    if(!allCourses){
        return res.status(403).json({
            message : "No courses available"
        })
    }else{
        res.json({
            courses : allCourses
        })
    }

});

adminRoute.delete('/course', adminAuth,async function(req, res){
    const adminId = req.id
    const courseId = req.body.courseId
    try{
        const deleteCourse = await courseModel.findOneAndDelete({
        adminId,
        _id : courseId
        })

        if(!deleteCourse){
            return res.status(403).json({
                message : "Invalid Credentials"
            })
        }
        res.json({
            courseDeleted : deleteCourse
        })
    }catch(e){
        return res.status(403).json({
            message : "Course not found"
        })
    }


});


module.exports = {
    adminRoute
}
const express = require('express')
const { Router } = require ('express');
const { courseModel } = require('../db');

const courseRoute = Router();


courseRoute.get('/courses',async function(req, res){
    const allCourses = await courseModel.find({});

    res.json({
        allCourses : allCourses
    })
});

module.exports = {
    courseRoute
}
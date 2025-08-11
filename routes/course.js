const express = require('express')
const { Router } = require ('express')

const courseRoute = Router();

courseRoute.post('/purchase', function(req, res){
        res.json({
        message : "check"
    })
});


courseRoute.get('/courses', function(req, res){
        res.json({
        message : "check"
    })
});

module.exports = {
    courseRoute
}
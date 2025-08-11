const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Objectid = Schema.ObjectId
const user = new Schema({
    firstName : String,
    lastName : String,
    email : {type : String, unique:true},
    password : String,
    token : String
})

const admin = new Schema({
    firstName : String,
    lastName : String,
    email : {type : String, unique:true},
    password : String,
    token : String
})

const course = new Schema({
    title : String,
    description : String,
    price : Number,
    imgUrl : String,
    adminId : Objectid
})


const purchase = new Schema({
    userID: Objectid,
    courseID: Objectid,
})

const userModel = mongoose.model('users', user)
const adminModel = mongoose.model('admins', admin)
const courseModel = mongoose.model('courses', course)
const purchaseModel = mongoose.model('purchases', purchase)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}
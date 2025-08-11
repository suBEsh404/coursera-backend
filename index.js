const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
require('dotenv').config();
const { userRoute } = require('./routes/user')
const { adminRoute } = require('./routes/admin')
const { courseRoute } = require('./routes/course')

const app = express();
app.use(express.json());

app.use('/user',userRoute);
app.use('/admin',adminRoute);
app.use('/course',courseRoute);

async function main(){
    await mongoose.connect(process.env.mongoUrl)
    app.listen(3000);
    console.log("Server running")

}

main();

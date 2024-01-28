import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js"
import articleRouter from "./routes/articleRoutes.js";
import userSchema from "./schema/user_schema.js";
import * as dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
const User = mongoose.model('User', userSchema);
const app = express()
app.use(express.json())
const port = process.env.PORT || 5500
const saltRounds = parseInt(process.env.SALT_ROUNDS)
let adminPassword = process.env.ADMIN_PASSWORD
adminPassword = await bcrypt.hash(adminPassword, saltRounds)

User.findOne({role: "admin"})
    .then((admin) => {
        if(admin){
            console.log("Admin already exist")
        } else{
        const admin = new User({
            username: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: adminPassword,
            age: 35,
            role: "admin",
          }); 
        admin.save()
          .then(() => console.log("Admin created successfully!"))
          .catch((err) => console.error("Error creating admin user:", err));
        }})
        .catch((err) => console.log(err))

app.use('/', userRouter)
app.use('/', articleRouter)

app.listen(port, () => {
    mongoose.connect('mongodb://localhost:27017/blogProject')
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Error connecting to dataabase:', err))

    console.log(`Listening on port ${port}`)
})
import userSchema from "../schema/user_schema.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import {generateAccessToken} from "../middleware/token.js";
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()

const saltRounds = parseInt(process.env.SALT_ROUNDS)
const User = mongoose.model('User', userSchema);


const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params
    User.findById(id)
    .then(user => {
        console.log(user.id)
        if(user) return res.send(user)
                return res.send("User not found")
            })
            .catch(err => res.send("Error: ", err)) 
            
}
const registerUser = async (req, res) => {
    try {
      const { username, email, age} = req.body;
      let password = req.body.password
      let role = "user"
      password = await bcrypt.hash(password, saltRounds)

      const user = new User({ username, email, password, age, role });
      await user.save();
      res.send("Everything is right, now go back and sign-in");
    } catch (err) {
      console.error(err);
      res.status(400).send("Registration failed");
    }
};
 
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

            const token = generateAccessToken(user.username, user.role);

            res.setHeader('authorization', token);
            return res.json({ status: "Logged in", user, jwt: token });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const updateUser = async (req, res) => {
    const {id} = req.params
    const token = req.headers.authorization
    const {username, email, password, age} = req.body

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try{
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        const user = await User.findById(id);
            if(!user) return res.status(404).send("Error: User not found!")

            if (decodedToken.username !== user.username) {
                return res.status(403).json({ error: "Forbidden: You are not authorized to update this user" });
            }
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, password, age }, { new: true });
        res.json({ status: "User updated", user: updatedUser });
    } catch(err){
        console.error(err);
        res.status(500).send("Failed to update user");
    }

}

const deleteUser = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try{
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const user = await User.findById(id);
        if(!user) return res.status(404).send("Error: User not found!")

            if (decodedToken.username !== user.username) {
                return res.status(403).json({ error: "Forbidden: You are not authorized to delete this user" });
            }
        const deleteUser = await User.findByIdAndDelete(id)
        res.send("User deleted successfully")
    } catch(err) {
        console.log(err)
        res.status(500).send("Failed to delete user");
      }
}

export { getAllUsers,  getUserById, registerUser, loginUser, updateUser, deleteUser, User}
import  jwt  from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()
const token_secret = process.env.TOCEN_SECRET

export const generateAccessToken = (username, role) => {
    return jwt.sign({username, role}, token_secret, {expiresIn: "36000s"})
}
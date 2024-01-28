import express from "express";
import { getAllUsers, registerUser, getUserById, loginUser, updateUser, deleteUser} from "../controllers/user_controller.js"
const router = express.Router()


router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/users/update/:id', updateUser)
router.delete('/users/delete/:id', deleteUser)

export default router
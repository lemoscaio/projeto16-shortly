import { Router } from "express"

import { validateToken } from "../middlewares/authMiddlewares.js"
import { validateData } from "../middlewares/dataMiddlewares.js"
import { registerUser, loginUser } from "../controllers/authController.js"

import { newUserSchema } from "./../schemas/newUserSchema.js"
import { loginSchema } from "./../schemas/loginSchema.js"

export const authRouter = Router()

authRouter.post("/signup", validateData(newUserSchema), registerUser)
authRouter.post("/signin", validateData(loginSchema), loginUser)
authRouter.get("/signin", validateToken)

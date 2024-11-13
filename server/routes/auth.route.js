import { Router } from "express";
import AuthController from '../controllers/auth.controller.js'


const router = Router()

router.post('/api/auth/register', AuthController.register)

router.post('/api/auth/login', AuthController.login)

export default router;
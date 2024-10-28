import { Router } from "express";
import AuthController from '../controllers/auth.controller.js'


const router = Router()

router.post('/auth/register', AuthController.register)

router.post('/auth/login', AuthController.login)

router.get('/auth/logout', AuthController.logout)

export default router;
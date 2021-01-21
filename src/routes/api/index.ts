import { Router } from "express"
import userRouter from './users'
import characterRouter from './characters'

const router = Router()

router.use('/users', userRouter)
router.use('/characters', characterRouter)

export default router
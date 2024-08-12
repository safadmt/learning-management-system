import express from 'express'
import { jwtauthUser } from '../middleware/auth.middleware.js';
import { BuyCourse ,paymentFailed,verifyPayment} from '../controllers/user.js';
const router = express.Router();

router.post('/buy-course',jwtauthUser, BuyCourse)

router.post('/verify', jwtauthUser, verifyPayment)

router.post('/failed', jwtauthUser, paymentFailed)

export default router;
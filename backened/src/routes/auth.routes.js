import express from 'express';
import {login, logout, signin , onboard} from "../controllers/auth.controller.js";
import {Protectroute} from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/signin', signin)
router.post('/login', login )

router.post('/logout' , logout )

router.post('/onboarding' , Protectroute , onboard)

router.get('/me' , Protectroute ,(req, res) => {
    return res.status(200).json({success: true , user:req.user});
} )


export default router;
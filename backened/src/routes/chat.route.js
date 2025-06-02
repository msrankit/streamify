import express from "express";
import {getStreamToken} from "../controllers/chat.controller.js";
import {Protectroute} from "../middleware/auth.middleware.js";
const router = express.Router();

router.get('/token', Protectroute, getStreamToken);
export default router;
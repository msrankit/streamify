import express from "express";
import {Protectroute} from "../middleware/auth.middleware.js";
import {getMyFriends, getRecommendedUser , sendFriendRequest, acceptFriendRequest,getFriendRequests  , getOutgoingFriendReqs} from "../controllers/user.controller.js";

const router = express.Router();

router.use(Protectroute)

router.get('/', getRecommendedUser)
router.get('/friends', getMyFriends)

router.post('/friend-request/:id' , sendFriendRequest)
router.put('/friend-request/:id/accept' , acceptFriendRequest)

router.get('/friend-requests',  getFriendRequests)

router.get("/outgoing-friend-requests", getOutgoingFriendReqs);


export default router;
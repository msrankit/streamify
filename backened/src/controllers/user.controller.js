import {User} from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.js";


// Go Through It once again
export async function getRecommendedUser (req, res) {

    try{

        const CurrentuserId = req.user.id;
        const CurrentUser = req.user;

        const recommandedUser = await User.find({
            $and:[
                {_id:{$ne:CurrentuserId}} , // exclude current user
                {_id:{$nin:CurrentUser.Friends}} , // exclude current user friends
                {isOnboarded :true}
            ]
        })

          res.status(200).json(recommandedUser)

    }catch(err){
        console.log(`Error getting recommended user: ${err}`);
        return res.status(500).json({message:"Internal Server Error"});
    }

}


export async function getMyFriends (req, res) {
    try{

         const userFriend = await User.findById(req.user._id)
             .select('Friends')
             .populate('Friends' , "fullName profilePic nativeLanguage learningLanguage")


         await res.status(200).json(userFriend.Friends)

    }catch(err){
        console.log(`Error in getting friend: ${err}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function sendFriendRequest(req,res){
    try{
        const myId = req.user.id;
        const {id:recipientId} = req.params

        if(myId === recipientId) return res.status(400).json({message:"you cannot send Friend request  to yourself  "})

        const recipient = await User.findById(recipientId);

        if(!recipient) return res.status(400).json({message:`User not found`})
                 // check if user already friends
             if(recipient.Friends.includes(myId)){
                 return res.status(400).json({message:"You are already Friends"})
             }

             //check if request if already send;

        const existingRequest = await FriendRequest.findOne({
            $or:[
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ]
        })

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        return res.status(201).json(friendRequest)

    }catch(err){
        console.log(`Error sending friend: ${err}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId)

        if(!friendRequest) return res.status(400).json({message:`Request not found`})


        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }


        friendRequest.status = 'accepted'
        await friendRequest.save()

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: {Friends: friendRequest.recipient}
        } )

        console.log(User)


        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{Friends: friendRequest.sender}

        })


         res.status(200).json({message:"Successfully accepted"})
    }catch(err){
        console.log(`Error accepting friend: ${err}`);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getFriendRequests(req,res){
    try{
        const incomingReqs= await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")


        const acceptedReqs = await FriendRequest.find({
            sender:req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")

        return   res.status(200).json({ incomingReqs, acceptedReqs });
    }catch (e) {
        console.log(`Error in Friend Request ${e}`)
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}





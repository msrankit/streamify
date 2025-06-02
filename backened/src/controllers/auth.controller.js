import {User} from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import {upsertClient} from "../database/stream.js";



export async function signin(req, res) {
 const { email, password , fullName } = req.body;
    try{
        if(!email || !password || !fullName){
           return res.status(400).json({message: "every Field is required"})
        }

        if(password.length < 6){
            return res.status(400).json({message: "password must be at least 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
        }

         const idx = Math.floor(Math.random() * 100) + 1; // get random value from 1 to 100

        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic:randomAvatar
        })

        try{
            await upsertClient({
                id: newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic
            })
            console.log('stream user Created')
        }catch(e){
            console.log(`error in creating stream user ${e}`)
        }

        const token = jwt.sign({userId:newUser._id} , process.env.JWT_SECRET_KEY, {expiresIn: '7d'})

        res.cookie('jwt', token, {
            httpOnly: true , // prevent XSS attack
            maxAge: 7 * 24 * 60 * 1000,
            sameSite: 'strict' ,// prevent CSRF attack
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(201).json({success: true , user:newUser})
    }catch(err){
        console.log(`Error find in sign-in ${err}`);
        res.status(500).json({success: false , message:'Internal Server Error'})
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: " Field is required"})
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({message: " Invalid email or password"})
        }

        const isCorrectPassword = await user.comparePassword(password)
        if (!isCorrectPassword) {
            return res.status(401).json({message: " Invalid email or password"})
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'})

        res.cookie('jwt', token, {
            httpOnly: true, // prevent XSS attack
            maxAge: 7 * 24 * 60 * 1000,
            sameSite: 'strict',// prevent CSRF attack
            secure: process.env.NODE_ENV === 'production'
        })


        return res.status(200).json({success: true, user: user})


    } catch (e) {
        console.log(`Error login: ${e}`);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

export function logout(req, res) {
    try{
       res.clearCookie('jwt')
        return res.status(200).json({success: true,message:'Logout Successfully'})
    }catch(err){
        console.log(`Error logout: ${err}`);
        return res.status(500).json({success:false , message:`internal server error`   })
    }
}

export async function onboard(req, res) {
    try{
        const userId = req.user._id

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message: " Field is required", missingField:[
                "fullName" && !fullName,
                    "nativeLanguage" && !nativeLanguage,
                    "learningLanguage" && !learningLanguage,
                    "bio" && !bio,
                    "location" && !location,
                ].filter(Boolean)});
        }
        if(nativeLanguage === learningLanguage){
            return res.status(401).json({message: "native language can not be same as learning language "})
        }
        const updateUser = await User.findByIdAndUpdate(
            userId,{
                ...req.body,
                isOnboarded: true,
            },{new: true}
        )

        if(!updateUser){
            return res.status(404).json({ message: "User not found" })
        }

        try{

            await upsertClient({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePic || "",
            })

            console.log(`user created succesfully`)

        }catch(streamError){
            console.log(`Error ocuured in stream Updating user ${streamError}`)
        }

        return res.status(200).json({success: true, user: updateUser})

    }catch(e){
        console.log('ERROR  ocuured in onbarding' , e)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
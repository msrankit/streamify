import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import useAuthuser from "../hooks/useAuthuser.js";
import {useQuery} from "@tanstack/react-query";
import {getStreamToken} from "../libs/api.js";
import {  Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import {StreamChat} from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../component/ChatLoader.jsx";
import CallButton from "../component/CallButton.jsx";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {

    const {id : targetUserid } = useParams()

    const [chatClient, setchatClient] = useState(null);
    const [channel, setchannel] = useState(null);
    const [loading , setloading] = useState(true);

    const {authUser} = useAuthuser()

    const {data : TokenData } = useQuery({
        queryKey:["streamToken"],
        queryFn:getStreamToken,
        enabled:!!authUser,
    })


    useEffect(() => {

        const initChat = async () => {


            if (!TokenData?.token || !authUser) return;
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY)

                await client.connectUser({
                    id: authUser._id,
                    name: authUser.name,
                    image: authUser.profilePic,
                }, TokenData?.token)

                const channelId = [authUser._id, targetUserid].sort().join('-')
                // you and me
                // if i start the chat => channelId: [myId, yourId]
                // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserid]
                });
                await currChannel.watch()
                setchatClient(client);
                setchannel(currChannel);

            } catch (e) {
                console.log(e)
                toast.error("Could not connect to chat. Please try again.");

            } finally {
                setloading(false);
            }
        }
         initChat()
    },[authUser , TokenData , targetUserid])

    if(!chatClient || !channel || loading) return <ChatLoader/>

    const handleVideoCall = () => {
        if(channel){

            const callUrl = `${window.location.origin}/call/${channel.id}`

            channel.sendMessage({
                text:` Join Me ${callUrl}`
            })
            toast.success("Video has been Started")
        }

    }

    return (
        <div className="h-[93vh]">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}
export default ChatPage

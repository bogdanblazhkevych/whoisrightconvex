import React, { useState, useEffect, useRef } from "react";
import TextInput from "../textinput/textinput";
import Textoutput from "../textoutput/textoutput";
import chatcss from "./chat.module.css"
import ChatDetails from "../chatdetails/chatdetails";
// import socket from './../../socket'

interface ChatMessageInterface {
    message: string,
    sessionId: string,
    type: string,
    userId: string,
    displayName: string
}

interface ChatPropsInterface {
    chatData: {
        sessionId: string,
        host: {
          displayName: string,
          userId: string
        }
        guest: {
          displayName: string,
          userId: string
        }
    },
    userType: "guest" | "host";
}

export default function Chat(props: ChatPropsInterface){
    const { chatData, userType } = props;
    const sessionId = chatData.sessionId;
    const userId = chatData[userType].userId
    const displayName = chatData[userType].displayName
    const type = "outgoing"
    const [messageLog, setMessageLog] = useState<ChatMessageInterface[]>([]);

    // useEffect(() => {
    //     socket.emit('join_room', sessionId)

    //     socket.on('receive_message', (message) => {
    //         console.log(message)
    //         setMessageLog((previous) => [...previous, message])            
    //     })
    // }, [socket])

    // useEffect(() => {
    //     didUserSendLastMessage()
    // })

    // function sendMessage(message: string) {
    //     socket.emit("send_message", {message, sessionId, type, userId, displayName})
    //     setMessageLog((previous) => [...previous, {message, sessionId, type, userId, displayName}]) 
    // }

    function didUserSendLastMessage() {
        if (messageLog.length > 0) {
            if (messageLog[messageLog.length - 1].userId == userId) {
                document.documentElement.style.setProperty("--send-message-icon-color", '#888D97')
                return true
            } else {
                document.documentElement.style.setProperty("--send-message-icon-color", '#148AFF')
                return false
            }
        } else {
            return false
        }
    }

    return(
        <div className={chatcss.test}>
            <div className={chatcss.chatwrapper}>
                <ChatDetails chatData={chatData}/>
                <Textoutput messageLog={messageLog}/>
                {/* <TextInput sendMessage={sendMessage} didUserSendLastMessage={didUserSendLastMessage}/> */}
            </div>
        </div>
    )
}

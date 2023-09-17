import { useEffect } from "react";
import TextInput from "../textinput/textinput";
import Textoutput from "../textoutput/textoutput";
import chatcss from "./chat.module.css"
import ChatDetails from "../chatdetails/chatdetails";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserDataInterface } from './../../App'

interface ChatPropsInterface {
    userData: UserDataInterface;
}

export default function Chat(props: ChatPropsInterface){
    const { userData } = props;
    const { sessionId, displayName, userId } = userData
    const messages = useQuery(api.room.messages, {sessionId: sessionId, userId: userId})
    const addMessage = useMutation(api.room.addMessage)
    const chatData = useQuery(api.room.getRoomInfo, { sessionId })
    
    useEffect(() => {
        didUserSendLastMessage()
    })
    
    useEffect(() => {
        window.addEventListener("beforeunload", handleUserDisconnect)
    }, [])

    function sendMessage(message: string) {
        addMessage({
            sessionId: sessionId,
            userId: userId,
            message: message,
            displayName: displayName
        })
    }

    function didUserSendLastMessage() {
        if (messages && messages.length > 0) {
            if (messages[messages.length - 1].userId == userId) {
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

    function handleUserDisconnect() {
        const data = JSON.stringify({
            userId: userId,
            sessionId: sessionId,
            displayName: displayName
        });

        navigator.sendBeacon(`https://mild-goose-90.convex.site/userDisconnected`, data);
    }

    return(
        <div className={chatcss.test}>
            <div className={chatcss.chatwrapper}>
                <ChatDetails chatData={chatData}/>
                <Textoutput messageLog={messages}/>
                <TextInput sendMessage={sendMessage} didUserSendLastMessage={didUserSendLastMessage}/>
            </div>
        </div>
    )
}

import { useEffect } from "react";
import TextInput from "../textinput/textinput";
import Textoutput from "../textoutput/textoutput";
import chatcss from "./chat.module.css"
import ChatDetails from "../chatdetails/chatdetails";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TestChatRoomDataInterface } from './../../App'

interface ChatPropsInterface {
    testChatRoomData: TestChatRoomDataInterface;
}

export default function Chat(props: ChatPropsInterface){
    const { testChatRoomData } = props;
    const { sessionId, displayName, userId} = testChatRoomData
    const messages = useQuery(api.room.messages, {sessionId: sessionId, displayName: displayName})
    const addMessage = useMutation(api.room.addMessage)
    const chatData = useQuery(api.room.getRoomInfo, { sessionId })

    useEffect(() => {
        didUserSendLastMessage()
    })

    function sendMessage(message: string) {
        addMessage({
            sessionId: sessionId,
            userId: userId,
            message: message,
            displayName: displayName
        })
    }

    function didUserSendLastMessage() {
        if (!messages) {
            return false
        }
        if (messages.length > 0) {
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

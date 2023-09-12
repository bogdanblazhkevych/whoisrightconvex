import React, { useEffect, useState } from "react";
import joincss from "./join.module.css"
// import socket from './../../socket'
// import Displaysessionid from "../displaysessionid/displaysessionid";
// import Entersessionid from "../entersessionid/entersessionid";
import Home from "../home/home";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "./../../convex/_generated/api";
import Displaysessionid from "../displaysessionid/displaysessionid";

interface JoinPropsInterface {
    setCurrentDisplay: (currentDisplay: string) => void;
    chatData: ChatDataInterface;
    setChatData: (chatData: ChatDataInterface) => void;
    setUserType: (userType: "guest" | "host") => void;
}

interface ChatDataInterface {
    sessionId: string,
    host: {
        displayName: string,
        userId: string
    }
    guest: {
        displayName: string,
        userId: string
    }
}

export default function Join(props: JoinPropsInterface) {

    const { setCurrentDisplay, setChatData, chatData, setUserType } = props

    const [currentJoinDisplay, setCurrentJoinDisplay] = useState('home')
    const [displayName, setDisplayName] = useState('')
    const [codeInput, setCodeInput] = useState('')
    const [joinError, setJoinError] = useState({error: false, errorMessage: ''})

    const getCode = useAction(api.roomactions.getSessionId)
    const [sessionId, setSessionId] = useState<null | string>(null)

    async function createSession() {
        if (displayName.length === 0) {
            return
        }
        setUserType('host')
        let code = await getCode()
        setSessionId(code)
        setCurrentJoinDisplay("show-code")
    }

    function joinSession() {
        if (displayName.length === 0) {
            return
        }
        setUserType('guest')
        setCurrentJoinDisplay('enter-code')
    }

    function handleCodeInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        let codeInputUpperCase = e.target.value.toUpperCase()
        setCodeInput(codeInputUpperCase)
    }

    function handleDisplayNameInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault()
        setDisplayName(e.target.value)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'Enter') {
            // socket.emit("validate_code", codeInput, displayName)
        }
    }

    // useEffect(() => {
    //     socket.on("code_generated", (code) => {
    //         setChatData({ ...chatData, sessionId: code })
    //         setCurrentJoinDisplay("show-code")
    //         console.log("code generated: ", code)
    //     })

    //     socket.on("all_users_validated", (chatData) => {
    //         console.log(chatData)
    //         setChatData(chatData)
    //         setCurrentDisplay('chatroom')
    //     })

    //     socket.on("joinError", (errorName) => {
    //         setJoinError({
    //             error: true,
    //             errorMessage: errorName
    //         })

    //         setTimeout(() => {
    //             setJoinError({
    //                 error: false,
    //                 errorMessage: ''
    //             })
    //         }, 1000)
    //     })

    //     socket.on('error', (errorName) => {
    //         console.log(errorName)
    //     })
    // }, [socket])

    return (
        <div className={joincss.joinwrapper}>
            {currentJoinDisplay === "home" &&
                <Home handleDisplayNameInputChange={handleDisplayNameInputChange}
                      createSession={createSession} 
                      joinSession={joinSession} 
                      displayName={displayName} />
            }
            {currentJoinDisplay === "show-code" &&
                <Displaysessionid sessionId={sessionId} />
            }
            {/* {currentJoinDisplay === "enter-code" &&
                <Entersessionid handleCodeInputChange={handleCodeInputChange} 
                                handleKeyDown={handleKeyDown} 
                                codeInput={codeInput} 
                                joinError={joinError}
                                createSession={createSession}/>
            } */}
        </div>
    )
}
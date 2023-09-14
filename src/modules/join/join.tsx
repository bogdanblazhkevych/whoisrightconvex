import React, { useEffect, useState } from "react";
import joincss from "./join.module.css"
import Home from "../home/home";
import { useAction } from "convex/react";
import { api } from "./../../convex/_generated/api";
import Displaysessionid from "../displaysessionid/displaysessionid";
import Entersessionid from "../entersessionid/entersessionid";
import { TestChatRoomDataInterface } from './../../App'

interface JoinPropsInterface {
    // chatData: ChatDataInterface;
    // setChatData: (chatData: ChatDataInterface) => void;
    // setUserType: (userType: "guest" | "host") => void;
    // setSessionId: React.Dispatch<React.SetStateAction<string>>;
    // sessionId: string;
    // displayName: string,
    // setDisplayName: React.Dispatch<React.SetStateAction<string>>;
    // userId: string;
    // setUserId: React.Dispatch<React.SetStateAction<string>>;
    testChatRoomData: TestChatRoomDataInterface;
    setTestChatRoomData: React.Dispatch<React.SetStateAction<TestChatRoomDataInterface>>
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

    // const { setChatData, chatData, setUserType, setSessionId, sessionId, userId, setUserId, testChatRoomData, setTestChatRoomData} = props
    const { testChatRoomData, setTestChatRoomData} = props

    const [currentJoinDisplay, setCurrentJoinDisplay] = useState('home')
    // const [displayName, setDisplayName] = useState('')
    const [codeInput, setCodeInput] = useState('')
    const [joinError, setJoinError] = useState({ error: false, errorMessage: '' })
    const [displayName, setDisplayName] = useState('')

    const getCode = useAction(api.roomactions.getSessionId);
    const validateCode = useAction(api.roomactions.validateSessionId);
    // const [sessionId, setSessionId] = useState<null | string>(null)

    async function createSession() {
        if (displayName.length === 0) {
            return
        }
        // setUserType('host')
        let codeData = await getCode({ displayName: displayName })
        setTestChatRoomData((prevTestChatRoomData) => {
            return {
                ...prevTestChatRoomData,
                sessionId: codeData.sessionId,
                userId: codeData.userId,
                userType: "host",
                displayName: displayName
            }
        })
        // setSessionId(codeData.sessionId)
        // setUserId(codeData.userId)
        setCurrentJoinDisplay("show-code")
    }

    function joinSession() {
        if (displayName.length === 0) {
            return
        }
        setTestChatRoomData((prevTestChatRoomData) => {
            return {
                ...prevTestChatRoomData,
                userType: "guest"
            }
        })
        // setUserType('guest')
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

    async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            let isValidated = await validateCode({ sessionId: codeInput, displayName: displayName })
            console.log("is validated::: ", isValidated)
            if (isValidated.validated && isValidated.sessionId) {
                setTestChatRoomData((prevTestChatRoomData) => {
                    return {
                        ...prevTestChatRoomData,
                        sessionId: isValidated.sessionId,
                        userId: isValidated.userId,
                        displayName: displayName
                    }
                })
                // setSessionId(isValidated.sessionId);
                // setUserId(isValidated.userId)
            } else {
                setJoinError({
                    error: true,
                    errorMessage: isValidated.error
                })
                setTimeout(() => {
                    setJoinError({
                        error: false,
                        errorMessage: ''
                    })
                }, 1000)
            }
        }
    }

    return (
        <div className={joincss.joinwrapper}>
            {currentJoinDisplay === "home" &&
                <Home handleDisplayNameInputChange={handleDisplayNameInputChange}
                      createSession={createSession}
                      joinSession={joinSession}
                      displayName={displayName} />
            }
            {currentJoinDisplay === "show-code" &&
                <Displaysessionid sessionId={testChatRoomData.sessionId} />
            }
            {currentJoinDisplay === "enter-code" &&
                <Entersessionid handleCodeInputChange={handleCodeInputChange}
                                handleKeyDown={handleKeyDown}
                                codeInput={codeInput}
                                joinError={joinError}
                                createSession={createSession} />
            }
        </div>
    )
}
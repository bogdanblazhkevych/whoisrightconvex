import React, { useEffect, useState } from "react";
import joincss from "./join.module.css"
import Home from "../home/home";
import { useAction } from "convex/react";
import { api } from "./../../convex/_generated/api";
import Displaysessionid from "../displaysessionid/displaysessionid";
import Entersessionid from "../entersessionid/entersessionid";
import { UserDataInterface } from './../../App'

interface JoinPropsInterface {
    userData: UserDataInterface;
    setUserData: React.Dispatch<React.SetStateAction<UserDataInterface>>
}

export default function Join(props: JoinPropsInterface) {
    const { userData, setUserData } = props;
    // \/ \/ \/ TODO use routing instead of this. same goes for App.tsx
    const [currentJoinDisplay, setCurrentJoinDisplay] = useState('home');
    const [codeInput, setCodeInput] = useState('');
    const [displayName, setDisplayName] = useState('')
    const [joinError, setJoinError] = useState({ error: false, errorMessage: '' });
    const getCode = useAction(api.roomactions.getSessionId);
    const validateCode = useAction(api.roomactions.validateSessionId);

    async function createSession() {
        //TODO: validate that the chosen display name is not empty
        if (displayName.length === 0) {
            return
        }
        let codeData = await getCode({ displayName: displayName })
        setUserData((prevUserData) => {
            return {
                ...prevUserData,
                sessionId: codeData.sessionId,
                userId: codeData.userId,
                displayName: displayName
            }
        })
        setCurrentJoinDisplay("show-code")
    }

    function joinSession() {
        if (displayName.length === 0) {
            return
        }
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
            if (isValidated.validated && isValidated.sessionId) {
                setUserData((prevUserData) => {
                    return {
                        ...prevUserData,
                        sessionId: isValidated.sessionId,
                        userId: isValidated.userId,
                        displayName: displayName
                    }
                })
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
                <Displaysessionid sessionId={userData.sessionId} />
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
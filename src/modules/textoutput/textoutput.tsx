import React, { useEffect, useRef } from "react";
import textoutputcss from './textoutput.module.css'

interface ChatMessageInterface {
    message: string,
    sessionId: string,
    type: string,
    userId: string,
    displayName: string
}

interface TextoutputInterface {
    // messageLog: ChatMessageInterface[];
    messageLog: any[] | null | undefined
}

export default function Textoutput(props: TextoutputInterface) {
    const { messageLog } = props;
    const textOutputWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(messageLog)
        if (textOutputWrapperRef.current) {
            textOutputWrapperRef.current.scrollTop = textOutputWrapperRef.current.scrollHeight
        }
    }, [messageLog])

    return (
        <div className={textoutputcss.textoutputwrapper} ref={textOutputWrapperRef}>
            {messageLog?.map((chatMessage: ChatMessageInterface, index: number) => {
                return (
                    <>
                        {
                            chatMessage.userId != messageLog[index + 1]?.userId && 
                            chatMessage.type != 'system' &&
                            chatMessage.type != 'outgoing' &&
                            <div key={`${index}sender`} className={`${textoutputcss.sender} ${textoutputcss[`sender${chatMessage.type}`]}`}>{chatMessage.displayName}</div>
                        }
                        <div key={index} className={`${textoutputcss.message} ${textoutputcss[chatMessage.type]}`}>{chatMessage.message}</div>
                    </>
                )
            })}
        </div>
    )
}
import React, { useState, useRef } from "react";
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import textcss from "./textinput.module.css"

interface TextInputPropsInterface {
    sendMessage: (message: string) => void;
    didUserSendLastMessage: () => boolean;
}

export default function TextInput(props: TextInputPropsInterface){
    const { sendMessage, didUserSendLastMessage } = props;
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [message, setMessage] = useState('')

    function setDynamicInputHeight(){
        const textArea = textAreaRef.current;

        if (textArea) {
            textArea.rows = 1;
            
            const { paddingTop, paddingBottom } = getComputedStyle(textArea);
            const textAreaPadding = parseInt(paddingTop) + parseInt(paddingBottom);

            const singleRowHeight = textArea.clientHeight - textAreaPadding - 1;
            const currentRowHeight = textArea.scrollHeight - textAreaPadding;
            
            const rowCount = Math.round(currentRowHeight / singleRowHeight);

            textArea.rows = rowCount;
            console.log(`row count    ${rowCount}`)
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>):void {
        if (didUserSendLastMessage()) {
            return
        }
        setDynamicInputHeight()
        setMessage(e.target.value)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>):void {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessageWrapper()
        }
    }

    function handleClick() {
        sendMessageWrapper()
    }

    function sendMessageWrapper(){
        const textArea = textAreaRef.current;

        if (textArea && message.length > 0) {
            textArea.rows = 1;
            sendMessage(message);
            setMessage('')
        }
    }

    return(
        <div className={textcss.textinputwrapper}>

            <div className={textcss.typefield}>

                <textarea rows={1} ref={textAreaRef} data-expandable className={textcss.inputelement} value={message} onChange={handleInputChange} onKeyDown={handleKeyDown}></textarea>
                
                <div className={textcss.sendbutton}>
                    <div className={textcss.arrowicon} onClick={handleClick}>
                        <BsFillArrowUpRightCircleFill />
                    </div>
                </div>

            </div>

        </div>
    )
}
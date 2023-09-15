import React, { useEffect, useState } from "react";
import chatdetailscss from './chatdetails.module.css'
import { LiaInfoCircleSolid, LiaTimesCircle } from "react-icons/lia";

interface ChatDetailsPropsInterface {
    chatData: {
        sessionId: string;
        users: any[];
    } | undefined
}

export default function ChatDetails(props: ChatDetailsPropsInterface){
    const { chatData } = props;
    const [infoHidden, setInfoHidden] = useState<boolean>()

    useEffect(() => {
        if (window.screen.width > 1400) {
            document.documentElement.style.setProperty('--information-display', 'flex');
            setInfoHidden(false)
        } else {
            document.documentElement.style.setProperty('--information-display', 'none');
            setInfoHidden(true)
        }
    }, [])
    
    const handleClick = () => {
        const currentDisplaySetting = document.documentElement.style.getPropertyValue('--information-display');
        if (currentDisplaySetting == "flex") {
            document.documentElement.style.setProperty('--information-display', 'none');
            setInfoHidden(true)
        } else {
            document.documentElement.style.setProperty('--information-display', 'flex');
            setInfoHidden(false)
        }
    }
    return(
        <div className={chatdetailscss.chatdetailswrapper}>
            <div className={chatdetailscss.chatdetailscontainer}>
                <div className={chatdetailscss.informationtoggle} onClick={handleClick}>
                    {infoHidden ? <LiaInfoCircleSolid /> : <LiaTimesCircle />}
                </div>
                <div className={chatdetailscss.iconswrapper}>
                    <div className={chatdetailscss.usericon}>
                        {chatData ? chatData.users[0][0].toUpperCase() : "X"}
                    </div>
                    <div className={`${chatdetailscss.usericon} ${chatdetailscss.usericonmediator}`}>
                        M
                    </div>
                    <div className={chatdetailscss.usericon}>
                        {chatData ? chatData.users[1][0].toUpperCase() : "X"}
                    </div>
                </div>
                <div className={chatdetailscss.sessionid}>
                    {chatData ? chatData.sessionId : "idk"}
                </div>
            </div>
        </div>
    )
}
import aboutcss from './aboutcss.module.css'
interface AboutPropsInterface {
    isDarkMode: boolean;
    setIsDarkMode: (parameter: boolean | ((prevDarkModeStatus: boolean) => boolean)) => void
}

export default function About(props: AboutPropsInterface) {
    const { isDarkMode, setIsDarkMode } = props

    const handleClick = () => {
        setIsDarkMode((prevDarkMode) => {
            return !prevDarkMode
        })
    }
    //all of this text was generated by chatGPT because i couldnt think of anyhting else to put in the empty space lol
    return (
        <div className={aboutcss.aboutwrapper}>
            <div className={aboutcss.heading}>
                WHOISRIGHT.ME
            </div>

            <div className={aboutcss.subheading}>
                How It Works
            </div>

            <div className={aboutcss.body}>
                WhoIsRight.me connects users through websockets, allowing them to engage in text-based conversations. But what sets us apart is our AI Conflict Mediator. This innovative feature steps in when conversations get heated or conflicts arise, with the goal of finding a resolution that both parties can agree upon.
            </div>

            <div className={aboutcss.subheading}>
                Meet Our AI Conflict Mediator
            </div>

            <div className={aboutcss.body}>
                Our AI Conflict Mediator is powered by GPT-3.5 Turbo, the latest advancement in AI language models. It's designed to remain impartial, using data-driven insights to mediate discussions and provide well-reasoned suggestions. Think of it as a digital peacemaker, here to ensure a balanced and productive exchange of ideas.
            </div>

            <div className={aboutcss.subheading}>
                Why Chose WHOISRIGHT.ME?
            </div>

            <div className={aboutcss.body} style={{color: "var(--text-color)"}}>
                <ul>
                    <li>
                        <span style={{ color: "var(--text-color)", fontWeight: 800 }}>Fairness:</span> <span style={{color:'var(--home-text-color)'}}>We're committed to fairness and impartiality. Our AI Conflict Mediator ensures that all parties get a fair chance to express their views.</span>
                    </li>
                    <li>
                    <span style={{ color: "var(--text-color)", fontWeight: 800 }}>Privacy:</span> <span style={{color:'var(--home-text-color)'}}>We prioritize your privacy. We do not collect any personal data and and once your discussions conclude, they are promptly and permanently deleted from our platform. </span>
                    </li>
                    <li>
                    <span style={{ color: "var(--text-color)", fontWeight: 800 }}>Empowerment:</span> <span style={{color:'var(--home-text-color)'}}>WhoIsRight.me empowers you to engage in meaningful conversations, explore different perspectives, and ultimately, find common ground.</span>
                    </li>
                    <li>
                        <span onClick={handleClick} style={{ color: "var(--text-color)", fontWeight: 800 }} className={aboutcss.colorSchemeSpan}>
                            {
                                isDarkMode ? "Dark Mode" : "Light Mode"
                            }
                        </span> 
                        <span style={{color:'var(--home-text-color)'}}> Switch between the two at your convenience.</span>
                    </li>
                </ul>
            </div>
            
            <div className={aboutcss.subheading}>
                Commitment to Open Source
            </div>
            
            <div className={aboutcss.body}>
                We believe that transparency, collaboration, and community involvement are essential for the growth and improvement of our platform. That's why we are committed to open sourcing as much of our codebase as possible. 
            </div>
            
            <div className={aboutcss.body}>
                If you want to raise issuses, bug reports, or ideas, please do so at our <a className={aboutcss.link} href='https://github.com/bogdanblazhkevych/whoisrightconvex' about="_blank">GitHub Repository</a>
            </div>
        </div>
    )
}
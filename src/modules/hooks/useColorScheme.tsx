import { useEffect, useState } from "react";

export function useColorScheme(): [boolean, (parameter: boolean | ((prevDarkModeStatus: boolean) => boolean)) => void] {
    const [getDarkModeStatus, setDarkModeStatus] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches)

    useEffect(() => {
        let colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
        colorScheme.addEventListener("change", () => {
            setDarkModeStatus(window.matchMedia('(prefers-color-scheme: dark)').matches)
        })
    }, [])

    useEffect(() => {
        console.log("use effect inside hook darkmdoestatus: ", getDarkModeStatus)
        if (getDarkModeStatus) {
            //set :root color schemes to dark
            document.documentElement.style.setProperty('--backdrop-color', '#000000');
            document.documentElement.style.setProperty('--backdrop-blur-color', 'rgba(0, 0, 0, 0.6)');
            document.documentElement.style.setProperty('--secondary-color', '#1e1e1e');
            document.documentElement.style.setProperty('--text-blue-color', '#148AFF');
            document.documentElement.style.setProperty('--text-grey-color', '#3a3a3c');
            document.documentElement.style.setProperty('--text-purple-color', '#362d3b');
            document.documentElement.style.setProperty('--text-color', '#E1E1E3');
            document.documentElement.style.setProperty('--test', 'blue');
            document.documentElement.style.setProperty('--thin-border-color', '#4C4C4C');
            document.documentElement.style.setProperty('--home-text-color', '#9f9fa0');
            document.documentElement.style.setProperty('--sender-label-color', '#939393');
            document.documentElement.style.setProperty('--mediator-icon-darker-shade', '#362d4a');
            document.documentElement.style.setProperty('--mediator-icon-lighter-shade', '#564875');
            document.documentElement.style.setProperty('--user-icon-darker-shade', '#4e4e4e');
            document.documentElement.style.setProperty('--user-icon-lighter-shade', '#6d6d6d');
            // document.documentElement.style.setProperty('--theme-color', '#1e1e1e');
        } else {
            //set :root color schemes to light
            document.documentElement.style.setProperty('--backdrop-color', '#ffffff');
            document.documentElement.style.setProperty('--backdrop-blur-color', 'rgba(254,254,254, 0.6)');
            document.documentElement.style.setProperty('--secondary-color', 'rgb(245,245,245)');
            document.documentElement.style.setProperty('--text-blue-color', '#148AFF');
            document.documentElement.style.setProperty('--text-grey-color', '#E9E9EB');
            document.documentElement.style.setProperty('--text-purple-color', '#be9dd0');
            document.documentElement.style.setProperty('--text-purple-color-light-shade', '#dab4ee');
            document.documentElement.style.setProperty('--text-color', '#020204');
            document.documentElement.style.setProperty('--test', 'blue');
            document.documentElement.style.setProperty('--thin-border-color', 'rgb(192,192,192)');
            document.documentElement.style.setProperty('--home-text-color', '#363636');
            document.documentElement.style.setProperty('--sender-label-color', '#8F8F8F');
            document.documentElement.style.setProperty('--mediator-icon-darker-shade', '#ad87c2');
            document.documentElement.style.setProperty('--mediator-icon-lighter-shade', '#d8b2ec');
            document.documentElement.style.setProperty('--user-icon-darker-shade', '#c1c1c4');
            document.documentElement.style.setProperty('--user-icon-lighter-shade', '#dfdfe0');
            document.documentElement.style.setProperty('--send-message-icon-color', '#148AFF');
            // document.documentElement.style.setProperty('--theme-color', 'rgb(245,245,245)');
        }
    }, [getDarkModeStatus])

    const isDarkMode = getDarkModeStatus;
    const setIsDarkMode = (parameter: boolean | ((prevDarkModeStatus: boolean) => boolean)) => {
        if (typeof parameter === "boolean") {
            setDarkModeStatus(parameter)
        } else if (typeof parameter === "function"){
            let result = parameter(getDarkModeStatus)
            setDarkModeStatus(result)
        }   
    }

    return [isDarkMode, setIsDarkMode]
}
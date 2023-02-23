import { CHROME_CONNECTION_PORT_NAME, LinkedInButtonIndexes, LinkedInDomElements, LinkedInTexts, REQUEST_TYPES } from "../constants";
import { IMessageType, IPeopleInfo } from "../types";

window.onload = (event) => {
    console.log('LinkQuik is fully loaded');
};

let port = null;

chrome.runtime.onConnect.addListener((p) => {
    if (p.name === CHROME_CONNECTION_PORT_NAME) {
        port = p;
    }
})

chrome.runtime.onMessage.addListener(function (request: IMessageType, sender, sendResponse) {    
    if (request.type === REQUEST_TYPES.FIND_PEOPLE) {   
        const results = document.getElementsByClassName(LinkedInDomElements.entityResultsElement)  
        sendResponse({
            type: REQUEST_TYPES.PEOPLE_LIST,
            data: JSON.stringify(parseResults(results))
        })
    } else if (request.type === REQUEST_TYPES.SEND_CONNECTION) {
        const results = document.getElementsByClassName(LinkedInDomElements.entityResultsElement)
        sendConnectionRequest(results)
    }
})

const parseResults = (results: HTMLCollectionOf<Element>) => {
    const parsedData: IPeopleInfo[] = []

    for (let result of results) {
        parsedData.push({
            name: (result.getElementsByClassName(LinkedInDomElements.nameElement)[1] as HTMLElement).innerText.split("\n")[0],
            textInBtn: (result.getElementsByTagName('button')[0] as HTMLButtonElement).innerText
        })

    }

    return parsedData
}


/**
 * The flow goes like this:
 * 
 * There can be 2 buttons in the entity result - Follow or Connect
 * 
 * If it is a follow button, the process is to just click it.
 * If it is a connect button, there are 2 cases.
 * 
 * 1. Upon clicking the connect button, it could open the Optional send note modal.
 * The process is to click the "Send" button directly.
 * 
 * 2. Upon clicking the connect button, "how we know them" modal could open.
 * The process is to click "Other" and then "Connect"
 * Now it opens the optional note modal. Click the "Send" button.
 */
const sendConnectionRequest = async (results: HTMLCollectionOf<Element>) => {
    for (let result of results) {
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });        
        const btn = result.getElementsByTagName('button')[0] as HTMLButtonElement
        
        if (btn.innerText === LinkedInTexts.connectText) {
            await connectTextFlow(btn)
        } else if (btn.innerText === LinkedInTexts.followText) {
            await followTextFlow(btn)
        }
    }
    port.postMessage({ type: REQUEST_TYPES.COMPLETED_SENDING_CONNECTIONS })
}

const connectTextFlow = async (connectBtn: HTMLButtonElement) => {
    connectBtn.click()
    await sleep(1)

    // find all the buttons in the modal
    const btns = document.getElementsByClassName(LinkedInDomElements.confirmationModalElement)[0].getElementsByTagName("button")
    
    // check if send button is present
    let sendBtnPresent = false;
    for (let btn of btns ) {
        // if the send button is present, "optional note modal is opened", click send and done
        if (btn.innerText === LinkedInTexts.sendText) {
            sendBtnPresent = true;
            btn.click()
        }
    }

    // if the send button is not present, "how we know them modal is opened"
    if (!sendBtnPresent) {
        btns[LinkedInButtonIndexes.otherButton].click() // choose "other" in how we know them
        await sleep(1)
        btns[LinkedInButtonIndexes.connectButton].click() // click "connect" button, it opens optional send note modal
        await sleep(1)
        document.getElementsByClassName(LinkedInDomElements.confirmationModalElement)[0]
            .getElementsByTagName("button")[LinkedInButtonIndexes.sendButton].click() // click "send" button in the following modal
    }

    port.postMessage({ type: REQUEST_TYPES.INCREMENT_ONE_CONNECTION })
    await sleep(1)
}

const followTextFlow = async (followBtn: HTMLButtonElement) => {
    followBtn.click()
    port.postMessage({ type: REQUEST_TYPES.INCREMENT_ONE_CONNECTION })
    await sleep(1)
}

const sleep = async (seconds: number) => {
    return new Promise((res, rej) => setTimeout(() => {
        res(true);
    }, seconds * 1000))
}
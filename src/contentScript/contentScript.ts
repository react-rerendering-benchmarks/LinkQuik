import { REQUEST_TYPES } from "../constants";
import { IMessageType, IPeopleInfo } from "../types";

window.onload = (event) => {
    console.log('LinkQuik is fully loaded');
};

let port = null;

chrome.runtime.onConnect.addListener((p) => {
    port = p;
})

chrome.runtime.onMessage.addListener(function (request: IMessageType, sender, sendResponse) {
    console.log(request);
    
    if (request.type === REQUEST_TYPES.FIND_PEOPLE) {   
        const results = document.getElementsByClassName("entity-result")  
        sendResponse({
            type: REQUEST_TYPES.PEOPLE_LIST,
            data: JSON.stringify(parseResults(results))
        })
    } else if (request.type === REQUEST_TYPES.SEND_CONNECTION) {
        const results = document.getElementsByClassName("entity-result")
        sendConnectionRequest(results)
    }
})

const parseResults = (results: HTMLCollectionOf<Element>) => {
    const parsedData: IPeopleInfo[] = []

    for (let result of results) {
        parsedData.push({
            name: (result.getElementsByClassName('app-aware-link')[1] as HTMLElement).innerText.split("\n")[0],
            textInBtn: (result.getElementsByTagName('button')[0] as HTMLButtonElement).innerText
        })

    }

    return parsedData
}

const sendConnectionRequest = async (results: HTMLCollectionOf<Element>) => {
    for (let result of results) {
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });        
        const btn = result.getElementsByTagName('button')[0] as HTMLButtonElement
        
        if (btn.innerText === "Connect") {
            // click opens modal
            btn.click()
            await sleep(1)

            // click the send button on the modal
            const btns = document.getElementsByClassName("artdeco-modal")[0].getElementsByTagName("button")
            
            // linkedIn might ask if we really know them
            let sendBtnPresent = false;
            for (let btn of btns ) {
                if (btn.innerText === "Send") {
                    sendBtnPresent = true;
                    btn.click()
                }
            }

            if (!sendBtnPresent) {
                btns[4].click() // choose "other" in how we know them
                await sleep(1)
                btns[6].click() // click "connect" button
                await sleep(1)
                document.getElementsByClassName("artdeco-modal")[0].getElementsByTagName("button")[2].click() // click "send" button in the following modal
            }
            port.postMessage({ type: REQUEST_TYPES.INCREMENT_ONE_CONNECTION })
            await sleep(1)
        } else if (btn.innerText === "Follow") {
            btn.click()
            port.postMessage({ type: REQUEST_TYPES.INCREMENT_ONE_CONNECTION })
            await sleep(1)
        }
    }
    port.postMessage({ type: REQUEST_TYPES.COMPLETED_SENDING_CONNECTIONS })
}

const sleep = async (seconds: number) => {
    return new Promise((res, rej) => setTimeout(() => {
        res(true);
    }, seconds * 1000))
}
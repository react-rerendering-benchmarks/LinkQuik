import React, { useEffect, useState } from "react";
import { CHROME_CONNECTION_PORT_NAME, LINKEDIN_PEOPLE_SEARCH_URL, REQUEST_TYPES } from "../constants";
import { IMessageType, IPeopleInfo } from "../types";
import { LinkQuikWidget } from "./components/LinkQuikWidget/LinkQuikWidget";
import { NotInLinkedInPage } from "./components/NotInLinkedInPage/NotInLinkedInPage";
import './popup.css'

const Popup = () => {
    const [showLinkQuik, setShowLinkQuik] = useState(false);
    const [results, setResults] = useState<IPeopleInfo[]>([]);
    const [port, setPort] = useState(null);

    useEffect(() => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {

            const isLinkedInSearchPage = tabs[0].url.includes(LINKEDIN_PEOPLE_SEARCH_URL)
            setShowLinkQuik(isLinkedInSearchPage);

            if (isLinkedInSearchPage) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: REQUEST_TYPES.FIND_PEOPLE
                }, function (resp: IMessageType) {
                    console.log(resp);
                    setResults(JSON.parse(resp.data))
                });

                const port = chrome.tabs.connect(tabs[0].id, {name: CHROME_CONNECTION_PORT_NAME});
                setPort(port);
            }
        })
    }, [])

    return (
        <>
            {!showLinkQuik && <NotInLinkedInPage />}
            {showLinkQuik && <LinkQuikWidget results={results} port={port} />}
        </>
    )
};

export default Popup;
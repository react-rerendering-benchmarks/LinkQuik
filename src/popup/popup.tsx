import React, { useEffect, useState } from "react";
import { REQUEST_TYPES } from "../constants";
import { IMessageType, IPeopleInfo } from "../types";
import { LinkQuikWidget } from "./components/LinkQuikWidget";
import { NotInLinkedInPage } from "./components/NotInLinkedInPage";
import './popup.css'

const Popup = () => {
    const [showLinkQuik, setShowLinkQuik] = useState(false);
    const [results, setResults] = useState<IPeopleInfo[]>([]);
    const [port, setPort] = useState(null);

    useEffect(() => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {

            const isLinkedInSearchPage = tabs[0].url.includes("linkedin.com/search/results/people")
            setShowLinkQuik(isLinkedInSearchPage);

            if (isLinkedInSearchPage) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: REQUEST_TYPES.FIND_PEOPLE
                }, function (resp: IMessageType) {
                    console.log(resp);
                    setResults(JSON.parse(resp.data))
                });

                const port = chrome.tabs.connect(tabs[0].id, {name: "ConnectionStatus"});
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
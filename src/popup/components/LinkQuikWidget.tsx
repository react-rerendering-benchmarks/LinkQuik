import React, { useEffect, useState } from 'react'
import { REQUEST_TYPES } from '../../constants'
import { IMessageType, IPeopleInfo } from '../../types'

export interface ILinkQuikWidgetProps {
    results: IPeopleInfo[];
    port: chrome.runtime.Port;
}

export const LinkQuikWidget = ({ results, port }: ILinkQuikWidgetProps) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [completedTask, setCompletedTask] = useState(false);
    const [ongoingTask, setOngoingTask] = useState(false);
    const [sentRequestCount, setSentRequestCount] = useState(0);
    const [oldConnectionCount, setOldConnectionCount] = useState(0);

    useEffect(() => {
        setBtnDisabled(results?.filter(x => ["Follow", "Connect"].includes(x.textInBtn)).length === 0)
        setOldConnectionCount(results?.reduce((a, {textInBtn}) => !["Follow", "Connect"].includes(textInBtn) ? a+1: a, 0))
    }, [results])

    useEffect(() => {
        port.onMessage.addListener(function (msg: IMessageType) {
            if (msg.type === REQUEST_TYPES.INCREMENT_ONE_CONNECTION) {
                setSentRequestCount(sentRequestCount + 1)
            } else if (msg.type === REQUEST_TYPES.COMPLETED_SENDING_CONNECTIONS) {
                setCompletedTask(true);
            }
        })
    }, [results, oldConnectionCount, sentRequestCount])

    const clickHandler = () => {
        setOngoingTask(true);
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: REQUEST_TYPES.SEND_CONNECTION
            });
            setBtnDisabled(true);
        })
    }

    return (
        <div className='mt-4 mx-6'>
            <p className='text-4xl font-sans font-thin mb-1'>People found</p>
            <p className='text-base font-thin'>In this page, there are {results?.length} people,
            in which {oldConnectionCount} are already your connections (or in pending)</p>
            <div className='overflow-scroll max-h-60 mt-2'>
                <ul>
                    {results.map(x => <li className='text-lg font-extralight mb-2'>{x.name} - <span className='text-sm font-medium'>{x.textInBtn === "Message" ? "Connected": x.textInBtn}</span></li>)}
                </ul>
            </div>
            {!completedTask && <button disabled={btnDisabled} onClick={clickHandler} 
            className='mt-3 py-3 px-5 rounded-md bg-[#007AFE] text-white w-full text-base font-light disabled:bg-gray-300'>{ongoingTask ? `Sending... (${sentRequestCount}/${results?.length - oldConnectionCount})` : 'Send connection request'}</button>}
            {completedTask && <button disabled
            className='mt-3 py-3 px-5 rounded-md bg-[#4DA2FF] text-white w-full text-base font-light'>Done</button>}
        </div>
    )
}
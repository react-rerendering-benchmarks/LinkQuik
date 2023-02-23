export enum REQUEST_TYPES {
    FIND_PEOPLE = "FIND_PEOPLE",
    PEOPLE_LIST = "PEOPLE_LIST",
    SEND_CONNECTION = "SEND_CONNECTION",
    INCREMENT_ONE_CONNECTION = "INCREMENT_ONE_CONNECTION",
    COMPLETED_SENDING_CONNECTIONS = "COMPLETED_SENDING_CONNECTIONS"
}

export const CHROME_CONNECTION_PORT_NAME = "ConnectionStatus"

export const NEW_PEOPLE_PHRASES = ["Follow", "Connect"]
export const OLD_PEOPLE_PHRASES = ["Following", "Message", "Pending"]

export const LINKEDIN_PEOPLE_SEARCH_URL = "linkedin.com/search/results/people"

export const LinkedInDomElements = {
    entityResultsElement: "entity-result",
    nameElement: "app-aware-link",
    confirmationModalElement: "artdeco-modal"
}

export const LinkedInTexts = {
    sendText: "Send",
    connectText: "Connect",
    followText: "Follow"
}

export const LinkedInButtonIndexes = {
    otherButton: 4,
    connectButton: 6,
    sendButton: 2
}
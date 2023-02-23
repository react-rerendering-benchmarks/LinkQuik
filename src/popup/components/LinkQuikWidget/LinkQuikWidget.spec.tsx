/**
 * @jest-environment jsdom
 */

import React from "react"
import { LinkQuikWidget } from "./LinkQuikWidget"
import { render, screen } from '@testing-library/react'
import { IPeopleInfo } from "../../../types"

global.chrome = null

describe("LinkQuikWidget tests", () => {
    it("Should render", () => {
        render(<LinkQuikWidget results={[]} port={null} />)
    })

    it("Should show the number of peopel and the already connected people", async () => {
        const data = [
            {
                name: 'a',
                textInBtn: 'Connect'
            },
            {
                name: 'b',
                textInBtn: 'Message'
            },
            {
                name: 'c',
                textInBtn: 'Follow'
            },
            {
                name: 'd',
                textInBtn: 'Following'
            },
            {
                name: 'e',
                textInBtn: 'Connect'
            },
        ]
        
        render(<LinkQuikWidget results={data} port={null} />)

        const text = screen.getByTestId(`description-text`)        

        expect(text.innerHTML).toMatch(`In this page, there are 5 people, in which 2 are already your connections (or in pending)`)

        const btn: HTMLButtonElement = screen.getByTestId(`cta-btn`)        

        expect(btn.disabled).toBeFalsy()
    })

    it("Should disable the button if all are already connections", async () => {
        const data = [
            {
                name: 'a',
                textInBtn: 'Message'
            },
            {
                name: 'b',
                textInBtn: 'Message'
            },
            {
                name: 'c',
                textInBtn: 'Message'
            },
            {
                name: 'd',
                textInBtn: 'Following'
            },
            {
                name: 'e',
                textInBtn: 'Message'
            },
        ]
        
        render(<LinkQuikWidget results={data} port={null} />)

        const btn: HTMLButtonElement = screen.getByTestId(`cta-btn`)        

        expect(btn.disabled).toBeTruthy()
    })
})
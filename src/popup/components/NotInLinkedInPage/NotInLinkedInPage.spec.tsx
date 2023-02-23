/**
 * @jest-environment jsdom
 */

import React from "react"
import { render, screen } from '@testing-library/react'
import { NotInLinkedInPage } from "./NotInLinkedInPage"

global.chrome = null

describe("NotInLinkedInPage tests", () => {
    it("Should render", () => {
        render(<NotInLinkedInPage />)

        const text = screen.getByTestId("main-text")

        expect(text.innerHTML).toMatch("This is not a LinkedIn search page")
    })
})
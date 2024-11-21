"use client"

import { theme, globalStyles, ThemeProps } from "@ory/themes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "styled-components"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props),
)

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
      <ToastContainer />
    </ThemeProvider>
  )
}

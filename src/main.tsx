import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
//import './index.css'

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bgGradient: 'linear(to-br, #000000, #4D4855, orange.500)',
        color: "white"
      }
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode >,
)

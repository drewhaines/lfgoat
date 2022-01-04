import React, { useEffect, useState } from "react"
import { ThemeProvider, Box, Image, Paragraph } from "theme-ui"
import { theme } from "./theme"
import Goat1 from "images/goat-1.gif"
import Goat2 from "images/goat-2.gif"
import Goat3 from "images/goat-3.gif"
import Goat4 from "images/goat-4.gif"
import Play from "images/play.png"
import Pause from "images/pause.png"

const bgColors = ["#fb1420", "#84ef42", "#fbfbf7", "#45b2f3"]
const goats = [Goat1, Goat2, Goat3, Goat4]

function useInterval(callback, delay) {
  const intervalRef = React.useRef(null)
  const savedCallback = React.useRef(callback)
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  React.useEffect(() => {
    const tick = () => savedCallback.current()
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay)
      return () => window.clearInterval(intervalRef.current)
    }
  }, [delay])
  return intervalRef
}

export const Homepage = () => {
  const nami = window?.cardano

  const [index, setIndex] = useState(0)
  const [run, setRun] = useState(true)
  const [wallet, setWallet] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    nami.isEnabled().then((result) => {
      console.log(result)
      setIsEnabled(result)
      if (result) {
        nami.getBalance().then((walletCbor) => {
          window.cbor.decodeFirst(walletCbor).then((balance) => {
            setWallet(balance)
          })
        })
      }
    })
  }, [])

  useInterval(
    () => {
      setIndex((prevIndex) => {
        let newIndex = prevIndex + 1
        if (newIndex > goats?.length - 1) newIndex = 0
        return newIndex
      })
    },
    run ? 1500 : null
  )

  const handleConnect = () => {
    if (nami && !isEnabled) {
      nami.enable().then((result) => {
        nami.getBalance().then((walletCbor) => {
          window.cbor.decodeFirst(walletCbor).then((balance) => {
            setWallet(balance)
          })
        })
      })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bg: bgColors[index], width: "100%", height: "100vh" }}>
        <Paragraph as="h1" sx={{ textAlign: "center", pt: 50 }}>
          Are you ready?
        </Paragraph>
        <Paragraph as="h1" sx={{ textAlign: "center", pt: 25 }}>
          TO F*CKIN' GOAT!
        </Paragraph>

        <Box sx={{ textAlign: "center", pt: 50 }}>
          <Paragraph
            as="h3"
            sx={{
              px: 25,
              py: 15,
              bg: "white",
              border: "3px solid black",
              borderRadius: "8px",
              display: "inline-block",
            }}
            onClick={handleConnect}
          >
            {wallet ? wallet[0] : "Connect Wallet"}
          </Paragraph>
        </Box>
        <Image
          src={goats[index]}
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 250,
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            bg: "#a6611c",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "63px",
          }}
        ></Box>
        <Image
          src={run ? Pause : Play}
          onClick={() => {
            setRun(!run)
          }}
          sx={{
            position: "absolute",
            right: 10,
            bottom: run ? 10 : 16,
            width: 40,
            zIndex: 2,
          }}
        />
      </Box>
    </ThemeProvider>
  )
}

export default Homepage

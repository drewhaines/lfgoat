import React, { useEffect, useState } from "react"
import { ThemeProvider, Box, Grid, Image, Paragraph, Link } from "theme-ui"
import { theme } from "./theme"
import Goat1 from "images/goat-1.gif"
import Goat2 from "images/goat-2.gif"
import Goat3 from "images/goat-3.gif"
import Goat4 from "images/goat-4.gif"
import Goat5 from "images/goat-5.gif"
import Play from "images/play.png"
import Pause from "images/pause.png"

const bgColors = ["#fb1420", "#84ef42", "#fbfbf7", "#45b2f3", "#35ec80"]
const goats = [Goat1, Goat2, Goat3, Goat4, Goat5]

function hex_to_ascii(str1) {
  var hex = str1.toString()
  var str = ""
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
  }
  return str
}

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
  const [collateral, setCollateral] = useState(0)

  const goatsPolicy = "c281975562f394761771f13f599881517fa8455946e7e30454de22da"
  const halloweenPolicy =
    "961cd58296989d288d8ad39507e81fd40c3e562da89c90e5632061da"
  const gtfoPolicy = "206c651b110d91d26106e8aa9237e09ac23c6be854f0f3c2e7338668"

  useEffect(() => {
    nami?.isEnabled()?.then((result) => {
      setIsEnabled(result)
      if (result) {
        nami.getBalance().then((walletCbor) => {
          console.log(walletCbor)

          window.cbor.decodeFirst(walletCbor).then((balance) => {
            let goatIds = []
            if (balance?.[1]) {
              for (let elem of balance[1].entries()) {
                const policy = Buffer.from(elem[0]).toString("hex")

                if (
                  [goatsPolicy, halloweenPolicy, gtfoPolicy].includes(policy)
                ) {
                  for (let elem2 of elem[1].entries()) {
                    const item = Buffer.from(elem2[0]).toString("hex")
                    const assetId = hex_to_ascii(item)
                    console.log(assetId)
                    goatIds.push(assetId)
                  }
                }
              }
            }

            const walletData = [balance?.[0], goatIds]
            setWallet(walletData)
            nami.getCollateral().then((cl) => {
              console.log(cl)
              window.cbor.decodeFirst(cl[0]).then((col) => {
                const sumCollaterals = col
                  ?.map((c) => c[1])
                  ?.reduce((a, b) => a + b, 0)
                setCollateral(sumCollaterals)
              })
            })
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
            nami.getCollateral().then((cl) => {
              console.log(cl)
              window.cbor.decodeFirst(cl[0]).then((col) => {
                const sumCollaterals = col
                  ?.map((c) => c[1])
                  ?.reduce((a, b) => a + b, 0)
                setCollateral(sumCollaterals)
              })
            })
          })
        })
      })
    }
  }

  const walletAmount = (wallet?.[0] || 0) - (collateral || 0)

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bg: bgColors[index],
          width: "100%",
          height: "calc( 100vh - 63px)",
          overflow: "auto",
          pb: "300px",
        }}
      >
        <Paragraph as="h1" sx={{ textAlign: "center", pt: 50 }}>
          Are you ready?
        </Paragraph>
        <Paragraph as="h1" sx={{ textAlign: "center", pt: 25 }}>
          TO F*CKIN' GOAT!
        </Paragraph>
        <Grid>
          {nami ? (
            <>
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
                  {walletAmount
                    ? `${(walletAmount / 1000000)?.toFixed(1)} ₳`
                    : "Connect Nami ₳"}
                </Paragraph>
              </Box>
              <Paragraph
                as="h3"
                sx={{
                  px: 25,
                  py: 15,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                Does not account for ₳ locked in SCs
              </Paragraph>
              {wallet?.[1] && wallet?.[1]?.length > 0 && (
                <>
                  <Paragraph
                    as="h3"
                    sx={{
                      pt: 25,
                      px: 25,
                      py: 15,
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    You own:
                  </Paragraph>
                  {wallet[1]?.map((id) => (
                    <Paragraph
                      as="h3"
                      sx={{
                        px: 25,
                        pb: "5px",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                    >
                      {id}
                    </Paragraph>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <Box sx={{ textAlign: "center", pt: 50, pb: 25 }}>
                <Paragraph
                  as="h3"
                  sx={{
                    px: 25,
                    py: 15,
                    bg: "#cdcdcd",
                    border: "3px solid black",
                    borderRadius: "8px",
                    display: "inline-block",
                    cursor: "not-allowed",
                    userSelect: "none",
                  }}
                >
                  Connect Nami ₳
                </Paragraph>
              </Box>

              <Paragraph
                as="h3"
                sx={{
                  px: 25,
                  py: 15,
                  pt: [0, 15],
                  pb: 0,
                  display: "inline-block",
                  textAlign: "center",
                }}
                onClick={handleConnect}
              >
                Dont have Nami?
              </Paragraph>
              <Box sx={{ textAlign: "center" }}>
                <Link href="https://namiwallet.io/" target="_blank">
                  <Paragraph
                    as="h3"
                    sx={{
                      px: "3px",
                      display: "inline-block",
                      textAlign: "center",
                      color: "#1d6ee1",
                      pb: "3px",
                      borderBottom: "1px solid #1d6ee1",
                      mx: "auto",
                      cursor: "pointer",
                    }}
                  >
                    Get it here!
                  </Paragraph>
                </Link>
              </Box>
            </>
          )}
          <Paragraph
            as="h3"
            sx={{
              px: "3px",
              display: "inline-block",
              textAlign: "center",
              maxWidth: "300px",
              mx: "auto",
              pt: "50px",
            }}
          >
            This page is still under construction. Come back later!
          </Paragraph>
        </Grid>
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
            height: "64px",
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

import React, { useEffect, useState } from "react"
import QrCode from "qrcode"
import styles from "./style.module.css"

const QRCode = (props) => {
  const [qrImgUrl, setQrImgUrl] = useState("")
  const currentURL = window.location.href
  const { type, setQrURL } = props

  useEffect(async () => {
    try {
      setQrImgUrl(await QrCode.toDataURL(currentURL))
      console.log("qrImgUrl: ", qrImgUrl)
      setQrURL(qrImgUrl)
    } catch (err) {
      console.error(err)
    }
  }, [])
  return (
    <div>
      {type && type == "modal" ? (
        <div
          className="qr-code"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${qrImgUrl}`}
            alt="QR Code"
            style={{
              height: "60%",
              width: "60%",
            }}
          />
        </div>
      ) : (
        <details className={styles.details}>
          <summary>
            <b>QR Code</b>
          </summary>
          <div
            className="qr-code"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "2rem",
              alignItems: "center",
            }}
          >
            <img src={`${qrImgUrl}`} alt="QR Code" />
          </div>
        </details>
      )}
    </div>
  )
}

export default QRCode

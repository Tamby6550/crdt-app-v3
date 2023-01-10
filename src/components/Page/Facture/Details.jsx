import React from 'react'
import QRCode from 'react-qr-code'

export default function Details() {
  const options = {
    io:"serieux"
  }
  return (
    <div className='text-center grid w-100'>
       <div>Facture</div>
      <div className='col-6' style={{ height: "auto", margin: "0 auto", width: "100px" }}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={options.toString()}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  )
}

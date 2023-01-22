import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';

import ReactToPrint from 'react-to-print'


export default function Impression(props) {

    return (
        <>
            <ReactToPrint trigger={() =>
                <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 '   />
            } content={() => document.getElementById("scan")} />

            <div className='hidden'>
                <div id="scan" >
                    <div className="flex justify-content-center w-100">
                        <h1>Hello</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

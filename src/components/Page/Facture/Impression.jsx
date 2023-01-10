import React, { useState } from 'react'
import { QrReader } from 'react-qr-reader';
import ScanOverlay from '../../service/ScanOverlay';

export default function Impression() {
  const [data, setData] = useState('No result');
  const [start,SetStart] =useState(false);

  return (
    <>
      <div className='grid justify-content-center' >
        <div className='col-3'>
         {start && <QrReader
         facingMode = "environment"
         ViewFinder={ScanOverlay}
     
            onResult={(result, error) => {
              if (!!result) {
                setData(result?.text);
                SetStart(false)
              }

              if (!!error) {
                console.info(error);
              
              }
            }}
            style={{border:"2px solid red" }}
          />}
          <button onClick={()=>{  setData(""); SetStart(!start) }}>{start ? (<>Arreter</>) : (<>Scanner</>)}</button>
          <p>{data}</p>
        </div>
      </div>
      
    </>
  );
}

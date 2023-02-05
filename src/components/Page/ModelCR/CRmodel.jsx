import React, { useState, useEffect, useRef } from 'react'


export default function CRmodel() {

    const [htmlm, sethtmlm] = useState('')

    return (
        <div>
            <div className='grid h-full'>
                <div className='col-12 pt-0' style={{ borderBottom: '1px solid #efefef' }} >
                        <input type="file" onChange={(e)=>{
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.addEventListener("load", function() {
                              const htmlContent = reader.result;
                              sethtmlm(reader.result)
                              document.getElementById('html').innerHTML=reader.result;
                            //   console.log(htmlContent);
                            });
                            reader.readAsText(file);
                        }} />
                </div>
                <div className='col-12 pt-0' id='html' >
                </div>
            </div>
        </div>
    )
}

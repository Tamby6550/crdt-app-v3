import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as Components from '../../../components/Login/Components';

export default function CRmodel(props) {

    const [allhtml, setallhtml] = useState([{
        name: '',
        link: ''
    }])
    const [htmlm, sethtmlm] = useState([]);

    const getData = async () => {
        try {
            await axios.get(`http://${window.location.hostname}:3354/files`, {
                headers: {
                    'Content-Type': 'text/html'
                }
            }).then(
                (result) => {
                    setallhtml(result.data);
                    console.log(result.data)
                }
            )
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const getHtmlContent = async (e) => {
        let link = e.target.value;
        try {
            await axios.get(link).then(
                (result) => {
                    if (props.recHtml != null) {
                        props.setrecHtml(result.data)
                    } else {
                        props.sethtmlm(result.data);
                    }
                }
            )
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            <div className='grid h-full '>
                <div className='col-12 pt-0 ' style={{  width: '80%',height:'55px' }} >
                    <Components.Label >Choisir le model CR </Components.Label>
                    <Components.Select name='grad_id' onChange={(e) => { getHtmlContent(e) }} style={{height:'42px'}}  >
                        <Components.Option value={''}  ></Components.Option>
                        {allhtml.map((element, index) => (
                            <Components.Option value={element.link} key={index} >{element.name}</Components.Option>
                        ))}
                    </Components.Select>
                  
                </div>
                <div className='col-12 pt-0' id='html' >
                </div>
            </div>
        </div>
    )
}

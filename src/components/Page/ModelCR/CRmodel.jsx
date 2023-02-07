import React, { useState, useEffect, useRef } from 'react'
import axios, { all } from 'axios';
import * as Components from '../../../components/Login/Components';

export default function CRmodel(props) {

    const [allhtml, setallhtml] = useState([{
        name: '',
        link: ''
    }])
    const [htmlm, sethtmlm] = useState([]);

    const getData = async () => {
        try {
            await axios.get(`http://localhost:5000/files`, {
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
            <div className='grid h-full'>
                <div className='col-12 pt-0' style={{ borderBottom: '1px solid #efefef', width: '30%' }} >
                    <Components.Label >Model CR </Components.Label>
                    <Components.Select name='grad_id' onChange={(e) => { getHtmlContent(e) }}  >
                        <Components.Option value={''}  ></Components.Option>
                        {allhtml.map((element, index) => (
                            <Components.Option value={element.link} key={index} >{element.name}</Components.Option>
                        ))}
                    </Components.Select>
                    {/* <select name="" id="" onChange={getHtmlContent}>
                        <option value=""></option>
                        {allhtml.map((element, index) => (
                            <option key={index} value={element.link}>
                                {element.name}
                            </option>
                        ))}
                    </select> */}
                </div>
                <div className='col-12 pt-0' id='html' >
                </div>
            </div>
        </div>
    )
}

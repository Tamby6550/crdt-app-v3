import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Label } from '../../../components/Login/Components';

export default function CRmodel(props) {

  const [allhtml, setallhtml] = useState([{
    name: '',
    link: ''
  }]);
  const [htmlm, sethtmlm] = useState('');

  const getData = async () => {
    try {
      await axios.get(`http://${window.location.hostname}:3354/files`, {
        headers: {
          'Content-Type': 'text/html'
        }
      }).then((result) => {
        setallhtml(result.data);
      }).catch((e) => {
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
    let link = e.value;
    try {
      await axios.get(link).then(
        (result) => {
          if (props.recHtml != null) {
            props.setrecHtml(result.data)
          } else {
            props.sethtmlm(result.data);
          }
        }
      ).catch((e) => {
        console.log(e);
      })
    } catch (error) {
      console.log(error)
    }
  }

  const dropdownOptions = allhtml.map((element, index) => ({
    label: element.name,
    value: element.link
  }));

  return (
    <div>
      <div className='grid h-full'>
        <div className='col-12 pt-0' style={{ width: '70%', height: '40px' }}>
          <Label>Choisir un model CR </Label>
          <Dropdown options={dropdownOptions} value={htmlm}
            onChange={(e) => {
              getHtmlContent(e);
              sethtmlm(e.value);
              if (props.setoldfilename) {
                props.setoldfilename(e.value)
              }
            }} filter placeholder='Sélectionner un modèle' style={{ width: '100%' }} />
        </div>
        <div className='col-12 pt-0' id='html'>
        </div>
      </div>
    </div>
  )
}
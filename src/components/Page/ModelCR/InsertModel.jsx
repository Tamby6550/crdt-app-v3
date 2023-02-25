import React, { useState, useEffect, useRef } from 'react'
import BundledEditor from './service/EditorTiny/BundledEditor';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';

export default function InsertModel() {
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [nomFichier, setnomFichier] = useState('')
    const [recHtml, setrecHtml] = useState(null);

    /*Word */
    const editorRef = useRef(null);
    let reportTemplateRef = useRef();
    const [content, setContent] = useState(null)

    const log = () => {
        if (editorRef.current.getContent() == "") {
            alert('Compte Rendu vide !')
        } else {
            if (editorRef.current) {
                let strin = JSON.stringify({ data: editorRef.current.getContent() });
                let pars = JSON.parse(strin);
                var myElement = document.getElementById("print");
                myElement.innerHTML = editorRef.current.getContent();
                console.log(editorRef.current.getContent())
                envoyeData(pars.data)
            }
        }
    };
    /*Word */



    //Post Vers serveur node js
    const envoyeData = async (data) => {
        setchargePost({ chajoute: true });

        try {
            await axios.post(`http://${window.location.hostname}:3354/api/hello/${nomFichier}`, {
                headers: {
                    'Content-Type': 'text/html'
                },
                body: data
            }).then(
                (result) => {
                    console.log('Insertion ok !')
                }
            )
                .catch((e) => {
                    console.log(e)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const getData = async () => {

        try {
            await axios.get(`http://${window.location.hostname}:3354/api/hello/${nomFichier}`, {
                headers: {
                    'Content-Type': 'text/html'
                }
            }).then(
                (result) => {
                    setrecHtml(result.data)
                    setTimeout(() => {
                        var myElement = document.getElementById("print");
                        myElement.innerHTML = editorRef.current.getContent();
                    }, 550)
                }
            )
                .catch((e) => {
                    console.log(e);

                    setrecHtml(null)
                })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-1  style-modal-tamby">
            <div className='col-12 pt-0 flex flex-row justify-conten-between' style={{ borderBottom: '1px solid #efefef' }} >

                <div className='col-3'>
                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                        <label className="label-input-sm mr-2">Nom examen :</label>
                        <InputText id="username2" aria-describedby="username2-help" name='nom' value={nomFichier.nom} onChange={(e) => { setnomFichier(e.target.value) }} />
                    </div>
                </div>
            </div>

            
            <div className='mb-3' >
                <BundledEditor
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={'<h3>Hello word !</h3>'}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                            'searchreplace', 'table', 'wordcount', 'pagebreak',
                        ],
                        toolbar: 'police| undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
                            'removeformat',
                        language: 'fr_FR',
                        content_style: 'body {  font-family:Helvetica,Arial,sans-serif;min-height:21cm;padding:3px 25px;margin:0 2%;clip-path:inset(-15px -15px 0px -15px); box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:14px } '
                    }}
                />
            </div>
            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
            <ReactToPrint trigger={() =>
                <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
            } content={() => document.getElementById("scan")} />
        </div>
    )
}

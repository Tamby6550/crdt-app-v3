import React, { useState, useEffect, useRef } from 'react'
import BundledEditor from './service/EditorTiny/BundledEditor';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import CRmodel from './CRmodel';
import { Toast } from 'primereact/toast';


export default function InsertModel() {
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [nomFichier, setnomFichier] = useState('')
    const [recHtml, setrecHtml] = useState(null);

    const [model, setmodel] = useState("<h3>Hello word !</h3>")
    /*Word */
    const editorRef = useRef(null);
    let reportTemplateRef = useRef();
    const [content, setContent] = useState(null)


    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /*Notification Toast */

    const log = () => {
        if (nomFichier === '') {
            notificationAction('warn', 'Attention !', 'Le nom examen est vide !')
        } else {
            if (editorRef.current.getContent() == "") {
                notificationAction('warn', 'Attention !', 'Le compte Rendu est vide !')
            } else {
                if (editorRef.current) {
                    let strin = JSON.stringify({ data: editorRef.current.getContent() });
                    let pars = JSON.parse(strin);
                    var myElement = document.getElementById("print");
                    // myElement.innerHTML = editorRef.current.getContent();
                    console.log(editorRef.current.getContent())
                    envoyeData(pars.data)
                }
            }
        }
    };
    const visualier =  () => {
        if (editorRef.current) {
            let strin = JSON.stringify({ data: editorRef.current.getContent() });
            let pars = JSON.parse(strin);
            var myElement = document.getElementById("print");
             myElement.innerHTML = editorRef.current.getContent();
            return document.getElementById("scann");
        }
    };
    /*Word */




    //Post Vers serveur node js
    const envoyeData = async (data) => {
        setchargePost({ chajoute: true });
        try {
            await axios.post(`http://${window.location.hostname}:3354/api/savemodel/${nomFichier}`, {
                headers: {
                    'Content-Type': 'text/html'
                },
                body: data
            }).then(
                (result) => {
                    notificationAction('success', 'Enregistrement Modele CR', 'Modèle CR bien enregistré !')
                    setchargePost({ chajoute: false });
                }
            )
                .catch((e) => {
                    console.log(e)
                    setchargePost({ chajoute: false });
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
        <div className="p-1  style-modal-tamby flex " style={{alignItems:'center',flexDirection:'column'}} >
            <Toast ref={toastTR} position="top-center" />

            <div className='col-12 pt-0 flex  justify-conten-between pb-3' style={{ borderBottom: '1px solid #efefef', alignItems: 'center' }} >
                <div className="field   lg:col-6 md:col-12 col:12 m-0 p-0">
                    <h2 className=" m-1">Nom de la nouvelle examen :</h2>
                    <div >
                        <InputText id="username2" style={{ width: '50%', height: '35px' }} aria-describedby="username2-help" name='nom' value={nomFichier.nom} onChange={(e) => { setnomFichier(e.target.value) }} />
                    </div>
                    <small style={{color:'gray'}} >Exemple : Abdominal F</small>
                </div>
                <div className="field   lg:col-6 md:col-12 col:12 m-0 p-0">
                    <CRmodel sethtmlm={setmodel} setrecHtml={setrecHtml} recHtml={recHtml} />
                </div>
            </div>
            <div className='col-12 mt-3 mb-3' >
                <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
                <ReactToPrint trigger={() =>
                    <Button icon={PrimeIcons.EYE} className='p-button-sm p-button-secondary ml-3 ' label={'Visualiser'} />
                } content={() => visualier()} />
            </div>


            <div className='mb-3 col-10'  >
                <BundledEditor
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={model}
                    init={{
                        height: 700,
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
            <div className='hidden'>
                <div id="scann" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" className='cr_ins' style={{ fontSize: '1.4em' }}></div>
                </div>
            </div>
        </div>
    )
}

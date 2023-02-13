import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { Toast } from 'primereact/toast';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import BundledEditor from './service/EditorTiny/BundledEditor';
import ReactToPrint from 'react-to-print'
import QRCode from 'react-qr-code'


export default function VoirCompteRendu(props) {


    const [recHtml, setrecHtml] = useState(null);
    const [textchrg, settextchrg] = useState('Chargement...')
    const [info, setinfo] = useState({ num_arriv: '', date_arriv: '', cr_name: '', lib_examen: '' })
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [printDesact, setprintDesact] = useState(true)

    const [numQr, setnumQr] = useState('null')

    const chgQr = () => {
        setnumQr((props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv))
    };
    /*Word */
    const editorRef = useRef(null);
    let reportTemplateRef = useRef();
    const [content, setContent] = useState(null)

    const log = () => {
        if (editorRef.current) {
            let strin = JSON.stringify({ data: editorRef.current.getContent() });
            let pars = JSON.parse(strin);
            var myElement = document.getElementById("print");
            myElement.innerHTML = editorRef.current.getContent();
            // console.log(editorRef.current.getContent())
            envoyeData(pars.data)
        }
    };
    /*Word */

    const chargeProps = () => {
        chgQr();
        let lib_examenconv = props.data.lib_examen
        lib_examenconv = lib_examenconv.replace(/\//g, "--");
        lib_examenconv = lib_examenconv.replace(/\"/g, "---");
        lib_examenconv = lib_examenconv.replace(/\#/g, "---");
        lib_examenconv = lib_examenconv.replace(/\=/g, "----");
        lib_examenconv = lib_examenconv.replace(/\&/g, "-----");
        lib_examenconv = lib_examenconv.replace(/\?/g, "------");
        lib_examenconv = lib_examenconv.replace(/\#/g, "-------");
        lib_examenconv = lib_examenconv.replace(/\'/g, "--------");
        let numDate = (props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv) + lib_examenconv;
        setinfo({ num_arriv: props.num_arriv, date_arriv: props.date_arriv, cr_name: ((props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv) + lib_examenconv), lib_examen: props.lib_examen })
    };

    //Post Vers serveur node js
    const envoyeData = async (data) => {
        setchargePost({ chajoute: true });
        let lib_examenconv = props.data.lib_examen
        lib_examenconv = lib_examenconv.replace(/\//g, "--");
        lib_examenconv = lib_examenconv.replace(/\"/g, "---");
        lib_examenconv = lib_examenconv.replace(/\#/g, "---");
        lib_examenconv = lib_examenconv.replace(/\=/g, "----");
        lib_examenconv = lib_examenconv.replace(/\&/g, "-----");
        lib_examenconv = lib_examenconv.replace(/\?/g, "------");
        lib_examenconv = lib_examenconv.replace(/\#/g, "-------");
        lib_examenconv = lib_examenconv.replace(/\'/g, "--------");

        let numDate = (props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv) + lib_examenconv;
        try {
            await axios.post(`http://${window.location.hostname}:3354/api/hello/${numDate}`, {
                headers: {
                    'Content-Type': 'text/html'
                },
                body: data
            }).then(
                (result) => {
                    setTimeout(() => {
                        onSub()
                    }, 500)
                }
            )
                .catch((e) => {
                    console.log('hello' + e)
                })
        } catch (error) {
            console.log('kjsdljf' + error)
        }
    }
    const getData = async () => {
        // setchargePost({ chajoute: true });
        settextchrg('Chargement...');
        let lib_examenconv = props.data.lib_examen
        lib_examenconv = lib_examenconv.replace(/\//g, "--");
        lib_examenconv = lib_examenconv.replace(/\"/g, "---");
        lib_examenconv = lib_examenconv.replace(/\#/g, "---");
        lib_examenconv = lib_examenconv.replace(/\=/g, "----");
        lib_examenconv = lib_examenconv.replace(/\&/g, "-----");
        lib_examenconv = lib_examenconv.replace(/\?/g, "------");
        lib_examenconv = lib_examenconv.replace(/\#/g, "-------");
        lib_examenconv = lib_examenconv.replace(/\'/g, "--------");

        let numDate = (props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv) + lib_examenconv;
        try {
            await axios.get(`http://${window.location.hostname}:3354/api/hello/${numDate}`, {
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
                    // console.log(e);
                    settextchrg('Aucune compte rendu !')
                })
        } catch (error) {
            console.log(error)
        }
    }
    // useEffect(() => {
    //     console.log(info)
    // }, [info])


    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }

    /**Style css */

    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };

    /**Style css */


    /* Modal */

    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setprintDesact(true)
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }

    const renderHeader = (name) => {
        //Ovaina ho numero ny date


        return (
            <div>
                <h4 className='mb-1'>Compte Rendu
                    {/* : <i style={{ fontWeight: '800', color: 'black' }} >Date d'arrivée : {props.date_arriv} , numéro : {props.num_arriv} , Combinaison : {numQr} </i>  */}
                </h4>
                <hr />
            </div>
        );
    }

    /** Fin modal */

    const onSub = async () => { //Ajout de donnees vers Laravel
        notificationAction('success', 'Compte Rendu', 'Modification succé');//message avy @back
        setchargePost({ chajoute: true });

        // await axios.post(props.url + 'updateExamenDetailsCR', info)
        //     .then(res => {
        //         setprintDesact(false);
        //         setchargePost({ chajoute: false });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         notificationAction('error', 'Erreur', err.data.message);//message avy @back
        //         setchargePost({ chajoute: false });
        //     });
    }

    return (
        <>

            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 ml-4 p-button-secondary ' tooltip='Modifier le compte rendu' tooltipOptions={{ position: 'top' }}
                onClick={() => { onClick('displayBasic2'); chargeProps(); getData(); }} />

            <Dialog maximizable header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-8 md:col-9 col-10 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <Toast ref={toastTR} position="top-right" />
                {/* <SaisieReglement/> */}
                <div className="p-1  style-modal-tamby">
                    <div className='mb-3'>
                        <BundledEditor
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={recHtml === null ? '<h1>' + textchrg + '</h1>' : recHtml}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                    'searchreplace', 'table', 'wordcount', 'pagebreak',
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
                                    'removeformat | help',
                                language: 'fr_FR',

                                content_style: 'body { font-family:Helvetica,Arial,sans-serif;min-height:21cm;padding:3px 25px;margin:0 20%;clip-path:inset(-15px -15px 0px -15px); box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:12px } '
                            }}
                        />
                    </div>
                    <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
                    <ReactToPrint trigger={() =>
                        <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
                    } content={() => document.getElementById("scann")} />
                </div>
            </Dialog>
            <div className='hidden'>
                <div id="scann" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" style={{ fontSize: '1.4em' }}></div>
                    <div className='w-100 flex justify-content-end'>
                    <div style={{ width: "45px", height: "45px",position:'absolute',bottom:'50px',right:'0px' ,margin:'0px',padding:'0px'}} >
                            <QRCode
                                size={100}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={numQr}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

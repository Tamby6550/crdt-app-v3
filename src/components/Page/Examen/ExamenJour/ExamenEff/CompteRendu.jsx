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
import CRmodel from '../../../ModelCR/CRmodel';

export default function CompteRendu(props) {
    const [info, setinfo] = useState({ num_arriv: '', date_arriv: '', cr_name: '', lib_examen: '' })
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [printDesact, setprintDesact] = useState(true);

    const [htmlm, sethtmlm] = useState('')

    const [recHtml, setrecHtml] = useState(null);
    const [textchrg, settextchrg] = useState('Chargement...')

    const [numQr, setnumQr] = useState('null')

    const [copy, setcopy] = useState(false);
    //Code QR
    const chgQr = () => {
        setnumQr((props.date_arriv).replace(/\//g, "") + '' + (props.num_arriv))
    };

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
                // console.log(editorRef.current.getContent())
                envoyeData(pars.data)
            }
        }
    };
    /*Word */

    const chargeProps = () => {
        getData();
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
                    console.log(e)
                })
        } catch (error) {
            console.log(error)
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
                    console.log(e);

                    setrecHtml(null)
                })
        } catch (error) {
            console.log(error)
        }
    }


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
        props.chargementData()
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
                <h4 className='m-1'>
                    Compte Rendu
                    <center className='m-0 p-0'>

                        <label style={{ fontWeight: '800' }} >

                            Date arrivé : {props.date_arriv}
                            {/* , numéro : {props.num_arriv} , Combinaison : {numQr}  */}
                        </label>
                    </center>
                </h4>
                <hr />
            </div>
        );
    }

    /** Fin modal */

    const onSub = async () => { //Ajout de donnees vers Laravel
        await axios.post(props.url + 'updateExamenDetailsCR', info)
            .then(res => {
                setprintDesact(false);
                notificationAction(res.data.etat, 'Compte Rendu', res.data.message);//message avy @back
                setchargePost({ chajoute: false });
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setchargePost({ chajoute: false });
            });
    }

    function copyToClipBoard() {
        var content = document.getElementById('textCopy').innerText;
        navigator.clipboard.writeText(content)
            .then(() => {
                setcopy(true);
                setTimeout(() => {
                    setcopy(false);
                }, 800)

            })
            .catch(err => {
                console.log('Something went wrong', err);
            })
    }

    return (
        <>

            <Button icon={PrimeIcons.BOOK} className='p-buttom-sm p-1 ml-4 p-button-info ' tooltip='Ajout compte rendu' tooltipOptions={{ position: 'top' }}
                onClick={() => { onClick('displayBasic2'); chargeProps(); }} />

            <Dialog maximizable header={renderHeader('displayBasic2')} style={{ zIndex: '1101 !important' }} visible={displayBasic2} className="lg:col-8 md:col-9 col-10 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <Toast ref={toastTR} position="top-right" />
                {/* <SaisieReglement/> */}
                <div className="p-1  style-modal-tamby">
                    <div className='col-12 pt-0 flex flex-row justify-conten-between' style={{ borderBottom: '1px solid #efefef',alignItems:'center' }} >
                        <div className='col-4'>
                            <CRmodel sethtmlm={sethtmlm} setrecHtml={setrecHtml} recHtml={recHtml} />
                        </div>
                        <div className='col-8'>
                            <p className='m-1' style={{ fontWeight: 'bold', color: '#2c2b2b', fontSize: '1.5em',display:'flex',alignItems:'center' }} >
                                Nom: <span  > <strong id='textCopy' > {props.nom}</strong></span>
                                <Button icon={copy?PrimeIcons.CHECK :PrimeIcons.COPY}  className={'p-button-sm p-button-success ml-5'} label={copy? 'Copie !' :'Copier '} onClick={copyToClipBoard} />
                            </p>
                            <p className='m-1' style={{ fontWeight: 'bold', color: '#2c2b2b', fontSize: '1.5em' }} >Examen : <span  ><strong>{props.lib_examen}</strong></span></p>
                        </div>
                    </div>
                    <div className='flex px-4 p-3'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
                        <ReactToPrint trigger={() =>
                            <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-info ml-3 ' label={'Imprimer'} disabled={printDesact} />
                        } content={() => document.getElementById("scann")} />

                    </div>
                    <div className='mb-3' >
                        <BundledEditor
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={recHtml != null ? recHtml : htmlm}
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

                </div>
            </Dialog>
            <div className='hidden'>
                <div id="scann" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" className='cr_ins' style={{ fontSize: '1.4em' }}></div>
                    <div className='flex justify-content-end w-100' >

                        <div style={{ width: "45px", height: "45px", position: 'absolute', bottom: '50px', margin: '0px', padding: '0px', right: '0px' }} >
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

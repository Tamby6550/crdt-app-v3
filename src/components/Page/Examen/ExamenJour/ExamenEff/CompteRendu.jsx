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


export default function CompteRendu(props) {


    const [info, setinfo] = useState({ num_arriv: '', date_arriv: '', cr_name: '', lib_examen: '' })
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [printDesact, setprintDesact] = useState(true);

    const [recHtml, setrecHtml] = useState(null);
    const [textchrg, settextchrg] = useState('Chargement...')

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
            console.log(editorRef.current.getContent())
            envoyeData(pars.data)
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
            await axios.post(`http://localhost:5000/api/hello/${numDate}`, {
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
            await axios.get(`http://localhost:5000/api/hello/${numDate}`, {
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
                <h4 className='mb-1'>Compte Rendu  : <i style={{ fontWeight: '800', color: 'black' }} >Date d'arrivée : {props.date_arriv} , numéro : {props.num_arriv} , Combinaison : {numQr} </i> </h4>
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

    return (
        <>

            <Button icon={PrimeIcons.BOOK} className='p-buttom-sm p-1 ml-4 p-button-info ' tooltip='Ajout compte rendu' tooltipOptions={{ position: 'top' }}
                onClick={() => { onClick('displayBasic2'); chargeProps(); }} />

            <Dialog maximizable header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-8 md:col-9 col-10 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <Toast ref={toastTR} position="top-right" />
                {/* <SaisieReglement/> */}
                <div className="p-1  style-modal-tamby">
                    <div className='mb-3'>
                        <BundledEditor
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={recHtml != null ? recHtml : '<h2 style="text-indent: 0cm; margin: 0cm; break-after: avoid; font-size: 12pt; font-family: Arial, sans-serif; font-weight: normal;"><span style="font-size: 13pt;">&nbsp;</span></h2><h2 style="margin: 0cm; text-indent: 9cm; break-after: avoid; font-size: 12pt; font-family: Arial, sans-serif; font-weight: normal;"><span style="font-size: 13pt;">Antananarivo, le </span><span style="font-size: 13pt; ">23 janvier 2023</span></h2><p style="text-indent: 2cm; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="text-indent: 2cm; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Cher confr&egrave;re,</span></p><p style="text-indent: 2cm; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm 0cm 0cm 2cm; font-size: 10pt;"><span style="font-size: 13pt;">Nous vous remercions de votre confiance pour nous avoir adress&eacute; votre patient </span><strong style="font-size: 13pt;">Monsieur</strong></p><p style="text-indent: 2cm; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Suite &agrave; votre demande, il a b&eacute;n&eacute;fici&eacute; de l&rsquo;examen suivant&nbsp;:</span></p><h1 style="text-indent: 2cm; margin: 0cm; break-after: avoid; font-size: 10pt; text-decoration: underline;"><span style="font-size: 13pt;">Scanner abdomino-pelvien sans et avec produit de contraste</span></h1><p style="text-indent: 2cm; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">dont voici le compte-rendu&nbsp;:</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><u><span style="font-size: 13pt;">Technique&nbsp;:</span></u></strong></p><p style="margin: 0cm; font-size: 10pt;"><strong><u><span style="font-size: 13pt;">&nbsp;</span></u></strong></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Acquisition volumique axiale depuis les bases pulmonaires jusqu&rsquo;au niveau de la symphyse pubienne avec reconstructions coronales et sagittales.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><u><span style="font-size: 13pt;">R&eacute;sultat&nbsp;:</span></u></strong></p><p style="margin: 0cm; font-size: 10pt;"><strong><u><span style="font-size: 13pt;">&nbsp;</span></u></strong></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Foie </span></strong><span style="font-size: 13pt;">de taille normale, de contours r&eacute;guliers, homog&egrave;ne&nbsp; sans formation nodulaire circonscrite.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Veine porte et veines sus-h&eacute;patiques homog&egrave;nes, de calibre normal.</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">V&eacute;sicule biliaire</span></strong><span style="font-size: 13pt;"> alithiasique, &agrave; paroi fine, sans tumeur.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Voies biliaires intra et extra-h&eacute;patiques&nbsp; non dilat&eacute;es.</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Pancr&eacute;as</span></strong><span style="font-size: 13pt;"> de morphologie normale sans nodule tissulaire ni kyste ni calcification.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Pas de dilatation du Wirsung.</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Rate </span></strong><span style="font-size: 13pt;">de volume normal, homog&egrave;ne</span><span style="font-size: 13pt;">.</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Reins</span></strong><span style="font-size: 13pt;"> de taille, de forme et de situation normales.&nbsp; Pas de dilatation des cavit&eacute;s py&eacute;lo-calicielles ni lithiase ni tumeur. </span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Vessie</span></strong><span style="font-size: 13pt;"> de contours r&eacute;guliers sans anomalie pari&eacute;tale ni lithiase. </span></p><p style="margin: 0cm; font-size: 13pt;">Pas de masse abdomino-pelvienne.</p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Pas d&rsquo;ad&eacute;nopathie profonde.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Pas d&rsquo;&eacute;panchement intra-p&eacute;riton&eacute;al.</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><u><span style="font-size: 13pt;">Conclusion</span></u></strong><span style="font-size: 13pt;">&nbsp;:</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm; font-size: 10pt;"><strong><span style="font-size: 13pt;">Scanner abdomino-pelvien normal.</span></strong></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="text-indent: 191.4pt; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">Bien confraternellement,</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><h3 style="text-indent: 148.85pt; margin: 0cm; break-after: avoid; font-size: 12pt; font-family: Arial, sans-serif; font-weight: normal;"><span style="font-size: 13pt;">Docteur RAZAFINDRATRIMO Francis</span></h3><p style="text-indent: 21.3pt; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p><p style="text-indent: 70.9pt; margin: 0cm; font-size: 10pt;"><span style="font-size: 13pt;">&nbsp;</span></p>'}
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

                                content_style: 'body { font-family:Helvetica,Arial,sans-serif;min-height:21cm;padding:3px 25px;margin:0 15%;clip-path:inset(-15px -15px 0px -15px); box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:12px } '
                            }}
                        />
                    </div>
                    <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
                    <ReactToPrint trigger={() =>
                        <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} disabled={printDesact} />
                    } content={() => document.getElementById("scan")} />
                </div>
            </Dialog>
            <div className='hidden'>
                <div id="scan" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" className='cr_ins' style={{ fontSize: '1.4em' }}></div>
                    <div className='flex justify-content-end w-100' >
                        <div style={{ width: "45px", height: "45px" }}>
                            <QRCode
                                size={256}
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

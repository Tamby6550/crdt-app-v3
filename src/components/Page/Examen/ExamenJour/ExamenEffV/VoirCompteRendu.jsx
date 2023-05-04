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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import moment from 'moment/moment';

export default function VoirCompteRendu(props) {
    moment.locale('fr', {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
        ordinal : function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse : /PD|MD/,
        isPM : function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem : function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // Used to determine first week of the year.
        }
    });

    moment.locale('fr');

    const [recHtml, setrecHtml] = useState(null);
    const [textchrg, settextchrg] = useState('Chargement...')
    const [info, setinfo] = useState({ num_arriv: '', date_arriv: '', cr_name: '', lib_examen: '' })
    const [chargePost, setchargePost] = useState({ chajoute: false });
    const [printDesact, setprintDesact] = useState(true)

    const [numQr, setnumQr] = useState('null')

    const [copy, setcopy] = useState(false);


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

    useEffect(() => {
        if (editorRef.current) {
        var currentDate = new Date();
        // Formatage de la date au format souhaité (ici, jj/mm/aaaa)
        var formattedDate = moment().format('DD MMMM YYYY');

        // Remplacement de [DATE] par la date formatée
        var content = editorRef.current.getContent().replace('[DATE]', formattedDate);
        editorRef.current.setContent(content);
    }
    }, [recHtml])


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
        fontSize: '1rem', padding: ' 0.2rem 0.3rem', backgroundColor: '#0FBD6F', border: '1px solid #0FBD6F'
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
    function unsecuredCopyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            setcopy(true);
          document.execCommand('copy');
                setTimeout(() => {
                    setcopy(false);
                }, 800)
        } catch (err) {
          console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
      }

    return (
        <>

            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 ml-4 p-button-secondary ' tooltip='Modifier le compte rendu' tooltipOptions={{ position: 'top' }}
                onClick={() => { onClick('displayBasic2'); chargeProps(); getData(); }} />

            <Dialog maximizable header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-8 md:col-9 col-10 p-0" footer={renderFooter('displayBasic2')} 
             onHide={() => {
                const accept = () => {
                    onHide('displayBasic2');
                }
            
                const reject = () => {
                    return null;
                }
                confirmDialog({
                    message: 'Avez-vous déjà enregistré ?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept,
                    reject
                });                    
                
            }}>
                <Toast ref={toastTR} position="top-right" />

                <div className="p-1  style-modal-tamby">
                    <div className='col-12 pt-0 flex flex-row justify-conten-between' style={{ borderBottom: '1px solid #efefef' }} >
                        <div className='col-4'>
                            <CRmodel setrecHtml={setrecHtml} recHtml={recHtml} />
                        </div>
                        <div className='col-8'>
                            <p className='m-1' style={{ fontWeight: 'bold', color: '#2c2b2b', fontSize: '1.2em' }} >Nom : <span  ><strong  id='textCopy' >{props.nom}</strong>
                            <Button icon={copy?PrimeIcons.CHECK :PrimeIcons.COPY}  className={'p-button-sm p-button-info ml-5'} style={stylebtnRec} label={copy? 'Copie !' :'Copier '} onClick={()=>{unsecuredCopyToClipboard(props.nom)}} />

                            </span></p>
                            <p className='m-1' style={{ fontWeight: 'bold', color: '#2c2b2b', fontSize: '1.2em' }} >Examen : <span  ><strong>{props.lib_examen}</strong></span></p>
                        </div>
                    </div>
                    <div className='flex px-4 p-3'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargePost.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={log} />
                        <ReactToPrint trigger={() =>
                            <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-secondary ml-3 ' label={'Imprimer'} />
                        } content={() => document.getElementById("scann")} />
                    </div>
                    <div className='mb-3'>
                        <BundledEditor
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={recHtml === null ? '<h1>' + textchrg + '</h1>' : recHtml}
                            init={{
                                height: 700,
                                menubar: false,
                                plugins: [
                                    'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                    'searchreplace', 'table', 'wordcount', 'pagebreak',
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
                                    'removeformat | help',
                                language: 'fr_FR',

                                content_style: 'body { font-family:Helvetica,Arial,sans-serif;min-height:21cm;padding:3px 25px;margin:0 2%;clip-path:inset(-15px -15px 0px -15px); box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:12px } '
                            }}
                        />
                    </div>

                </div>
            </Dialog>
            <div className='hidden'>
                <div id="scann" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" style={{ fontSize: '1.4em' }}></div>
                    <div className='w-100 flex justify-content-end'>
                        <div style={{ width: "45px", height: "45px", position: 'absolute', bottom: '50px', right: '0px', margin: '0px', padding: '0px' }} >
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

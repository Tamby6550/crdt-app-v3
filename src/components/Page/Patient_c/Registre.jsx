import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Registre(props) {

    //Declaration useSatate
    const [infoRegistre, setinfoRegistre] = useState({ num_arriv: '', date_arriv: '', id_patient: '' });
    const [charge, setcharge] = useState({ chajoute: false });

    const onVideInfo = () => {
        setinfoRegistre({ num_arriv: '', date_arriv: '', id_patient: '' });
    }
    
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
    };
    const stylebtnModif = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#476c81', border: '1px solid #476c81'
    };
    const stylebtnT = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#2196F3', border: '1px solid #2196F3'
    };

    /**Style css */

    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }

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
        onVideInfo();
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    const renderHeader = (name) => {
        return (
            <div>
                <h3 className='mb-1'> {props.tambyR == 'nouveau' ? 'N° journal d\'arrivé' : "Modif n°  d'arrivée d'un patient"} </h3>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    //Get n° registre
    const loadData = async () => {
        setinfoRegistre({ id_patient: 'chargement...', num_arriv: 'chargement...', date_arriv: 'chargement...' });

        await axios.get(props.url + `getNumArriv`)
            .then(
                (result) => {
                    setinfoRegistre({ id_patient: props.id_patient, num_arriv: result.data.numarr, date_arriv: result.data.datej });
                }
            );
    }
    const onSub = async () => { //Ajout de donnees vers Laravel
        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertRegistre', infoRegistre)
            .then(res => {
                notificationAction(res.data.etat, 'Patient ajouté dans le journal d\'arrivée', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                onVideInfo();
                onHide('displayBasic2');
                props.setnumJournal({num:res.data.num_arr,datej:infoRegistre.date_arriv})
                setTimeout(() => {
                    props.onClick('displayBasic')
                }, 200)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
                onHide('displayBasic2');
            });
    }
    return (
        <>
            <Button icon={PrimeIcons.PLUS} className={'p-buttom-sm mr-2 p-1'} style={stylebtnRec} tooltip={'Journal d\'entrer'} tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); loadData() }} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-3 md:col-5 col-8 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <div className='pb-3 ml-5'>
                        {/* <h3>Numéro d'arrivée :  <u style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold', fontSize: '1.4rem' }}> {infoRegistre.num_arriv}</u>  </h3> */}
                        <h3>Aujourd'hui : <u style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{infoRegistre.date_arriv}</u>  </h3>
                        <hr />
                        <h3><u>Id patient</u>   : <u style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{infoRegistre.id_patient} </u>  </h3>
                        <h3><u>Nom</u>  : <label >{props.nom + ' ' + props.prenom}</label>  </h3>
                        <h3><u>Date de naissance </u> :    <label >{props.date_naiss}</label>  </h3>
                        <h3><u>Téléphone</u>  :  <label >{props.telephone}</label> </h3>
                    </div>
                    <center>
                        <Button icon={PrimeIcons.PLUS} className='p-button-sm p-button-info p-2 ' style={stylebtnT} label={charge.chajoute ? 'Veuillez attendez... ' : 'Ajouter dans le journal'} onClick={() => {
                            if (charge.chajoute) {
                                return null
                            } else {
                                onSub();
                            }
                        }} />
                    </center>
                </div>
            </Dialog>
            <Toast ref={toastTR} position="top-right" />
        </>
    )
}

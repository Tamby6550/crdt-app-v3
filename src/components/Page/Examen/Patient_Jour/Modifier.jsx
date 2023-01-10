import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import PatientM from './PatientM';
import Registre from '../../Patient_c/Registre';/*Importer modal */
import { Dialog } from 'primereact/dialog';
import { InputMask } from 'primereact/inputmask';

import axios from 'axios'

export default function Modifier(props) {

    //Declaration useSatate
    const [infoRegistre, setinfoRegistre] = useState({ num_arriv: '', date_arriv: '', id_patient: '', type_pat: '', verf_exam: '', prenom: '', nom: '', date_naiss: '', telephone: '' });
    const oncharger = (data) => {
        setinfoRegistre({ num_arriv: data.numero, date_arriv: data.date_arr, id_patient: props.data.id_patient, type_pat: props.data.type_pat, prenom: '', verf_exam: '', nom: props.data.nom, date_naiss: props.data.date_naiss, telephone: props.data.telephone });
    }
    const [charge, setcharge] = useState({ chajoute: false });

    const [verfSinonymeModf, setverfSinonymeModf] = useState(false)




    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnT = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#2196F3', border: '1px solid #2196F3'
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
        setverfSinonymeModf(false);

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
                <h4 className='mb-1'>Modification  N° Arrivé </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const onModif = async () => { //Modifier de donnees vers Laravel
        setcharge({ chajoute: true });
        await axios.put(props.url + 'updateRegistre', infoRegistre)
            .then(res => {
                notificationAction(res.data.etat, 'Modification', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onHide('displayBasic2');
                }, 500)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 ' style={stylebtnRec} tooltip='Modifier' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); oncharger(props.data) }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-11 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className='flex flex-row justify-content-around  ' >
                        <h4>Numéro d'arrivée :  <u style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold', fontSize: '1.4rem' }}> {infoRegistre.num_arriv}</u>  </h4>
                        <h4>Date d'arrivée : <u style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{infoRegistre.date_arriv}</u>  </h4>
                    </div>
                    <hr />
                    <div className='flex flex-column justify-content-center'>
                        <div className="field my-1 flex flex-row px-4 ">
                            <div className=' flex flex-column '>
                                <label htmlFor="username2" className="label-input-sm">Id Patient</label>
                                <InputText id="username2" value={infoRegistre.id_patient} aria-describedby="username2-help" className="form-input-css-tamby" name='rc' readOnly />
                            </div>
                            <small className='mt-4 ml-1'>
                                <PatientM url={props.url} setinfoRegistre={setinfoRegistre} infoRegistre={infoRegistre} />
                            </small>
                        </div>
                        <div className='grid px-4'>
                            <div className="col-8 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nom</label>
                                <InputText id="username2" value={infoRegistre.nom} aria-describedby="username2-help" className="form-input-css-tamby" name='stat' readOnly />
                            </div>
                            <div className="col-4 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Date de naissance</label>
                                <InputMask id="basic" value={infoRegistre.date_naiss} mask='99/99/9999' name='date_arriv' className={"form-input-css-tamby"} readOnly />
                            </div>
                            <div className="col-6 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Tarif</label>
                                <InputText id="username2" value={infoRegistre.type_pat} aria-describedby="username2-help" className="form-input-css-tamby" name='stat' readOnly />
                            </div>
                            <div className="col-6 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Téléphone</label>
                                <InputText id="username2" value={infoRegistre.telephone} aria-describedby="username2-help" className="form-input-css-tamby" name='stat' readOnly />
                            </div>
                        </div>
                    </div>

                    {verfSinonymeModf ? <center><label id="username2-help" className="p-success block justify-content-center" style={{ fontWeight: 'bold' }}>Même Patient ! (<i>Choisir un autre patient</i>) !  </label></center> : null}
                    <center>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-info p-2 ' style={stylebtnT} label={charge.chajoute ? 'Veuillez attendez... ' : 'Enregistrer la modification'} onClick={() => {
                            if (charge.chajoute) {
                                return null
                            } else {
                                if (props.data.id_patient == infoRegistre.id_patient) {
                                    setverfSinonymeModf(true);
                                } else {
                                    setverfSinonymeModf(false);
                                    onModif()
                                }
                            }
                        }} />
                    </center>
                </div>
            </Dialog>
        </>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask';

/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {

    const controleChampDate = (dt) => {
        let splitDt = (dt).split('/');
        if (splitDt[0] <= 31 && splitDt[1] <= 12) {
            RechercheloadData()
        } else {
            alert('Verifier la date du journal !');
        }
    }

    const [infoRegistre, setinfoRegistre] = useState({ num_arriv: '', date_arriv: '', id_patient: '' });
    const [verfChamp, setverfChamp] = useState(false);
    const onVide = () => {
        setinfoRegistre({ num_arriv: '', date_arriv: '', id_patient: '' })
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
        onVide()
        setverfChamp(false);

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
                <h4 className='mb-1'>Recherche dans le journal </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    let onInfoRegistre = (e) => {
        setinfoRegistre({ ...infoRegistre, [e.target.name]: e.target.value })
    }


    //Recherche List client
    const RechercheloadData = async () => {
        props.setCharge(true);
        props.setlistRegistre([{ id_patient: 'Chargement de données...' }])
        axios.post(props.url + 'rechercheRegistre', infoRegistre)
            .then(
                (result) => {
                    props.setinfoRegistre(infoRegistre)
                    props.setrefreshData(0);
                    props.setlistRegistre(result.data);
                    props.setCharge(false);
                    onHide('displayBasic2');
                }
            );
    }
    return (
        <div>
            <Button tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-5 md:col-6 col-10 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date du journal</label>
                                    <InputMask id="basic" value={infoRegistre.date_arriv} mask='99/99/9999' name='date_arriv' onChange={(e) => { onInfoRegistre(e) }} className={"form-input-css-tamby"} />
                                    <small>format: jj/mm/aaaa</small>
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">N° journal d'arrivé</label>
                                    <InputMask id="username2" value={infoRegistre.num_arriv} mask='999' aria-describedby="username2-help" className={"form-input-css-tamby"} name='num_arriv' onChange={(e) => { onInfoRegistre(e) }} />
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Id Patient</label>
                                    <InputText id="username2" value={infoRegistre.id_patient} aria-describedby="username2-help" className={"form-input-css-tamby"} name='id_patient' onChange={(e) => { onInfoRegistre(e) }} />
                                </div>
                            </div>
                        </form>
                        {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche - Date ou N° arrivé ou Id </small></center> : null}
                        <div className='flex mt-3 mr-4 justify-content-end '>
                            <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {

                                if (infoRegistre.num_arriv == "" && infoRegistre.date_arriv == "" && infoRegistre.id_patient == "") {
                                    setverfChamp(true)
                                }
                                else {
                                    setverfChamp(false)
                                    if (infoRegistre.date_arriv != "") {
                                        controleChampDate(infoRegistre.date_arriv)
                                    } else {

                                        RechercheloadData()
                                    }
                                }
                            }} />

                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

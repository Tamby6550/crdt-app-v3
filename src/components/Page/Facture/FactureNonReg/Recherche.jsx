import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {


    const [infoRehFact, setinfoRehFact] = useState({ num_facture:'',date_facture:'',nom_patient:'', nom_client:'',numero_arr: '', date_arr: '' });
    const [verfChamp, setverfChamp] = useState(false);
    const onVide = () => {
        setinfoRehFact({ num_facture:'',date_facture:'',nom_patient:'', nom_client:'',numero_arr: '', date_arr: '', date_naiss: '', nom: '' })
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
        // onVideInfo()
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
                <h4 className='mb-1'>Recherche Facture </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const chDonneRech = async (e) => {
        setinfoRehFact({ ...infoRehFact, [e.target.name]: e.target.value })
    }


    //Recherche Patient
    const RechercheloadData = async () => {
        // console.log(infoRehFact);
        props.setCharge(true)
        axios.post(props.url + 'getRechercheEffectFacture', infoRehFact)
            .then(
                (result) => {
                    // props.setrefreshData(0);
                    props.setinfoReherche(infoRehFact)
                    props.setlistFactureEff(result.data);
                    props.setCharge(false);
                    onHide('displayBasic2');
                    onVide()
                }
            );
    }
    return (
        <div>

            <Button tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-4 md:col-5 col-8 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Numéro Facture</label>
                                    <InputMask id="basic" value={infoRehFact.num_facture} mask='99/99/9999' name='num_facture' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date facture</label>
                                    <InputMask id="basic" value={infoRehFact.date_facture} mask='99/99/9999' name='date_facture' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                              
                            </div>

                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Numéro d'arrivée</label>
                                    <InputMask id="username2" value={infoRehFact.numero_arr} mask='999' aria-describedby="username2-help" name='numero_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date d'arrivée </label>
                                    <InputMask id="basic" value={infoRehFact.date_arr} mask='99/99/9999' name='date_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                              

                            </div>
                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom du Patient</label>
                                    <InputText id="username2" value={infoRehFact.nom_patient} aria-describedby="username2-help" name='nom_patient' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom client </label>
                                    <InputText id="basic" value={infoRehFact.nom_client}  name='nom_client' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                              

                            </div>
                        </form>
                        {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche - Code ou Nom </small></center> : null}
                        <div className='flex mt-3 mr-4 justify-content-end '>
                            <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {
                                if (infoRehFact.num_facture == "" && infoRehFact.date_facture == "" && infoRehFact.nom_patient == "" && infoRehFact.nom_client == "" && infoRehFact.numero_arr == "" && infoRehFact.date_arr == "") {
                                    return false;
                                } else {
                                    RechercheloadData();
                                }
                            }} />

                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

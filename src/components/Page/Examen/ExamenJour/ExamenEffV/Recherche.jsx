import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {


    const [infoRecherche, setinfoRecherche] = useState({ date_examen:'',numero_arr: '', date_arr: '', date_naiss: '', nom: '' });
    const [verfChamp, setverfChamp] = useState(false);
    const onVide = () => {
        setinfoRecherche({date_examen:'', numero_arr: '', date_arr: '',date_naiss:'',nom: '' })
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
                <h4 className='mb-1'>Recherche Patient </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const chDonneRech = async (e) => {
        setinfoRecherche({ ...infoRecherche, [e.target.name]: e.target.value })
    }


    //Recherche Patient
    const RechercheloadData = async () => {
        props.setCharge(true)
        axios.post(props.url + 'getRehercheExamenEffValide', infoRecherche)
            .then(
                (result) => {
                    // props.setrefreshData(0);
                    props.setinfoReherche(infoRecherche)
                    props.setlistExamenNonEff(result.data)
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
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-5 md:col-6 col-8 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                {/* <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date d'examen</label>
                                    <InputMask id="basic" value={infoRecherche.date_examen} mask='99/99/9999' name='date_examen' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div> */}
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Numero d'arrivé</label>
                                    {/* <InputText id="username2" value={infoRecherche.numero_arr} aria-describedby="username2-help" name='numero_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} /> */}
                                    <InputMask id="basic" value={infoRecherche.numero_arr} mask='999' name='numero_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date d'arrivé</label>
                                    <InputMask id="basic" value={infoRecherche.date_arr} mask='99/99/9999' name='date_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                            </div>

                            <div className='grid px-4'>
                                <div className="col-8 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom du Patient</label>
                                    <InputText id="username2" value={infoRecherche.nom} aria-describedby="username2-help" name='nom' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date de naissance </label>
                                    <InputMask id="basic" value={infoRecherche.date_naiss} mask='99/99/9999' name='date_naiss' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                </div>

                            </div>
                        </form>
                        {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche - Code ou Nom </small></center> : null}
                        <div className='flex mt-3 mr-4 justify-content-end '>
                            <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {
                                if (infoRecherche.date_arr == "" && infoRecherche.date_examen == "" &&  infoRecherche.nom == "" && infoRecherche.date_naiss == "" && infoRecherche.numero_arr == "") {
return false;
                                }else{
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

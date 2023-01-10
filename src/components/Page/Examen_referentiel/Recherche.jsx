import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {


    const [verfChamp, setverfChamp] = useState(false);


    const [selecttarif, setselecttarif] = useState(null);
    const [selecttype, setselecttype] = useState(null);

    const onTarifChange = (e) => {
        setselecttarif(e.value);
        props.setinfoexamen({ ...props.infoexamen, [e.target.name]: (e.target.value) });
    }
    const onTypesChange = (e) => {
        setselecttype(e.value);
        props.setinfoexamen({ ...props.infoexamen, [e.target.name]: (e.target.value) });
    }

    const choixType = [
        { label: 'ECHOGRAPHIE', value: 'ECHOGRAPHIE' },
        { label: 'MAMMOGRAPHIE', value: 'MAMMOGRAPHIE' },
        { label: 'PANORAMIQUE DENTAIRE', value: 'PANORAMIQUE DENTAIRE' },
        { label: 'SCANNER', value: 'SCANNER' },
        { label: 'RADIOGRAPHIE', value: 'RADIOGRAPHIE' },
        { label: 'ECG', value: 'ECG' },
        { label: 'AUTRES', value: 'AUTRES' }
    ]
    const choixTarif = [
        { label: 'E', value: 'E' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' }
    ]

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
        setverfChamp(false);
        setselecttarif(null);
        selecttype(null)

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
                <h4 className='mb-1'>Recherche Examen </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */




    //Recherche List client
    const RechercheloadData = async () => {
        // console.log(props.infoexamen)
        props.setCharge(true);
        props.setlistexamen([{ code_tarif: 'Chargement de données...' }])
        axios.post(props.url + 'rechercheExamen', props.infoexamen)
        .then(
            (result) => {
                    props.setCharge(false);
                    props.setrefreshData(0);
                    props.setlistexamen(result.data)
                    onHide('displayBasic2');
                    props.setCharge(false);
                }
            );
    }
    return (
        <div>

            <Button tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary'
                onClick={() => {
                    onClick('displayBasic2');
                    if (props.tarif != "") {
                        props.setinfoexamen({ ...props.infoexamen, tarif: props.tarif });
                    }
                }} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '35vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <form className='flex flex-column justify-content-center'>

                        <div className='grid px-4'>
                            <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Libellé</label>
                                <InputText id="username2" value={props.infoexamen.lib} aria-describedby="username2-help" className={verfChamp.lib ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='lib' onChange={(e) => { props.setinfoexamen({ ...props.infoexamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                {verfChamp.lib ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Cotation</label>
                                <InputText id="username2" value={props.infoexamen.code_tarif} aria-describedby="username2-help" className={verfChamp.code_tarif ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='code_tarif' onChange={(e) => { props.setinfoexamen({ ...props.infoexamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                {verfChamp.code_tarif ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Type</label>
                                <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="type" className={verfChamp.type ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder="" />
                                {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            {props.tarif != "" ? null :
                                <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Tarif</label>
                                    <Dropdown value={selecttarif} options={choixTarif} onChange={onTarifChange} name="tarif" className={verfChamp.tarif ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder="" />
                                    {verfChamp.tarif ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            }
                            {/* <div className="lg:col-8 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Montant (Ar)</label>

                                <InputText value={props.infoexamen.montant} name="montant" onChange={(e) => { props.setinfoexamen({ ...props.infoexamen, [e.target.name]: parseInt(e.target.value) + 0 }) }} className={verfChamp.montant ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                {verfChamp.montant ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div> */}
                        </div>

                    </form>
                    {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche  </small></center> : null}

                    <div className='flex mt-3 mr-4 justify-content-end'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' label={'Recherche'} onClick={() => {
                            if (props.infoexamen.lib == "" && props.infoexamen.code_tarif == "" && props.infoexamen.type == "" && props.infoexamen.tarif == "" && props.infoexamen.montant == "") {
                                setverfChamp(true)
                            }
                            else {
                                setverfChamp(false)
                                RechercheloadData()
                            }
                        }} />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

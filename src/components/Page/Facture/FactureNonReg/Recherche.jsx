import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox'
import { TabView, TabPanel } from 'primereact/tabview';
import axios from 'axios';
import ComponentChoixClient from './ComponentChoixClient';

export default function Recherche(props) {

    const [activeIndex, setActiveIndex] = useState(0);


    const [infoRehFact, setinfoRehFact] = useState({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_debut:'',date_fin:'', pec: false });
    const [verfChamp, setverfChamp] = useState(false);

    const onVide = () => {
        setinfoRehFact({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_debut:'',date_fin:'', date_naiss: '', nom: '', pec: false })
    }

    const ajoutClient = (param) => {
        setinfoRehFact({ ...infoRehFact, nom_client: param });
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
                <h4 className='mb-1'>Recherche Facture non régler </h4>
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
            )
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
      onVide();
    }, [activeIndex])
    
    return (

        <div>
            <Button tooltip='Recherche' icon={PrimeIcons.SEARCH} value="chercher" label='Recherche' className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-4 md:col-5 col-8 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <div className="tabview-demo">
                            <div className="card">
                                <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index) }} >
                                    <TabPanel header="Recherche avec des critères"   >
                                        <div className='flex flex-column justify-content-center'>
                                            <div className='grid px-4'>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Numéro Facture</label>
                                                    <InputMask id="basic" value={infoRehFact.num_facture} mask='99/99/9999' name='num_facture' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Date facture</label>
                                                    <InputMask id="basic" value={infoRehFact.date_facture} mask='99/99/9999' name='date_facture' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>

                                            </div>
                                            <div className='grid px-4'>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Numéro d'arrivée</label>
                                                    <InputMask id="username2" value={infoRehFact.numero_arr} mask='999' aria-describedby="username2-help" name='numero_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Date d'arrivée </label>
                                                    <InputMask id="basic" value={infoRehFact.date_arr} mask='99/99/9999' name='date_arr' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                            </div>
                                            <div className='grid px-4'>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Nom du Patient</label>
                                                    <InputText id="username2" value={infoRehFact.nom_patient} aria-describedby="username2-help" name='nom_patient' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Nom client </label>
                                                    <div className='m-0 flex flex-row align-items-center'>
                                                        <InputText id="basic" readOnly value={infoRehFact.nom_client} name='nom_client' style={{ width: '100%' }} className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                        <ComponentChoixClient url={props.url} ajoutClient={ajoutClient} />
                                                    </div>
                                                </div>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">PEC </label>
                                                    <Checkbox id="basic" checked={infoRehFact.pec} name='pec' className={"form-input-css-tamby"} onChange={(e) => {
                                                        if (infoRehFact.pec) {
                                                            setinfoRehFact({ ...infoRehFact, pec: false })
                                                        } else {
                                                            setinfoRehFact({ ...infoRehFact, pec: true })
                                                        }
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel header="Recherche client entre deux date">
                                        <div className='flex flex-column justify-content-center'>
                                            <div className='grid px-4'>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Date début</label>
                                                    <InputMask id="basic" value={infoRehFact.date_debut} mask='99/99/9999' name='date_debut' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Date fin </label>
                                                    <InputMask id="basic" value={infoRehFact.date_fin} mask='99/99/9999' name='date_fin' className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                </div>
                                            </div>
                                            <div className='grid px-4'>
                                                <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                                                    <label htmlFor="username2" className="label-input-sm">Nom client </label>
                                                    <div className='m-0 flex flex-row align-items-center'>
                                                        <InputText id="basic" readOnly value={infoRehFact.nom_client} name='nom_client' style={{ width: '100%' }} className={"form-input-css-tamby"} onChange={(e) => { chDonneRech(e) }} />
                                                        <ComponentChoixClient url={props.url} ajoutClient={ajoutClient} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>

                        {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche - Code ou Nom </small></center> : null}
                        <div className='flex mt-3 mr-4 justify-content-center '>
                            <Button icon={PrimeIcons.SEARCH} className='p-button p-button-secondary ' label={'Reherche'} onClick={() => {
                                if (activeIndex===0 ) {
                                    if (infoRehFact.num_facture == "" && infoRehFact.pec == false && infoRehFact.date_facture == "" && infoRehFact.nom_patient == "" && infoRehFact.nom_client == "" && infoRehFact.numero_arr == "" && infoRehFact.date_arr == "") {
                                        alert('Entrez le(s) critère(s) de recherche ! ')
                                        return false;
                                    } else {
                                        RechercheloadData();
                                    }
                                }else{
                                    if (infoRehFact.date_debut == "" || infoRehFact.date_fin == "" || infoRehFact.nom_client == "" ) {
                                        alert('Critère incomplete ! ')
                                        return false;
                                    } else {
                                        RechercheloadData();
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

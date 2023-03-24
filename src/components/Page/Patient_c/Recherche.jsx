import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Recherche(props) {

    const controleChampDate = (dt) => {
        // let splitDt=(dt).split('/');
        // if (splitDt[0]<=31 && splitDt[1]<=12) {
            RechercheloadData()
        // }else{
        //     alert('Verifier la date de naissance !');
        // }
    }

    //Declaration useSatate
    const [infoPatient, setinfoPatient] = useState({  nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });

    const [verfChamp, setverfChamp] = useState({  nom: false, prenom: false, type: false, sexe: false, date_naiss: false, telephone: false, adresse: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoPatient({  nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    }


    const [selectsexe, setselectsexe] = useState(null);
    const [selecttype, setselecttype] = useState(null);

    const onSexeChange = (e) => {
        setselectsexe(e.value);
        setinfoPatient({ ...infoPatient, [e.target.name]: (e.target.value) });
    }
    const onTypesChange = (e) => {
        setselecttype(e.value);
        setinfoPatient({ ...infoPatient, [e.target.name]: (e.target.value) });
    }
    const onInfoPatient = (e) => {
        setinfoPatient({ ...infoPatient, [e.target.name]: e.target.value })
    }


    const choixType = [
        { label: 'E', value: 'E' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
    ]
    const choixSexe = [
        { label: 'Homme', value: 'M' },
        { label: 'Femme', value: 'F' },

    ]

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
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
        setverfChamp({ code_client: false, nom: false });
        setselectsexe(null)
        setselecttype(null)
        onVideInfo()
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    /** Fin modal */

    const controleChampVide = () => {

        if (infoPatient.date_naiss == "" && infoPatient.nom=="" && infoPatient.prenom==""  ) {
            setverfChamp({ ...verfChamp, date_naiss: true,nom:true,prenom:true })
        }
       else{
           setverfChamp({   date_naiss: false,nom:false,prenom:false  });

           controleChampDate(infoPatient.date_naiss)
       }
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



  
    //Recherche List client
    const RechercheloadData = async () => {
        props.setCharge(true);
        props.setlistPatient([{ stat: 'Chargement de données...' }])
        axios.post(props.url + 'recherchePatient', infoPatient)
           .then(
                (result) => {
                    props.setinfoPatient(infoPatient);
                    props.setrefreshData(0);
                    props.setlistPatient(result.data);
                    props.setCharge(false);
                    onHide('displayBasic2');
                }
            );
    }
    return (
        <div>

            <Button  tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '35vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                <form className='flex flex-column justify-content-center'>
                          
                            <div className='grid px-4'>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom</label>
                                    <InputText id="username2" value={infoPatient.nom} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={onInfoPatient} />
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Prenom(s)</label>
                                    <InputText id="username2" value={infoPatient.prenom} aria-describedby="username2-help" className="form-input-css-tamby" name='prenom' onChange={onInfoPatient} />
                                </div>
                                {/* <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Type</label>
                                    <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="type" className={"form-input-css-tamby"} placeholder="choisir type" />
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Sexe</label>
                                    <Dropdown value={selectsexe} options={choixSexe} onChange={onSexeChange} name="sexe" className={"form-input-css-tamby"} placeholder="choisir sexe" />
                                </div> */}
                            </div>
                            <div className='grid px-4'>
                                <div className="col-12 field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date de naissance</label>
                                    <InputMask id="basic" value={infoPatient.date_naiss}  mask='99/99/9999'  onChange={(e) => {setinfoPatient({ ...infoPatient, date_naiss: e.value});}}  />
                                <small>format: jj/mm/aaaa</small>
                                </div>
                                {/* <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Telephone</label>
                                    <InputMask mask='099 99 999 99' name='telephone' onChange={onInfoPatient} className={"form-input-css-tamby"} />
                                </div>
                                <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Adresse</label>
                                    <InputText id="username2" value={infoPatient.adresse} aria-describedby="username2-help" className={"form-input-css-tamby"} name='adresse' onChange={onInfoPatient} />
                                </div> */}
                            </div>
                        </form>
                  {verfChamp.date_naiss && verfChamp.nom && verfChamp.prenom ? <center><label id="username2-help" className="p-error block justify-content-center" style={{fontWeight:'bold'}}>Vérifier la critère pour la recherche( Minimun de critére) </label></center>  : null} 
                    <div className='flex mt-3 mr-4 justify-content-end '>
                        <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {
                           controleChampVide()
                        }} />

                    </div>
                </div>
            </Dialog>
        </div>
    )
}

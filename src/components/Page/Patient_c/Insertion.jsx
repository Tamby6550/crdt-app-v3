import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Insertion(props) {

    const controleChampDate = (dt) => {
        let splitDt = (dt).split('/');
        if (splitDt[0] <= 31 && splitDt[1] <= 12) {
            onSub()
        } else {
            alert('Verifier la date de naissance !');
        }
    }

    //Declaration useSatate
    const [infoPatient, setinfoPatient] = useState({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });

    const [verfChamp, setverfChamp] = useState({ id_patient: false, nom: false, prenom: false, type: false, sexe: false, date_naiss: false, telephone: false, adresse: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoPatient({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    }
    const idPatient = (totalenrg) => {
        setinfoPatient({ ...infoPatient, id_patient: totalenrg });
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
                <h4 className='mb-1'>Nouveau Patient </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const controleChampVide = () => {

        // if (infoPatient.adresse == "") {
        //     setverfChamp({ ...verfChamp, adresse: true })
        // }
        // if (infoPatient.telephone == "") {
        //     setverfChamp({ ...verfChamp, telephone: true })
        // }
        if (infoPatient.date_naiss == "") {
            setverfChamp({ ...verfChamp, date_naiss: true })
        }
        if (infoPatient.sexe == "") {
            setverfChamp({ ...verfChamp, sexe: true })
        }
        if (infoPatient.type == "") {
            setverfChamp({ ...verfChamp, type: true })
        }
        //Mety tsy hisy prenom
        // if (infoPatient.prenom == "") {
        //     setverfChamp({ ...verfChamp, prenom: true })
        // }
        if (infoPatient.nom == "") {
            setverfChamp({ ...verfChamp, nom: true })
        }


        if (infoPatient.nom != "" && infoPatient.type != "" && infoPatient.sexe != "" && infoPatient.date_naiss != "") {
          
            setverfChamp({ id_patient: false, nom: false, prenom: false, type: false, sexe: false, date_naiss: false, telephone: false, adresse: false });
            controleChampDate(infoPatient.date_naiss)
        }

    }

    const onSub = async () => { //Ajout de donnees vers Laravel
        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertPatient', infoPatient)
            .then(res => {
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onVideInfo()
                    onHide('displayBasic2');
                }, 900)
                // console.log(res.data.message)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }
    return (
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau' tooltipOptions={{ position: 'top' }} label='Nouveau' className='mr-2 p-button-primary' onClick={() => { onClick('displayBasic2'); idPatient(props.totalenrg) }} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="lg:col-3  field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">N° Id</label>
                                    <InputText id="username2" value={infoPatient.id_patient} readOnly aria-describedby="username2-help" name='id_patient' className={"form-input-css-tamby"} />
                                </div>
                            </div>

                            <div className='grid px-4'>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom*</label>
                                    <InputText id="username2" value={infoPatient.nom} aria-describedby="username2-help" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='nom' onChange={onInfoPatient} />
                                    {verfChamp.nom ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Prenom(s)</label>
                                    <InputText id="username2" value={infoPatient.prenom} aria-describedby="username2-help" className="form-input-css-tamby" name='prenom' onChange={onInfoPatient} />
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Tarif*</label>
                                    <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="type" className={verfChamp.type ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder="choisir type" />
                                    {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Sexe*</label>
                                    <Dropdown value={selectsexe} options={choixSexe} onChange={onSexeChange} name="sexe" className={verfChamp.sexe ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder="choisir sexe" />
                                    {verfChamp.sexe ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="col-12 field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Date de naissance*</label>
                                    <InputMask id="basic" value={infoPatient.date_naiss} mask='99/99/9999' onChange={(e) => { setinfoPatient({ ...infoPatient, date_naiss: e.value }); }} className={verfChamp.date_naiss ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.date_naiss ? <small id="username2-help" className="p-error block">Champ vide !</small> : <small>format: jj/mm/aaaa</small>}
                                </div>
                                <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Telephone</label>
                                    <InputMask mask='099 99 999 99' name='telephone' onChange={onInfoPatient} className={verfChamp.telephone ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.telephone ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Adresse</label>
                                    <InputText id="username2" value={infoPatient.adresse} aria-describedby="username2-help" className={verfChamp.adresse ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='adresse' onChange={onInfoPatient} />
                                    {verfChamp.adresse ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>


                        </form>
                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                controleChampVide()
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

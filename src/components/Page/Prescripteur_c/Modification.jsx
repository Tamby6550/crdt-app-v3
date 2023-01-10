import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';


export default function Modification(props) {

    //Declaration useSatate
    const [infoClient, setinfoClient] = useState({ code_presc: '', nom: '', titre: '', phone1: '', phone2: '', mobile: '', adresse: '' });
    const [verfChamp, setverfChamp] = useState({ code_presc: false, nom: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const oncharger = (data) => {
        setinfoClient({ code_presc: data.code_presc, titre: (data.nom).slice(0, 2), nom: (data.nom).slice(3), phone1: data.phone1, phone2: data.phone2, mobile: data.mobile, adresse: data.adresse });
    }
    const onVideInfo = () => {
        setinfoClient({ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '' });
    }

    const onInfoClient = (e) => {
        setinfoClient({ ...infoClient, [e.target.name]: (e.target.value) })
    }
    //Appelation
    const [selectAppelation, setselectAppelation] = useState(null);
    const [defautValeur, setdefautValeur] = useState(null)
    const onAppelationChange = (e) => {
        setselectAppelation(e.value);
        setinfoClient({ ...infoClient, [e.target.name]: (e.target.value) });
    }
    const choixPresc = [
        { label: 'Pr', value: 'Pr' },
        { label: 'Dr', value: 'Dr' }
    ]


    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
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
                <h4 className='mb-1'>Modification  Prescripteur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const onSub = async () => { //Ajout de donnees vers Laravel
        setverfChamp({ code_presc: false, nom: false })
        setcharge({ chajoute: true });
        await axios.put(props.url + 'modifierPrescripteur', infoClient)
            .then(res => {
                notificationAction(res.data.etat, 'Modification', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(()=>{
                    props.setrefreshData(1);
                    onVideInfo()
                    onHide('displayBasic2');
                },900)
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
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 ' style={stylebtnRec} tooltip='Modifier' tooltipOptions={{position: 'top'}}
                onClick={() => {
                    onClick('displayBasic2');
                    oncharger(props.data);
                    setdefautValeur((props.data.nom).slice(0, 2))
                }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '40vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <form className='flex flex-column justify-content-center'>
                        <div className='grid px-4'>
                            <div className="lg:col-3  field my-0  flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Code</label>
                                <InputText id="username2" value={infoClient.code_presc} aria-describedby="username2-help" name='code_presc' className={verfChamp.code_presc ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} readOnly />
                                {verfChamp.code_presc ? <small id="username2-help" className="p-error block">Id patient vide !</small> : null}
                            </div>
                        </div>

                        <div className='grid px-4'>
                            <div className="lg:col-2 md:col-3 col-3 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Appelation</label>
                                <Dropdown value={selectAppelation} options={choixPresc} onChange={onAppelationChange} name="titre" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={infoClient.titre} />
                            </div>
                            <div className="lg:col-10 md:col-9 col-9 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nom*</label>
                                <InputText id="username2" value={infoClient.nom} aria-describedby="username2-help" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='nom' onChange={onInfoClient} />
                            </div>
                        </div>
                        <div className='grid px-4'>
                            <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                <label htmlFor="username2" className="label-input-sm">Phone 1</label>
                                <InputNumber inputId="withoutgrouping" value={infoClient.phone1} name="phone1" onValueChange={onInfoClient} mode="decimal" useGrouping={false} />
                            </div>
                            <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                <label htmlFor="username2" className="label-input-sm">Phone 2</label>
                                <InputNumber inputId="withoutgrouping" value={infoClient.phone2} name="phone2" onValueChange={onInfoClient} mode="decimal" useGrouping={false} />
                            </div>
                            <div className="col-12 lg:col-6 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Mobile</label>
                                <InputMask mask='099 99 999 99' name='mobile' value={infoClient.mobile} onChange={onInfoClient} className="form-input-css-tamby" />
                            </div>
                            <div className="col-12 lg:col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Adresse</label>
                                <InputText id="username2" value={infoClient.adresse} name="adresse" aria-describedby="username2-help" className="form-input-css-tamby" onChange={onInfoClient} />
                            </div>
                        </div>
                    </form>
                    <div className='flex mt-3 mr-4 justify-content-end'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' label={charge.chajoute ? 'Modification...' : 'Modifier'} onClick={() => {
                            infoClient.code_presc != "" ?
                                infoClient.nom != "" ?
                                    onSub()
                                    :
                                    setverfChamp({ code_presc: false, nom: true })
                                :
                                setverfChamp({ code_presc: true, nom: false })
                        }} />
                    </div>
                </div>
            </Dialog>
        </>
    )
}

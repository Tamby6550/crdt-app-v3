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
import { InputNumber } from 'primereact/inputnumber';

export default function Modification(props) {

    //Declaration useSatate
    const [infoExamen, setinfoexamen] = useState({ id_examen: '', lib: '', code_tarif: '', type: '', montant: 0, tarif: '' });
    const [verfChamp, setverfChamp] = useState({ code_client: false, nom: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const oncharger = (data) => {
        setinfoexamen({ id_examen: data.id_examen, lib: data.lib, code_tarif: data.code_tarif, type: data.types, montant: data.montant, tarif: data.tarif });
    }
    const onVideInfo = () => {
        setinfoexamen({ id_examen: '', lib: '', code_tarif: '', type: '', montant: '', tarif: '' });
    }

    const [selecttarif, setselecttarif] = useState(null);
    const [selecttype, setselecttype] = useState(null);

    const onTarifChange = (e) => {
        setselecttarif(e.value);
        setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value) });
    }
    const onTypesChange = (e) => {
        setselecttype(e.value);
        setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value) });
    }
    const onInfoExaman = (e) => {
        setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value) })
    }


    const choixType = [
        { label: 'ECHOGRAPHIE', value: 'ECHOGRAPHIE' },
        { label: 'MAMMOGRAPHIE', value: 'MAMMOGRAPHIE' },
        { label: 'PANNORAMIQUE DENTAIRE', value: 'PANNORAMIQUE DENTAIRE' },
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

    const controleChampVide = () => {
        if (infoExamen.montant == "") {
            setverfChamp({ ...verfChamp, montant: true })
        }

        if (infoExamen.tarif == "") {
            setverfChamp({ ...verfChamp, tarif: true })
        }

        if (infoExamen.type == "") {
            setverfChamp({ ...verfChamp, type: true })
        }

        if (infoExamen.code_tarif == "") {
            setverfChamp({ ...verfChamp, code_tarif: true })
        }

        if (infoExamen.lib == "") {
            setverfChamp({ ...verfChamp, lib: true })
        }


        if (infoExamen.lib != "" && infoExamen.code_tarif != "" && infoExamen.type != "" && infoExamen.tarif != "" && infoExamen.montant != "") {
            setverfChamp({ id_exam: false, lib: false, code_tarif: false, type: false, montant: false, tarif: false });
            onSub()
        }

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
        setverfChamp({ id_exam: false, lib: false, code_tarif: false, type: false, montant: false, tarif: false });
        onVideInfo();
        setselecttype(null);
        setselecttarif(null);
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
                <h4 className='mb-1'>Modification  Examen </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    const onSub = async () => { //Ajout de donnees vers Laravel
        // console.log(infoExamen);
        setcharge({ chajoute: true });
        await axios.put(props.url + 'updateExamen', infoExamen)
            .then(res => {
                notificationAction(res.data.etat, 'Modification', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onVideInfo()
                    onHide('displayBasic2');
                }, 900)
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
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 ' style={stylebtnRec} tooltipOptions={{position: 'top'}} tooltip='Modifier' onClick={() => { onClick('displayBasic2'); oncharger(props.data) }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '40vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <form className='flex flex-column justify-content-center'>

                        <div className='grid px-4'>
                            <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Libellé</label>
                                <InputText id="username2" value={infoExamen.lib} aria-describedby="username2-help" className={verfChamp.lib ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='lib' onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                {verfChamp.lib ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Cotation</label>
                                <InputText id="username2" value={infoExamen.code_tarif} aria-describedby="username2-help" className={verfChamp.code_tarif ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='code_tarif' onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                {verfChamp.code_tarif ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Type</label>
                                <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="type" className={verfChamp.type ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={infoExamen.type} />
                                {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Tarif</label>
                                <Dropdown value={selecttarif} options={choixTarif} onChange={onTarifChange} name="tarif" className={verfChamp.tarif ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={infoExamen.tarif} />
                                {verfChamp.tarif ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="lg:col-8 col-12 field my-0 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Montant (Ar)</label>

                                <InputText value={infoExamen.montant} name="montant" onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: parseInt(e.target.value) + 0 }) }} className={verfChamp.montant ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                {verfChamp.montant ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                        </div>

                    </form>
                    <div className='flex mt-3 mr-4 justify-content-end'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' label={charge.chajoute ? 'Modification...' : 'Modifier'} onClick={() => {
                            controleChampVide()
                        }} />
                    </div>
                </div>
            </Dialog>
        </>
    )
}

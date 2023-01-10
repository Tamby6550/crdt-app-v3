import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
export default function Insertion(props) {

    //Declaration useSatate
    const [infoExamen, setinfoexamen] = useState({ id_exam: '',id_exam1: '',id_exam2: '', lib: '', code_tarif: '', type: '',  tarif_e:'E',tarif_l1:'L1',tarif_l2:'L2',montant_e:'',montant_l1:'',montant_l2 :''});
    const [verfChamp, setverfChamp] = useState({ id_exam: false, lib: false, code_tarif: false,  montant_e:false,montant_l1:false,montant_l2 :false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoexamen({ id_exam: '', lib: '', code_tarif: '', type: '',  tarif_e:'E',tarif_l1:'L1',tarif_l2:'L2',montant_e:'',montant_l1:'',montant_l2:''  });
    }


    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
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

    const idExamen = (totalenrg) => {
        let id1 =parseInt(totalenrg)+1;
        let id2 =parseInt(totalenrg)+2;
        setinfoexamen({ ...infoExamen, id_exam: totalenrg ,id_exam1: id1 ,id_exam2: id2  });
    }
    const controleChampVide = () => {
        if (!Number.isInteger(infoExamen.montant_e)) {
            setverfChamp({ ...verfChamp, montant_e: true })
        }
        if (!Number.isInteger(infoExamen.montant_l1)) {
            setverfChamp({ ...verfChamp, montant_l1: true })
        }
        if (!Number.isInteger(infoExamen.montant_l2)) {
            setverfChamp({ ...verfChamp, montant_l2: true })
        }

        // if (infoExamen.tarif == "") {
        //     setverfChamp({ ...verfChamp, tarif: true })
        // }

        if (infoExamen.type == "") {
            setverfChamp({ ...verfChamp, type: true })
        }

        if (infoExamen.code_tarif == "") {
            setverfChamp({ ...verfChamp, code_tarif: true })
        }

        if (infoExamen.lib == "") {
            setverfChamp({ ...verfChamp, lib: true })
        }


        if (infoExamen.lib != "" && infoExamen.code_tarif != "" && infoExamen.type != "" &&  Number.isInteger(infoExamen.montant_e) &&  Number.isInteger(infoExamen.montant_l1) &&  Number.isInteger(infoExamen.montant_l2)) {
            setverfChamp({id_exam: false, lib: false, code_tarif: false,  montant_e:false,montant_l1:false,montant_l2 :false});
            onSub()
        }

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
                <h4 className='mb-1'>Nouveau Examen </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */




    const onSub = async () => { //Ajout de donnees vers Laravel

        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertExamen', infoExamen)
            .then(res => {
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
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
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau' label='Nouveau' tooltipOptions={{position: 'top'}} className='mr-2 p-button-primary' onClick={() => { onClick('displayBasic2'); idExamen(props.totalenrg) }} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-9 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
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
                                    <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="type" className={verfChamp.type ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Tarif E</label>
                                    <InputText id="username2" value={infoExamen.tarif_e} name="tarif_e" aria-describedby="username2-help" className={"form-input-css-tamby"} readOnly onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                </div>
                                <div className="lg:col-8 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Montant (Ar)-Tarif E*</label>
                                    <InputNumber inputId="withoutgrouping" value={infoExamen.montant_e} name="montant_e" onValueChange={onInfoExaman} mode="decimal" useGrouping={false} className={verfChamp.montant_e ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.montant_e ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Tarif L1</label>
                                    <InputText id="username2" value={infoExamen.tarif_l1} name="tarif_l1" aria-describedby="username2-help" className={"form-input-css-tamby"} readOnly onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                </div>
                                <div className="lg:col-8 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Montant (Ar)-Tarif L1*</label>
                                    <InputNumber inputId="withoutgrouping" value={infoExamen.montant_l1} name="montant_l1" onValueChange={onInfoExaman} mode="decimal" useGrouping={false} className={verfChamp.montant_l1 ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.montant_l1 ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Tarif L2</label>
                                    <InputText id="username2" value={infoExamen.tarif_l2} name="tarif_l2" aria-describedby="username2-help" className={"form-input-css-tamby"} readOnly onChange={(e) => { setinfoexamen({ ...infoExamen, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                </div>
                                <div className="lg:col-8 col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Montant (Ar)-Tarif L2*</label>
                                    <InputNumber inputId="withoutgrouping" value={infoExamen.montant_l2} name="montant_l2" onValueChange={onInfoExaman} mode="decimal" useGrouping={false} className={verfChamp.montant_l2 ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.montant_l2 ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
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

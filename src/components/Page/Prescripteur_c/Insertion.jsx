import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
export default function Insertion(props) {

    //Declaration useSatate
    const [infoClient, setinfoClient] = useState({ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '',titre:'' });
    const [verfChamp, setverfChamp] = useState({ code_presc: false, nom: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoClient({ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '' });
    }
    const [selectAppelation, setselectAppelation] = useState(null);


    const onAppelationChange = (e) => {
        setselectAppelation(e.value);
        setinfoClient({ ...infoClient, [e.target.name]: (e.target.value) });
    }
    const onInfoClient = (e) => {
        setinfoClient({ ...infoClient, [e.target.name]: (e.target.value) })
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
        setverfChamp({ code_presc: false, nom: false });
        onVideInfo();
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
                <h4 className='mb-1'>Nouveau Prescripteur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const onSub = async () => { //Ajout de donnees vers Laravel
        setverfChamp({ code_presc: false, nom: false })
        setcharge({ chajoute: true });
        try {
            await axios.post(props.url + 'insertPrescripteur', infoClient)
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
        } catch (error) {
            console.log(error)
        }
        
    }
    return (
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau' tooltipOptions={{position: 'top'}} label='Nouveau' className='mr-2 p-button-primary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="lg:col-3  field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Code*</label>
                                    <InputText id="username2" value={infoClient.code_presc} aria-describedby="username2-help" name='code_presc' className={verfChamp.code_presc ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={onInfoClient} />
                                    {verfChamp.code_presc ? <small id="username2-help" className="p-error block">champ vide !</small> : null}
                                </div>
                            </div>

                            <div className='grid px-4'>
                                <div className="lg:col-2 md:col-3 col-3 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Appelation</label>
                                    <Dropdown value={selectAppelation} options={choixPresc} onChange={onAppelationChange} name="titre" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.nom ? <small id="username2-help" className="p-error block">champ vide !</small> : null}
                                </div>
                                <div className="lg:col-10 md:col-9 col-9 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom*</label>
                                    <InputText id="username2" value={infoClient.nom} aria-describedby="username2-help" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='nom' onChange={onInfoClient} />
                                    {verfChamp.nom ? <small id="username2-help" className="p-error block">champ vide !</small> : null}
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
                                    <InputMask mask='099 99 999 99' name='mobile' onChange={onInfoClient} className="form-input-css-tamby" />
                                </div>
                                <div className="col-12 lg:col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Adresse</label>
                                    <InputText id="username2" value={infoClient.adresse} name="adresse" aria-describedby="username2-help" className="form-input-css-tamby" onChange={onInfoClient} />
                                </div>
                            </div>
                        </form>
                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                infoClient.code_presc != "" ?
                                    infoClient.nom != "" && infoClient.titre ?
                                        onSub()
                                        :
                                        setverfChamp({ code_presc: false, nom: true })
                                    :
                                    setverfChamp({ code_presc: true, nom: false })
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

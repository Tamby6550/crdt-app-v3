import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
export default function Insertion(props) {

    //Declaration useSatate
    const [infoClient, setinfoClient] = useState({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
    const [verfChamp, setverfChamp] = useState({ code_client: false, nom: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoClient({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
    }


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
                <h4 className='mb-1'>Nouveau Client </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    const onSub = async () => { //Ajout de donnees vers Laravel
        setverfChamp({ code_client: false, nom: false })
        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertClient', infoClient)
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


            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau'  tooltipOptions={{ position: 'top' }} label='Nouveau' className=' mr-2 p-button-primary' onClick={() => onClick('displayBasic2')} />
            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Code Client*</label>
                                    <InputText id="username2" value={infoClient.code_client} aria-describedby="username2-help" name='code_client' className={verfChamp.code_client ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} />
                                    {verfChamp.code_client ? <small id="username2-help" className="p-error block">Code client vide !</small> : null}
                                </div>
                            </div>
                            <div className="field my-1 flex flex-column px-4">
                                <label htmlFor="username2" className="label-input-sm">Nom*</label>
                                <InputText id="username2" value={infoClient.nom} aria-describedby="username2-help" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='nom' onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: (e.target.value).toUpperCase() }) }} />
                                {verfChamp.nom ? <small id="username2-help" className="p-error block">Nom vide !</small> : null}
                            </div>

                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">RC</label>
                                    <InputText id="username2" value={infoClient.rc} aria-describedby="username2-help" className="form-input-css-tamby" name='rc' onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">STAT</label>
                                    <InputText id="username2" value={infoClient.stat} aria-describedby="username2-help" className="form-input-css-tamby" name='stat' onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} />
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">CIF</label>
                                    <InputText id="username2" value={infoClient.cif} aria-describedby="username2-help" className="form-input-css-tamby" name='cif' onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} />
                                </div>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">NIF</label>
                                    <InputText id="username2" value={infoClient.nif} aria-describedby="username2-help" className="form-input-css-tamby" name='nif' onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} />
                                </div>
                            </div>
                            <div className="field my-1 flex flex-column px-4">
                                <label htmlFor="username2" className="label-input-sm">Decription</label>
                                <InputTextarea rows={2} cols={28} value={infoClient.description} onChange={(e) => { setinfoClient({ ...infoClient, [e.target.name]: e.target.value }) }} autoResize name='description' />
                            </div>

                        </form>
                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                infoClient.code_client != "" ?
                                    infoClient.nom != "" ?
                                        onSub()
                                        :
                                        setverfChamp({ code_client: false, nom: true })
                                    :
                                    setverfChamp({ code_client: true, nom: false })
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toastTR} position="top-right" />
        </div>
    )
}

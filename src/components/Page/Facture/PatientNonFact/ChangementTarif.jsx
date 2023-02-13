import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
/*Importer modal */
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

export default function ChangementTarif(props) {

    const [infoNecess, setinfoNecess] = useState({ donne: [null], num_arriv: '', date_arriv: '', tarif: '', id_patient: '' });
    const [verfChamp, setverfChamp] = useState(false);
    const [selecttype, setselecttype] = useState(null);
    const [charge, setcharge] = useState(false)
    const onChargerData = (donne, id_patient) => {
        setinfoNecess({ donne: donne, num_arriv: props.num_arriv, date_arriv: props.date_arriv, tarif: '', id_patient: id_patient })
    }

    const onVide = () => {
        setinfoNecess({ donne: [null], num_arriv: '', date_arriv: '', tarif: '', id_patient: '' })
    }
    const choixType = [
        { label: 'E', value: 'E' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
    ];
    const onTypesChange = (e) => {
        setselecttype(e.value);
        setinfoNecess({ ...infoNecess, [e.target.name]: (e.target.value) });
    }

    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
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
        onVide()
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
                <h4 className='mb-1'>Changement du Tarif </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */





    const onUpdateTarif = async () => {
        let dt = (infoNecess.date_arriv).split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        setcharge(true)

        await axios.put(props.url + 'changmentTarif', infoNecess)
            .then(
                (res) => {
                    //message avy @back
                    notificationAction(res.data.etat, 'Tarif ', res.data.message);
                    props.setinfoFacture({ ...props.infoFacture, type: infoNecess.tarif,pec: '', remise: '',  });
                    props.settarifCh(infoNecess.tarif)
                    props.loadData();
                    setcharge(false)
                    onHide('displayBasic2');
                }
            ).catch((erro) => {
                console.log(erro);
            })
    }

    const confirmeTarif = () => {
        return (
            <div style={{fontSize:'1.2em'}}>
                <label className='m-2'> <strong className='m-1'>Voulez vous modifier le tarif ?</strong> </label> 
                
            </div>
        );
    }
    return (
        <>
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1  p-button-warning ' tooltip='Modifier le Tarif' tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    const accept = () => {
                        onClick('displayBasic2');
                        onChargerData(props.examen, props.id_patient)
                    }
                    const reject = () => {
                        return null;
                    }
                    confirmDialog({
                        message: confirmeTarif,
                        header: '',
                        icon: 'pi pi-exclamation-circle',
                        acceptClassName: 'p-button-info',
                        acceptLabel: 'Ok , Changer',
                        rejectLabel: 'Fermer',
                        accept,
                        reject,
                    
                    });

                }} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-3 md:col-5 col-8 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <div className="lg:col-12 col-12 field my-0 flex flex-column">
                            <label htmlFor="username2" className="label-input-sm">Changement de Tarif</label>
                            <Dropdown value={selecttype} options={choixType} onChange={onTypesChange} name="tarif" className={verfChamp ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={props.ancientarif} />
                            {verfChamp ? <small id="username2-help" className="p-error block">Choisir un autre tarif !</small> : null}
                        </div>
                        <div className='flex mt-3 mr-4 justify-content-center '>
                            <Button icon={PrimeIcons.PENCIL} className='p-button-sm p-button-secondary ' label={charge ? 'Veuillez attendez....' : 'Modifier'} onClick={() => {
                                if (infoNecess.tarif == props.ancientarif || infoNecess.tarif == "") {
                                    setverfChamp(true)
                                }
                                else {

                                    setverfChamp(false);
                                    onUpdateTarif();
                                }
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toastTR} position="top-center" />
        </>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import moment from 'moment/moment';
import ChangementTarif from '../PatientNonFact/ChangementTarif';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import ChoixClient from '../PatientNonFact/ChoixClient'
import ChoixPrescr from '../PatientNonFact/ChoixPrescr';
import ReactToPrint from 'react-to-print'
import ChoixReglement from '../PatientNonFact/ChoixReglement';
import { RadioButton } from 'primereact/radiobutton';
import FormatF from '../FormatF';

export default function Modifier(props) {

    const [charge, setCharge] = useState(false);
    const { format } = FormatF();
    const [typePC, settypePC] = useState({ pat: false, cli: false })
    const [dataReglement, setdataReglement] = useState({
        num_facture: '',
        reglement_id: '0',
        nomreglement: '',
        type_reglmnt: '',
        montantreglement: '0',
        rib: null,
        num_arriv: '',
        date_arriv: '',
        date_reglmnt:''
    })

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }

    const chargeDataReglement = () => {

        if (props.data.type_rglmt=='P') {
            settypePC({ pat: true, cli: false });
        }else{
            settypePC({ pat: false, cli: true });
        }
        
        setdataReglement({
            num_facture: props.data.num_fact,
            num_arriv: props.num_arriv,
            date_arriv: props.date_arriv,
            reglement_id: props.data.regl_id,
            nomreglement: props.data.reglement,
            type_reglmnt: props.data.type_rglmt,
            montantreglement: props.data.montant,
            rib: props.data.rib,
            date_reglmnt: props.data.date_reglement
        });
    }

    const bddialogReglement = (msg) => {
        return (
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <h4> {msg} </h4>
            </div>
        )
    }
    const bodyConfirme = () => {
        return (
            <div>
                <label className='m-2'>Reglement fait par : <strong className='m-1'>{dataReglement.type_reglmnt == 'P' ? 'Patient' : 'Client'}</strong> </label> <hr />
                <label className='m-2'>Type règlement : <strong className='m-1'>{dataReglement.nomreglement}</strong> </label> <hr />
                <label className='m-2'>Montant : <strong className='m-1'>{format(dataReglement.montantreglement, 0, " ")} Ar </strong> </label><hr />
                <label className='m-2'>RIB : <strong className='m-1'>{dataReglement.rib == '' ? '-' : dataReglement.rib}</strong> </label>
            </div>
        );
    }

    const onVerfeCh = () => {
        if ((typePC.cli == false && typePC.pat == false) || dataReglement.type_reglmnt == '') {
            confirmDialog({
                message: bddialogReglement('Réglement fait par qui ?'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        }
        else if (dataReglement.reglement_id == '0' || dataReglement.nomreglement == '') {
            confirmDialog({
                message: bddialogReglement('Veuillez choisir le type de réglement'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        }
        else if ((parseInt(dataReglement.montantreglement) + 0) == 0 || dataReglement.montantreglement == '') {
            confirmDialog({
                message: bddialogReglement('Veuillez entrer le montant de réglement'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        } else {
            const accept = () => {
                onModifReglement();
            }
            const reject = () => {
                // onVideReglement();
                return null;
            }
            confirmDialog({
                message: bodyConfirme,
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-success',
                acceptLabel: 'Ok, modifier',
                rejectLabel: 'Annuler',
                accept,
                reject
            });

        }

    }

    const montantReglementVerf = (e) => {
        if (!/^\d*$/.test(e.target.value)) {
            e.preventDefault();
            return;
        }
    
        setdataReglement({ ...dataReglement, montantreglement: e.target.value });
    };
    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('top');
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
                <>
                    <h4 className='mb-1'>Modifier reglement, Date règlement : {dataReglement.date_reglmnt} </h4>
                </>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const onModifReglement = async () => {

        setCharge(true);
        await axios.put(props.url + 'modifReglementFacture', dataReglement)
            .then(res => {
                //message avy @back

                notificationAction(res.data.etat, 'Règlement ', res.data.message);
                setCharge(false);
                setTimeout(() => {
                    props.chargementData();
                    onHide('displayBasic2');
                }, 400)
                
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setCharge(false);
            });
    }
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltip='Modifier' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargeDataReglement()}} />

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className="lg:col-4 md:col-5 sm:col-8 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <div className="field  col-12 ">

                    <Fieldset  style={{ backgroundColor: 'rgb(247 247 247)' }} >
                        <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column p-0 m-0">

                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-row   align-items-center">
                                <label htmlFor="username2" className="label-input-sm">Réglement fait par :</label>
                                <div className='m-1 flex flex-row align-items-center mb-3 ml-5'>
                                    <div className='m-0 align-items-center'>
                                        <label htmlFor="">Patient</label>
                                        <RadioButton checked={typePC.pat} name='a' className='ml-2'
                                            onChange={() => {
                                                settypePC({ pat: true, cli: false });
                                                setdataReglement({ ...dataReglement, type_reglmnt: 'P' });
                                            }} readOnly
                                        />
                                    </div>
                                    <div className='m-0 ml-5 align-items-center'>
                                        <label htmlFor="">Client</label>
                                        <RadioButton checked={typePC.cli} name='a' className='ml-2'
                                            onChange={() => {
                                                settypePC({ pat: false, cli: true });
                                                setdataReglement({ ...dataReglement, type_reglmnt: 'C'});
                                            }} readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-column  ">
                                <hr className='m-0 mb-1 p-0' />
                                <label htmlFor="username2" className="label-input-sm">Type Reglement : </label>
                                <div className='m-1 flex flex-row align-items-center '>
                                    <InputText id="username2" style={{ height: '25px' }} aria-describedby="username2-help" name='code_cli' value={dataReglement.nomreglement} readOnly />
                                    <ChoixReglement url={props.url} reglement='ok' dataReglement={dataReglement} setdataReglement={setdataReglement} />
                                </div>
                            </div>

                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-column ">
                                <label htmlFor="username2" className="label-input-sm">Montant : </label>
                                <InputText id="username2" aria-describedby="username2-help" name='montantreglement' style={{ height: '25px',backgroundColor: '#ebebeb' }} value={dataReglement.montantreglement}
                                    onChange={(e) => { montantReglementVerf(e) }} readOnly
                                />
                            </div>
                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm mr-2">N° Chèque	: </label>
                                <InputText id="username2" aria-describedby="username2-help" style={{ height: '25px' }} name='rib' value={dataReglement.rib} onChange={(e) => { setdataReglement({ ...dataReglement, rib: (e.target.value).toUpperCase() }) }} />
                            </div>
                        </div>
                        <div className='flex mt-3 mr-4 justify-content-center '>

                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' tooltip="Modifier reglement " tooltipOptions={{ position: 'top' }} style={{ cursor: 'pointer' }} label={charge ? '...' : 'Modifier'}
                                onClick={() => {
                                    onVerfeCh()
                                }} />

                        </div>
                    </Fieldset>
                </div>
            </Dialog >
        </>
    )
}

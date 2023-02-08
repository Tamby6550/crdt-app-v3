import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import CompteRendu from './CompteRendu';
import { Tag } from 'primereact/tag';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Voir(props) {


    /*Sidebar FullScreen */

    /*Sidebar FullScreen */

    //Declaration useSatate
    //Chargement de données
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [charge, setCharge] = useState(false);
    const [infoexamenPatient, setinfoexamenPatient] = useState([{ lib_examen: '', code_tarif: '', quantite: '', montant: '', date_examen: '', type: '' }]);
    const [verfCompteRendu, setverfCompteRendu] = useState(false);
    const [infoExamenVal, setinfoExamenVal] = useState({ num_arriv: '', date_arriv: '' , verfexamen:'2'})
    //Get List Examen
    const loadData = async (numero, datearr) => {
        await axios.get(props.url + `getPatientExamenEff/${numero}&${datearr}`)
            .then(
                (result) => {
                    setinfoexamenPatient(result.data.liste);
                    setverfCompteRendu(result.data.verf)
                    setCharge(false);
                }
            );
    }

    const chargementData = () => {
        setinfoExamenVal({ num_arriv: props.data.numero, date_arriv: props.data.date_arr,verfexamen:'2' })
        setCharge(true);
        let dt = (props.data.date_arr).split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        setinfoexamenPatient([{ quantite: 'Chargement de données...' }]);
        setTimeout(() => {
            loadData(props.data.numero, cmpltDate);
        }, 200)
    }

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
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
                <h4 className='mb-1'>Patient : <i style={{ fontWeight: '800', color: 'black' }} >{props.data.nom}({'Tarif :' + props.data.type_pat + ', ID :' + props.data.id_patient})</i> </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <h3 className='m-3'>Liste Examens éffectuées</h3>
        </div>
    )


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.post(props.url + `deleteExamenDetails`, { num_arriv: props.data.numero, date_arriv: props.data.date_arr, lib_examen: data.lib_examen })
                                    .then(res => {
                                        notificationAction('info', 'Suppression reuissie !', res.data.message);
                                        if (res.data.nbrexamen == 1) {
                                            setTimeout(() => {
                                                onHide('displayBasic2');
                                                props.changecharge(1);
                                            }, 600)
                                        }
                                        chargementData()
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        notificationAction('error', 'Suppression non reuissie !', 'Examen non supprimer !');
                                    })
                            }
                            const reject = () => {
                                return null;
                            }
                            confirmDialog({
                                message: 'Voulez vous supprimer l\'examen : ' + data.lib_examen,
                                header: 'Suppression  ',
                                icon: 'pi pi-exclamation-circle',
                                acceptClassName: 'p-button-danger',
                                acceptLabel: 'Ok',
                                rejectLabel: 'Annuler',
                                accept,
                                reject
                            });
                        }} />

                    <CompteRendu nom={props.data.nom} url={props.url} test={"<div>"+data.lib_examen+"</div >"} data={data} date_arriv={props.data.date_arr} num_arriv={props.data.numero} chargementData={chargementData} lib_examen={data.lib_examen} />
                </div>
            </div>
        )
    }
    const bodyStatus = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    {data.type == 'PANORAMIQUE DENTAIRE' || data.type == 'ECG' ?
                        <Tag className="mr-2 " severity={"info"} >Optionel</Tag>
                        :
                        data.cr_name == '-' ?
                            <Tag className="mr-2 " severity={"warning"} > Non</Tag>
                            :
                            <Tag className="mr-2 " severity={"success"} >Ok</Tag>
                    }
                </div>
            </div>
        )
    }



    const onValideExamen = async () => { //Modification  donnees vers Laravel
        setchargeV({ chupdate: true });
        await axios.put(props.url + 'validationExamen', infoExamenVal)
            .then(res => {
                notificationAction(res.data.etat, 'Validation examen', res.data.message);//message avy @back
                setchargeV({ chupdate: false });
                setTimeout(() => {
                    onHide('displayBasic2');
                    props.changecharge(1);
                }, 600)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setchargeV({ chupdate: false });
            });
    }



    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.SAVE} className='p-buttom-sm p-1 mr-2 p-button-success ' label='Valider' tooltip="valider l'examen" tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-10 md:col-11 col-11 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <h3 className='m-1' htmlFor="">Date d'arrivé : <u style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {props.data.date_arr}</u></h3>
                        <h3 className='m-1' htmlFor="">Numéro d'arrivée : <u style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold', fontSize: '1.4rem' }}> {props.data.numero}</u></h3>
                    </div>
                    <div className="flex flex-column justify-content-center">
                        <DataTable header={header} value={infoexamenPatient} scrollable scrollHeight="350px" loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun resultat !"} style={{ fontSize: '1.1em' }} >
                            <Column field='lib_examen' header={'Libellé'} style={{ fontWeight: '600' }}></Column>
                            <Column field={'code_tarif'} header={'Cotation'} style={{ fontWeight: '600' }}></Column>
                            <Column field={'quantite'} header="Quantité" style={{ fontWeight: '600' }}></Column>
                            <Column field='montant' header="P.U"></Column>
                            <Column field='date_exam' header="Date examen"></Column>
                            <Column field='type' header="Type"></Column>
                            <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                            <Column header="Status" body={bodyStatus} > </Column>
                        </DataTable>
                    </div>
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-success ' tooltip="Valider l'examen" disabled={verfCompteRendu} style={{ cursor: 'pointer' }} label={chargeV.chupdate ? 'Veuillez attendez...' : 'Valider'}
                            onClick={() => {
                                onValideExamen()
                            }} />
                    </div>
                    {verfCompteRendu ? <center><label id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Vous devez ajouter compte rendu pour <i style={{ fontWeight: '800' }} >Valider </i> l'examen </label></center> : null}
                </div>
            </Dialog>
        </>
    )
}

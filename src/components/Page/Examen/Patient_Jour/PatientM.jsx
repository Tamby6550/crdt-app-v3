import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import RechercheM from './RechercheM'

export default function PatientM(props) {

    //Chargement de données
    const [charge, setCharge] = useState(true);
    const [refreshData, setrefreshData] = useState(0);
    const [listPatient, setlistPatient] = useState([{ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' }]);
    const [infoPatient, setinfoPatient] = useState({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    const onVideInfo = () => {
        setinfoPatient({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    }
    const [totalenrg, settotalenrg] = useState(null)


    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(125 128 141)', border: '1px solid rgb(125 128 141)'
    };
    const stylebtnCheck = {
        fontSize: '0.5rem', padding: ' 0.8rem 0.5rem', backgroundColor: '#2196F3', border: '1px solid #2196F3'
    };

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 2000 });
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
                <h4 className='mb-1'>Choisir un patient</h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    //Get List patient
    const loadData = async () => {
        await axios.get(props.url + `getPatient`)
            .then(
                (result) => {
                    onVideInfo();
                    setrefreshData(0);
                    setlistPatient(result.data.listePatient);
                    settotalenrg(result.data.nbenreg)
                    setCharge(false);
                }
            );
    }

    const chargementData = () => {
        setCharge(true);
        setlistPatient([{ sexe: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 200)
    }




    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 ml-2 py-2 flex'>
                <RechercheM icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistPatient={setlistPatient} setrefreshData={setrefreshData} url={props.url} infoPatient={infoPatient} setinfoPatient={setinfoPatient} />
            </div>
            {infoPatient.date_naiss != "" || infoPatient.nom != "" || infoPatient.prenom != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning mr-3' tooltip='actualiser' onClick={() => chargementData()} tooltipOptions={{ position: 'top' }} />
                :
                <>
                    <label >Liste des Patients (15 dernier jours)</label>
                </>
            }
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Button icon={PrimeIcons.CHECK_CIRCLE} className='p-buttom-sm p-1 ' style={stylebtnCheck} tooltip='Choisir' tooltipOptions={{ position: 'top' }}
                        onClick={() => {
                            props.setinfoRegistre({ ...props.infoRegistre, id_patient: data.id_patient, type_pat: data.type, nom: data.nom,prenom:data.prenom, date_naiss: data.datenaiss, telephone: data.telephone })
                            // notificationAction('success', 'Id Patient  : '+data.id_patient, '')
                            onHide('displayBasic2');
                        }} />
                </div>

            </div>
        )
    }

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-1 mr-2 ' style={stylebtnRec} tooltip='Recherche Patient'  onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-7 md:col-10 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className="flex flex-column justify-content-center">
                        <DataTable header={header} value={listPatient} responsiveLayout="scroll" className='bg-white' emptyMessage={'Aucun resultat trouvé'} style={{ fontSize: '0.96em' }}>
                            <Column field='id_patient' header="Id"></Column>
                            <Column field={'nom'} header="Nom"></Column>
                            <Column field={'prenom'} header="Prenom"></Column>
                            <Column field='type' header="Type"></Column>
                            <Column field='sexe' header="Sexe"></Column>
                            <Column field='datenaiss' header="Date de naissance"></Column>
                            <Column field='telephone' header="Tel" ></Column>
                            <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

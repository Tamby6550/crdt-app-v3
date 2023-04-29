import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Insertion from './Patient_c/Insertion'
import Modification from './Patient_c/Modification'
import Recherche from './Patient_c/Recherche'
import { Dialog } from 'primereact/dialog';
import Registre from './Patient_c/Registre'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';


export default function Patient(props) {

    const [numJournal, setnumJournal] = useState({ num: 0, datej: '' })

    //Timer affichage numéro journal
    const [timer, setTimer] = useState(100);

    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listPatient, setlistPatient] = useState([{ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' }]);
    const [infoPatient, setinfoPatient] = useState({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    const onVideInfo = () => {
        setinfoPatient({ id_patient: '', nom: '', prenom: '', type: '', sexe: '', date_naiss: '', telephone: '', adresse: '' });
    }
    const [totalenrg, settotalenrg] = useState(null)


    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    //Get List patients
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

    useEffect(() => {
        setCharge(true);
        setlistPatient([{ sexe: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 200)
    }, [refreshData]);

    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 ml-2 py-2 flex'>
                <Insertion url={props.url} setrefreshData={setrefreshData} totalenrg={totalenrg} />
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistPatient={setlistPatient} setrefreshData={setrefreshData} url={props.url} infoPatient={infoPatient} setinfoPatient={setinfoPatient} />
                {infoPatient.date_naiss == "" && infoPatient.nom == "" && infoPatient.prenom == "" ? null : <label className='ml-5 mt-2'>Resultat de recherche ,   Nom : <i style={{ fontWeight: '700' }}>"{(infoPatient.nom).toUpperCase()}"</i>  , Prenom : <i style={{ fontWeight: '700' }}>"{(infoPatient.prenom).toUpperCase()}"</i>, Date de naissance : <i style={{ fontWeight: '700' }}>"{infoPatient.date_naiss}"</i>  </label>}
            </div>

            {infoPatient.date_naiss != "" || infoPatient.nom != "" || infoPatient.prenom != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning mr-3' tooltip='actualiser' onClick={() => setrefreshData(1)} tooltipOptions={{ position: 'top' }} />
                :
                <>
                    <label >Liste des Patients (15 dernier jours)</label>
                    <label className='ml-5 mt-1'>Total enregistrement : {totalenrg - 1}  </label>
                </>
            }
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Registre url={props.url} onClick={onClick} setnumJournal={setnumJournal} id_patient={data.id_patient} nom={data.nom} prenom={data.prenom} date_naiss={data.datenaiss} telephone={data.telephone} tambyR={'nouveau'} />
                    <Modification data={data} url={props.url} setrefreshData={setrefreshData} />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `deletePatient/${data.id_patient}`)
                                    .then(res => {
                                        notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                                        setrefreshData(1)
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        notificationAction('error', 'Suppression non reuissie !', 'Enregirement non supprimer !');
                                    })
                            }
                            const reject = () => {
                                return null;
                            }
                            confirmDialog({
                                message: 'Voulez vous supprimer l\'enregistrement : ' + data.id_patient,
                                header: 'Suppression  ',
                                icon: 'pi pi-exclamation-circle',
                                acceptClassName: 'p-button-danger',
                                acceptLabel: 'Ok',
                                rejectLabel: 'Annuler',
                                accept,
                                reject
                            });
                        }} />
                </div>
            </div>
        )
    }




    /*Modal  */
    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState('center');

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }


        setTimeout(() => {
            onHide(name);
            setTimer(100)
        }, 8000)

    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    useEffect(() => {
        if (displayBasic) {
            const intervalId = setInterval(() => {
                setTimer(prevValue => prevValue - (100 / 7));
            }, 1000);

            return () => { clearInterval(intervalId); }
        }
    }, [timer, displayBasic]);

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Dialog header={"Date d'arriver : " + numJournal.datej} visible={displayBasic} className="lg:col-3 md:col-5 col-8 p-0" onHide={() => onHide('displayBasic')} >
                <center><h3 className='m-3'>Numéro de journal d'arriver :  <u style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold', fontSize: '1.8rem' }}> {numJournal.num}</u>   </h3></center>
                <ProgressBar value={timer} showValue={false} style={{ height: "3px" }}></ProgressBar>
            </Dialog>
            <div className="flex flex-column justify-content-center m-1">
                <DataTable header={header} value={listPatient} loading={charge} responsiveLayout="scroll" scrollable scrollHeight="500px" rows={10} rowsPerPageOptions={[10, 20, 50]} paginator className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='id_patient' header="Id"></Column>
                    <Column field={'nom'} header="Nom"></Column>
                    <Column field={'prenom'} header="Prénom"></Column>
                    <Column field='type' header="Tarif"></Column>
                    <Column field='sexe' header="Sexe"></Column>
                    <Column field='datenaiss' header="Date de naissance"></Column>
                    <Column field='telephone' header="Tél" ></Column>
                    <Column field='adresse' header="Adresse" ></Column>
                    <Column header="" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

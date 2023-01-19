
import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import VoirCR from './ExamenEffV/VoirCR';
import Recherche from './ExamenEffV/Recherche';

export default function ExamenEffValide(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [chRetour, setchRetour] = useState(false)
    const [refreshData, setrefreshData] = useState(0);
    const [listExamenNonEff, setlistExamenNonEff] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
    const [infoReherche, setinfoReherche] = useState({ numero_arr: '', date_arr: '', date_naiss: '', nom: '' })

    const [recHtml, setrecHtml] = useState(null)

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
    };
    const stylebtnRetourner = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 153 46 / 85%)', border: '1px solid rgb(211 152 47 / 63%)'
    };

    /**Style css */


    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /*Notification Toast */



    const changecharge = (value) => {
        setrefreshData(value)
    }
    const onVide = () => {
        setinfoReherche({ numero_arr: '', date_arr: '', date_naiss: '', nom: '' })
    }

    //Get List patient
    const loadData = async () => {

        await axios.get(props.url + `getExamenEffValide`)
            .then(
                (result) => {
                    onVide();
                    setrefreshData(0);
                    setCharge(false);
                    setlistExamenNonEff(result.data);
                }
            );
    }

    useEffect(() => {
        setCharge(true);
        setlistExamenNonEff([{ nom: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 800)
    }, [refreshData]);

    const bodyConfirme = () => {
        return (
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <h3 className='m-1'>Vous voullez retournés le patient dans la <u style={{ fontWeight: 'bold', fontSize: '1.1em' }}>liste des patients en attente de validation </u> </h3><br />
                <h4 className='m-0'> <i> NB : Peut être causer par la faute de saisie ou une erreur inattendu</i> </h4>
            </div>
        )
    }

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <VoirCR url={props.url} data={data} changecharge={changecharge} />
                    {data.verf_fact == '1'|| data.verf_fact == '2' ?
                        null
                        :
                        <Button icon={PrimeIcons.REPLAY} className='p-buttom-sm p-1 ' style={stylebtnRetourner} tooltip='Retourner' tooltipOptions={{ position: 'top' }}
                            onClick={() => {

                                const accept = async () => {
                                    setchRetour(true);
                                    await axios.put(props.url + 'validationExamen', { num_arriv: data.numero, date_arriv: data.date_arr, verfexamen: '1' })
                                        .then(res => {
                                            notificationAction(res.data.etat, 'Deplacement de patient', 'Patient bien retouné dans la liste de patient en attente de validation ');//message avy @back
                                            setchRetour(false);
                                            setTimeout(() => {
                                                setrefreshData('1')
                                            }, 600)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            notificationAction('error', 'Erreur', err.data.message);//message avy @back
                                            setchRetour(false);
                                        });
                                }
                                const reject = () => {
                                    return null;
                                }
                                confirmDialog({
                                    message: bodyConfirme,
                                    header: 'Confirmation de deplacement patient ',
                                    icon: PrimeIcons.EXCLAMATION_CIRCLE,
                                    acceptClassName: 'p-button-danger',
                                    acceptLabel: 'Ok, Retourner ',
                                    rejectLabel: 'Annuler',
                                    accept,
                                    reject
                                });
                            }} />
                    }
                </div>
            </div>
        )
    }




    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistExamenNonEff={setlistExamenNonEff} changecharge={changecharge} url={props.url} infoReherche={infoReherche} setinfoReherche={setinfoReherche} />
                {infoReherche.date_arr == "" && infoReherche.nom == "" && infoReherche.date_naiss == "" && infoReherche.numero_arr == "" ? null :
                    <label className='ml-5 mt-2'>
                        Resultat de recherche ,
                        Date d'arrivée : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_arr).toUpperCase()}"</i>  ,
                        Numéro d'arrivée : <i style={{ fontWeight: '700' }}>"{(infoReherche.numero_arr).toUpperCase()}"</i>,
                        Nom : <i style={{ fontWeight: '700' }}>"{(infoReherche.nom).toUpperCase()}"</i>,
                        Date naiss : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_naiss).toUpperCase()}"</i>,
                    </label>}
            </div>
            {infoReherche.date_arr != "" || infoReherche.nom != "" || infoReherche.date_naiss != "" || infoReherche.numero_arr != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                :
                <>
                    <h3 className='m-3'>Examens éffectuées</h3>
                    <h3 className='m-3' style={{ visibility: 'hidden' }} >Examens éffectuées</h3>
                </>
            }
        </div>
    )

    // const header1 = header();

    //Global filters
    return (
        <>
            <Toast ref={toastTR} position="top-center" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center">

                <DataTable header={header} globalFilterFields={['numero', 'date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']} value={listExamenNonEff} loading={charge} scrollable scrollHeight="550px" responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >

                    <Column field='numero' header={'Numéro d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                    <Column field={'date_arr'} header={'Date d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                    <Column field={'id_patient'} header="ID" style={{ fontWeight: '600' }}></Column>
                    <Column field='nom' header="Nom"></Column>
                    <Column field='date_naiss' header="Date_Naiss"></Column>
                    <Column field='type_pat' header="Tarif"></Column>
                    <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                    {/* <Column field='telephone' header="Tél"></Column> */}
                </DataTable>


            </div>
        </>
    )
}

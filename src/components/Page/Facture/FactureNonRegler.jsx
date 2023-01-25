
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
import FFactureVoir from './FactureNonReg/FFactureVoir';
import Reglement from './FactureNonReg/Reglement'
import ModifReglement from './FactureNonReg/ModifReglement'
export default function FactureNonRegler(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listFactureEff, setlistFactureEff] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
    const [infoReherche, setinfoReherche] = useState({ numero_arr: '', date_arr: '', date_naiss: '', nom: '' })

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    const stylebtnRetourner = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 153 46 / 85%)', border: '1px solid rgb(211 152 47 / 63%)'
    };
    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */



    const changecharge = (value) => {
        setrefreshData(value)
    }
    const onVide = () => {
        setinfoReherche({ numero_arr: '', date_arr: '', date_naiss: '', nom: '' })
    }

    //Get List patient
    const loadData = async () => {

        await axios.get(props.url + `getEffectFacture`)
            .then(
                (result) => {
                    onVide();
                    setrefreshData(0);
                    setCharge(false);
                    setlistFactureEff(result.data);
                }
            ).catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        setCharge(true);
        setlistFactureEff([{ nom: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 800)
    }, [refreshData]);


    const bodyConfirme = () => {
        return (
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <h3 className='m-1'>Vous voullez retournés la facture dans la <u style={{ fontWeight: 'bold', fontSize: '1.1em' }}>liste des patients non facturé </u> </h3><br />
                <h5 className='m-0'> <i> NB : Peut être causer par la faute de saisie(Prise en charge ou remise) ou une erreur inattendu</i> </h5>
            </div>
        )
    }

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <FFactureVoir url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />

                    <Reglement url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    <ModifReglement url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    {data.nbrergl == 0 ?
                        <Button icon={PrimeIcons.REPLAY} className='p-buttom-sm p-1 ' style={stylebtnRetourner} tooltip='Retourner' tooltipOptions={{ position: 'top' }}
                            onClick={() => {

                                const accept = async () => {
                                    // setchRetour(true);
                                    // await axios.put(props.url + 'validationExamen', { num_arriv: data.numero, date_arriv: data.date_arr, verfexamen: '1' })
                                    //     .then(res => {
                                    //         notificationAction(res.data.etat, 'Deplacement de patient', 'Patient bien retouné dans la liste de patient en attente de validation ');//message avy @back
                                    //         setchRetour(false);
                                    //         setTimeout(() => {
                                    //             setrefreshData('1')
                                    //         }, 600)
                                    //     })
                                    //     .catch(err => {
                                    //         console.log(err);
                                    //         notificationAction('error', 'Erreur', err.data.message);//message avy @back
                                    //         setchRetour(false);
                                    //     });
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
                        :null}
                </div>
            </div>
        )
    }



    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <h3 className='m-3'>Liste Patient Non Facturées</h3>
        </div>
    )


    // const header1 = header();

    //Global filters
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center" >
                <DataTable header={header} autoLayout globalFilterFields={['numero', 'date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']} value={listFactureEff} loading={charge} className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >
                    <Column field='num_fact' header={'N° Facture'} style={{ fontWeight: '700' }}></Column>
                    <Column field={'date_facture'} header="Date Facture" style={{ fontWeight: '600' }} ></Column>
                    <Column field='numero' header={'Numéro d\'Arrivée'} style={{ fontWeight: '600' }} ></Column>
                    <Column field={'date_arr'} header={'Date d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                    <Column field='nom' header="Nom"></Column>
                    <Column field='date_naiss' header="Date_Naiss"></Column>
                    <Column field='type_patient' header="Tarif"></Column>
                    <Column field={'date_examen'} header="Date Examen" style={{ fontWeight: '600' }}></Column>
                    <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

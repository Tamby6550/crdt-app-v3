
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
import ImpressionFact from './FactureNonReg/ImpressionFact';
import ImpressionFactAll from './FactureNonReg/ImpressionFactAll';
import Recherche from './FactureNonReg/Recherche';

export default function FactureNonRegler(props) {


    function poucentage(val, pourc) {
        let res = (pourc * 100) / val;
        return (res).toFixed(2);
    }

    //Chargement de données
    const [chRetour, setchRetour] = useState(false)
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listFactureEff, setlistFactureEff] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
    const [infoReherche, setinfoReherche] = useState({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_naiss: '', date_debut: '', date_fin: '', pec: false })

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    const stylebtnRetourner = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid rgb(195 46 46 / 85%)'
    };
    /**Style css */

    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 8000 });
    }
    /*Notification Toast */



    const changecharge = (value) => {
        setrefreshData(value)
    }
    const onVide = () => {
        setinfoReherche({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_naiss: '', date_debut: '', date_fin: '', pec: false })
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

    const bodyV = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                {data.jourj == data.date_fverf ?
                    // <Tag severity='success'>
                    <Tag severity='success' icon={PrimeIcons.CHECK_CIRCLE}></Tag>
                    :
                    null
                }
            </div>
        )
    }
    const bodyPat = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <strong htmlFor="">{poucentage(data.totalpat, data.rpatient)}%</strong>
            </div>
        )
    }
    const bodyClient = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                {/* {isNaN(data.totalpec)?'aaa' :'rr'} */}
                <strong htmlFor="">{poucentage(data.totalpec, data.rclient) == 'NaN' ? '-' : poucentage(data.totalpec, data.rclient) + '%'}</strong>
            </div>
        )
    }

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <FFactureVoir url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />

                    <Reglement setActiveIndex={props.setActiveIndex} url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    <ModifReglement url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    <ImpressionFact url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    {data.nbrergl == 0 ?
                        <Button icon={PrimeIcons.REPLAY} className='p-buttom-sm p-1 ' style={stylebtnRetourner} tooltip='Retourner' tooltipOptions={{ position: 'top' }}
                            onClick={() => {
                                const accept = async () => {

                                    await axios.put(props.url + 'retourFactNonRegleEnNonPaye', { num_arriv: data.numero, date_arriv: data.date_arr, num_facture: data.num_fact })
                                        .then(res => {
                                            //message avy @back
                                            notificationAction(res.data.etat, 'Deplacement de patient', 'Patient bien retouné dans la liste de patient en attente de validation ');
                                            setTimeout(() => {
                                                setrefreshData('1');
                                            }, 300)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            //message avy @back
                                            notificationAction('error', 'Erreur', err.data.message);

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
                        : null}

                </div>
            </div>
        )
    }


    const headerReherche = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} charge={charge} setlistFactureEff={setlistFactureEff} changecharge={changecharge} url={props.url} infoReherche={infoReherche} setinfoReherche={setinfoReherche} />
                {infoReherche.num_facture == "" && infoReherche.date_facture == "" && infoReherche.nom_patient == "" && infoReherche.nom_client == ""
                    && infoReherche.numero_arr == "" && infoReherche.date_arr == "" && infoReherche.pec === false && infoReherche.date_debut == "" && infoReherche.date_fin == "" ? null :
                    <label className='ml-5 mt-2'>
                        Resultat de recherche ,
                        Numéro facture : <i style={{ fontWeight: '700' }}>"{(infoReherche.num_facture)}"</i>  ,
                        Date facture : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_facture)}"</i>,
                        Numéro d'arrivé : <i style={{ fontWeight: '700' }}>"{(infoReherche.numero_arr)}"</i>,
                        Date d'arrivé : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_arr)}"</i>,
                        Nom Patient : <i style={{ fontWeight: '700' }}>"{(infoReherche.nom_patient)}"</i>,
                        Nom client : <i style={{ fontWeight: '700' }}>"{(infoReherche.nom_client)}"</i>,
                        PEC : <i style={{ fontWeight: '700' }}>"{(infoReherche.pec ? 'OK' : null)}"</i>,
                        Date arrivé: <i style={{ fontWeight: '700' }}>{infoReherche.date_debut == "" ? null : "du " + infoReherche.date_debut + " jusqu'à " + infoReherche.date_fin}"</i>,
                    </label>}
            </div>
            {infoReherche.num_facture != "" || infoReherche.date_facture != "" || infoReherche.nom_patient != "" || infoReherche.nom_client != ""
                || infoReherche.numero_arr != "" || infoReherche.date_arr != "" || infoReherche.pec === true || infoReherche.date_debut != "" || infoReherche.date_fin != "" ?
                <>
                    <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                    {/* <ImpressionFactAll url={props.url} data={listFactureEff} changecharge={changecharge} setrefreshData={setrefreshData} /> */}
                </>
                :
                <>
                    <h3 className='m-3'  >Liste de factures non réglées(Aujourd'hui)</h3>
                    <h3 className='m-3' style={{ visibility: 'hidden' }} >facture </h3>
                {/* <ImpressionFactAll url={props.url} data={listFactureEff} changecharge={changecharge} setrefreshData={setrefreshData} /> */}
                    <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                </>
            }
        </div>
    )


    // const header1 = header();

    //Global filters
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center" >
                <DataTable header={headerReherche} autoLayout globalFilterFields={['numero', 'date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']} value={listFactureEff} loading={charge} className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >
                    <Column body={bodyV} header={''} style={{ fontWeight: '700' }}></Column>
                    <Column field='num_fact' header={'N° Facture'} style={{ fontWeight: '700' }}></Column>
                    <Column field={'date_facture'} header="Date Facture" style={{ fontWeight: '600' }} ></Column>
                    <Column field='numero' header={'N° Arrivée'} style={{ fontWeight: '600' }} ></Column>
                    <Column field={'date_arr'} header={'Date d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                    <Column field={'date_examen'} header="Date Examen" style={{ fontWeight: '600' }}></Column>
                    <Column field='nom' header="Nom"></Column>
                    <Column field='date_naiss' header="Date_Naiss"></Column>
                    <Column field='type_patient' header="Tarif"></Column>
                    <Column body={bodyPat} header="Regl-Pat"></Column>
                    <Column body={bodyClient} header="Regl-Cli"></Column>
                    <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

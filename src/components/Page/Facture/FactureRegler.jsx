
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
import ModifReglement from './FactureNonReg/ModifReglement'
import ImpressionFact from './FactureNonReg/ImpressionFact';
import Recherche from './FactureRegler/Recherche';
export default function FactureNonRegler(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listeFactureRegle, setlisteFactureRegle] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
    const [infoReherche, setinfoReherche] = useState({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_naiss: '' })

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



    const changecharge = (value) => {
        setrefreshData(value)
    }

    const onVide = () => {
        setinfoReherche({ num_facture: '', date_facture: '', nom_patient: '', nom_client: '', numero_arr: '', date_arr: '', date_naiss: '' })
    }

    //Get List patient
    const loadData = async () => {

        await axios.get(props.url + `getFactureRegler`)
            .then(
                (result) => {
                    onVide();
                    setrefreshData(0);
                    setCharge(false);
                    setlisteFactureRegle(result.data);
                    // console.log(result.data)

                }
            );
    }

    useEffect(() => {
        setCharge(true);
        setlisteFactureRegle([{ nom: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 1000)
    }, [refreshData]);


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <FFactureVoir url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                    {/* <ModifReglement url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} /> */}
                    <ImpressionFact url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                </div>
            </div>
        )
    }



    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <h3 className='m-3'>Liste facture régler (5 dernier jour)</h3>
        </div>
    )

    const headerReherche = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlisteFactureRegle={setlisteFactureRegle} changecharge={changecharge} url={props.url} infoReherche={infoReherche} setinfoReherche={setinfoReherche} />
                {infoReherche.num_facture == "" && infoReherche.date_facture == "" && infoReherche.nom_patient == "" && infoReherche.nom_client == ""
                    && infoReherche.numero_arr == "" && infoReherche.date_arr == "" ? null :
                    <label className='ml-5 mt-2'>
                        Resultat de recherche ,
                        Numéro facture : <i style={{ fontWeight: '700' }}>"{(infoReherche.num_facture)}"</i>  ,
                        Date facture : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_facture)}"</i>,
                        Numéro d'arrivé : <i style={{ fontWeight: '700' }}>"{(infoReherche.numero_arr)}"</i>,
                        Date d'arrivé : <i style={{ fontWeight: '700' }}>"{(infoReherche.date_arr)}"</i>,
                        Nom Patient : <i style={{ fontWeight: '700' }}>"{(infoReherche.nom_patient)}"</i>,
                        Nom client : <i style={{ fontWeight: '700' }}>"{(infoReherche.nom_client)}"</i>,
                    </label>}
            </div>
            {infoReherche.num_facture != "" || infoReherche.date_facture != "" || infoReherche.nom_patient != "" || infoReherche.nom_client != ""
                || infoReherche.numero_arr != "" || infoReherche.date_arr != "" ?
                <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                :
                <>
                    <h3 className='m-3'>Liste facture régler (5 dernier jour)</h3>
                    <h3 className='m-3' style={{ visibility: 'hidden' }} >Examens éffectuées</h3>
                </>
            }
        </div>
    )
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center" >
                <DataTable header={headerReherche} showGridlines globalFilterFields={['numero', 'date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']} value={listeFactureRegle} loading={charge} scrollable scrollHeight="550px" responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >
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

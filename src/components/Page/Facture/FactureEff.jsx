
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
import FFactureVoir from './FactureEff/FFactureVoir';
import Reglement from './FactureEff/Reglement'

export default function FactureEff(props) {

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
            );
    }

    useEffect(() => {
        setCharge(true);
        setlistFactureEff([{ nom: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 800)
    }, [refreshData]);


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                <FFactureVoir url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />
                <Reglement url={props.url} data={data} changecharge={changecharge} setrefreshData={setrefreshData} />

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

                <DataTable header={header} showGridlines  globalFilterFields={['numero', 'date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']} value={listFactureEff} loading={charge} scrollable scrollHeight="550px" responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >

                    <Column field='num_fact' header={'N° Facture'} style={{ fontWeight: '700' }}></Column>
                    <Column field={'date_facture'} header="Date Facture" style={{ fontWeight: '600' }} ></Column>
                    <Column field='numero' header={'Numéro d\'Arrivée'} style={{ fontWeight: '600' }} ></Column>
                    <Column field={'date_arr'} header={'Date d\'Arrivée'}   style={{ fontWeight: '600' }}></Column>
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

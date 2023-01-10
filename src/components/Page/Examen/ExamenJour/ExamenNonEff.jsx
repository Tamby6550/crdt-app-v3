import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AjoutExamen from './ExamenNonEffe/AjoutExamen'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';


export default function ExamenNonEff(props) {
    //Block Chargement
    const [blockedDocument, setBlockedDocument] = useState(true);

    

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listExamenNonEff, setlistExamenNonEff] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
    const [infoRegistre, setinfoRegistre] = useState({ num_arriv: '', date_arriv: '', id_patient: '' });

    const onVide = () => {
        setinfoRegistre({ num_arriv: '', date_arriv: '', id_patient: '' })
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



    //Get List patient
    const loadData = async () => {
        onVide();

        await axios.get(props.url + `getExamenNonEff`)
            .then(
                (result) => {
                    setrefreshData(0);
                    setlistExamenNonEff(result.data);
                    setCharge(false);
                    initFilters1();
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




    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <h3 className='m-3'>Examens à éffectuées</h3>
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <AjoutExamen url={props.url} type_pat={data.type_pat} data={data} setrefreshData={setrefreshData} />
                </div>
            </div>
        )
    }
  
    //Global filters
    
    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }
    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue1('');
    }
    const clearFilter1 = () => {
        initFilters1();
    }
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Vider" className="p-button-outlined" onClick={clearFilter1} />
                <h3 className='m-3'>Examens à éffectuées</h3>
                <span className="p-input-icon-left global-tamby">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Recherche global..." />
                </span>
            </div>
        )
    }
    const header1 = renderHeader1();

    //Global filters

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center">
                    <DataTable header={header1} value={listExamenNonEff} loading={charge} filters={filters1} scrollable scrollHeight="550px"  globalFilterFields={['numero','date_arr', 'id_patient', 'nom', 'date_naiss', 'type_pat']}  responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun examen à éffectuées"} >
                        <Column field='numero'  header={'Numéro d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                        <Column field={'date_arr'}  header={'Date d\'Arrivée'} style={{ fontWeight: '600' }}></Column>
                        <Column field={'id_patient'}  header="ID" style={{ fontWeight: '600' }}></Column>
                        <Column field='nom' header="Nom"></Column>
                        <Column field='date_naiss' header="Date_Naiss"></Column>
                        <Column field='type_pat'  header="Tarif"></Column>
                        <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                        {/* <Column field='telephone' header="Tél"></Column> */}
                    </DataTable>
            </div>
        </>
    )
}

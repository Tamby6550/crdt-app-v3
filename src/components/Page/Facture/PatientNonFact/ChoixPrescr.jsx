import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'

import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function ChoixPrescr(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listPresc, setlistPresc] = useState([{ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '' }]);
    const [infoClient, setinfoClient] = useState({ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '', titre: '' });
    const onVideInfo = () => {
        setinfoClient({ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '', titre: '' });
    }
    const [totalenrg, settotalenrg] = useState(null)

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
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


    //Get List client
    const loadData = async () => {

        try {
            await axios.get(props.url + `getPrescripteurF`)
                .then(
                    (result) => {
                        onVideInfo();
                        setrefreshData(0);
                        setlistPresc(result.data.all);
                        settotalenrg(result.data.nbenreg)
                        setCharge(false);
                        initFilters1()
                    }
                ).catch((error) => {
                    console.log(error.message);
                })

        } catch (error) {
            console.log("Erreur de la connexion");
        }
    }

    const chargementData = () => {
        setCharge(true);
        setlistPresc([{ phone1: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>

                    <Button icon={PrimeIcons.CHECK_CIRCLE} className='p-buttom-sm p-1 p-button-primary ' tooltip='Choisir' tooltipOptions={{ position: 'top' }}
                        onClick={() => {
                            props.setverfChamp({ ...props.verfChamp,nom_presc: false })
                            props.setinfoFacture({ ...props.infoFacture, code_presc: data.code_presc, nom_presc: data.nom})
                            onHide('displayBasic2')
                           
                        }} />
                </div>
            </div>
        )
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
                <h4 className='mb-1'>Choisir Prescripteur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


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
                {/* <Button type="button" icon="pi pi-filter-slash" label="Vider" className="p-button-outlined" onClick={clearFilter1} /> */}
                <h3 className='m-3'>Liste Clients</h3>
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

            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltip='Choisir' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} className="lg:col-6 md:col-9 col-10 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>

                <div className="flex flex-column justify-content-center">
                    <BlockUI blocked={charge} template={<ProgressSpinner />}>
                        <DataTable rows={10} rowsPerPageOptions={[10, 20, 50]} globalFilterFields={['code_presc', 'nom', 'phone1', 'phone2', 'mobile', 'adresse']} paginator header={header1} value={listPresc} scrollable scrollHeight="350px" responsiveLayout="scroll" className='bg-white' filters={filters1} emptyMessage={'Aucun resultat trouvé'} style={{ fontSize: '1em' }}>
                            <Column field='code_presc' header="Code"></Column>
                            <Column field='nom' header="Nom"></Column>
                            <Column field='phone1' header="Phone1"></Column>
                            <Column field='phone2' header="Phone2"></Column>
                            <Column field='mobile' header="Mobile"></Column>
                            <Column field='adresse' header="Adresse"></Column>
                            <Column header="action" body={bodyBoutton} align={'left'}></Column>
                        </DataTable>
                    </BlockUI>
                </div>
            </Dialog>

        </>
    )
}

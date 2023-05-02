import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Insertion from './Prescripteur_c/Insertion'
import Modification from './Prescripteur_c/Modification'
import Recherche from './Prescripteur_c/Recherche'
import Voir from './Prescripteur_c/Voir'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

export default function Prescripteur(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listClient, setlistClient] = useState([{ code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '' }]);
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
            await axios.get(props.url + `getPrescripteur`)
                .then(
                    (result) => {
                        onVideInfo();
                        setrefreshData(0);
                        setlistClient(result.data.all);
                        settotalenrg(result.data.nbenreg)
                        setCharge(false);
                        initFilters1();
                    }
                ).catch((error) => {
                    console.log(error.message);
                })

        } catch (error) {
            console.log("Erreur de la connexion");
        }

    }

    useEffect(() => {
        setCharge(true);
        setlistClient([{ phone1: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }, [refreshData]);

    // const header = (
    //     <div className='flex flex-row justify-content-between align-items-center m-0 '>
    //         <div className='my-0 ml-2 py-2 flex'>
    //             <Insertion url={props.url} setrefreshData={setrefreshData} />
    //             <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistClient={setlistClient} setrefreshData={setrefreshData} url={props.url} infoClient={infoClient} setinfoClient={setinfoClient} />
    //             {infoClient.code_presc == "" && infoClient.nom == "" ? null : <label className='ml-5 mt-2'>Resultat de recherche ,   code client : <i style={{ fontWeight: '700' }}>"{(infoClient.code_presc).toUpperCase()}"</i>  , Nom : <i style={{ fontWeight: '700' }}>"{(infoClient.nom).toUpperCase()}"</i>  </label>}
    //         </div>

    //         {infoClient.code_presc != "" || infoClient.nom != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
    //             :
    //             <>
    //                 <label >Liste des Prescripteurs </label>
    //                 <label className='ml-5 mt-1'>Total enregistrement : {totalenrg-1}  </label>
    //             </>
    //         }

    //     </div>
    // )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    {/* <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-1 mr-2' onClick={() => { alert('Nom : ' + data.nom + ' !') }} tooltip='Voir' /> */}
                    <Voir data={data} url={props.url} setrefreshData={setrefreshData} />
                    <Modification data={data} url={props.url} setrefreshData={setrefreshData} />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' disabled tooltipOptions={{position: 'top'}}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `deletePrescripteur/${data.code_presc}`)
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
                                message: 'Voulez vous supprimer l\'enregistrement : ' + data.code_presc,
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
                <Insertion url={props.url} setrefreshData={setrefreshData} />

                <h3 className='m-3'>Liste des Prescripteurs</h3>
                <div className='flex'>
                    <Button type="button" icon="pi pi-filter-slash" label="Vider" className="p-button-outlined" onClick={clearFilter1} />
                    <span className="p-input-icon-left global-tamby ml-2"   >
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Recherche global..." />
                    </span>
                </div>
            </div>
        )
    }
    const header1 = renderHeader1();
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center">
                <DataTable header={header1} filters={filters1} globalFilterFields={['code_presc', 'nom', 'phone1', 'phone2', 'mobile', 'adresse']} value={listClient} responsiveLayout="scroll" scrollable scrollHeight="500px"  loading={charge} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='code_presc' header="Code"></Column>
                    <Column field='nom' header="Nom"></Column>
                    <Column field='phone1' header="Phone1"></Column>
                    <Column field='phone2' header="Phone2"></Column>
                    <Column field='mobile' header="Mobile"></Column>
                    <Column field='adresse' header="Adresse"></Column>
                    <Column header="action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

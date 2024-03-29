import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Insertion from './Examen_referentiel/Insertion'
import Modification from './Examen_referentiel/Modification'
import Recherche from './Examen_referentiel/Recherche'
import Voir from './Examen_referentiel/Voir'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

export default function Examen(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listexamen, setlistexamen] = useState([{ id_examen: '', lib: '', code_tarif: '', type: '', montant: '', tarif: '' }]);
    const [infoexamen, setinfoexamen] = useState({ id_examen: '', lib: '', code_tarif: '', type: '', tarif: '', montant: '' });
    const onVideInfo = () => {
        setinfoexamen({ id_examen: '', lib: '', code_tarif: '', type: '', montant: '', tarif: '' });
    };
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
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }


    //Get List client
    const loadData = async () => {
        await axios.get(props.url + `getAllExamen`)
            .then(
                (result) => {
                    onVideInfo();
                    setrefreshData(0);
                    setlistexamen(result.data.allexamen);
                    settotalenrg(result.data.nbenreg)
                    setCharge(false);
                    initFilters1();

                }
            );
    }

    useEffect(() => {
        setCharge(true);
        setlistexamen([{ code_tarif: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }, [refreshData]);


    // const header = (
    //     <div className='flex flex-row justify-content-between align-items-center m-0 '>
    //         <div className='my-0 ml-2 py-2 flex'>
    //             <Insertion url={props.url} setrefreshData={setrefreshData} totalenrg={totalenrg} />
    //             <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistexamen={setlistexamen} setrefreshData={setrefreshData} url={props.url} infoexamen={infoexamen} setinfoexamen={setinfoexamen} tarif="" />
    //             {infoexamen.lib == "" && infoexamen.tarif == "" && infoexamen.type == "" && infoexamen.code_tarif == "" ? null : <label className='ml-5 mt-2'>Resultat de recherche ,   Libelle : <i style={{ fontWeight: '700' }}>"{(infoexamen.lib).toUpperCase()}"</i>  , tarif : <i style={{ fontWeight: '700' }}>"{(infoexamen.tarif).toUpperCase()}"</i>, Cotation : <i style={{ fontWeight: '700' }}>"{(infoexamen.code_tarif).toUpperCase()}"</i> , Type : <i style={{ fontWeight: '700' }}>"{(infoexamen.type).toUpperCase()}"</i>   </label>}

    //         </div>
    //         {infoexamen.lib != "" || infoexamen.tarif != "" || infoexamen.type != "" || infoexamen.code_tarif != "" ? <Button icon={PrimeIcons.REFRESH} tooltipOptions={{ position: 'top' }} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' onClick={() => setrefreshData(1)} />
    //             :
    //             <>
    //                 <label >Liste des Examens </label>
    //                 <label className='ml-5 mt-1'>Total enregistrement : {totalenrg - 1}  </label>
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
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' disabled tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `deleteExamen/${data.id_examen}`)
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
                                message: 'Voulez vous supprimer l\'enregistrement : ' + data.id_examen,
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
                                <Insertion url={props.url} setrefreshData={setrefreshData} totalenrg={totalenrg} />

                <h3 className='m-3'>Liste des Examens</h3>
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
                <DataTable header={header1} filters={filters1}  value={listexamen} loading={charge} globalFilterFields={['id_examen', 'lib', 'tarif', 'code_tarif', 'montant', 'types']} scrollable scrollHeight="500px" rows={10} rowsPerPageOptions={[10, 20, 50]} paginator responsiveLayout="scroll" className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='id_examen' header="Id"></Column>
                    <Column field='lib' header="Libellé"></Column>
                    <Column field='tarif' header="Tarif"></Column>
                    <Column field='code_tarif' header="Cotation"></Column>
                    <Column field='montant' header="Montant"></Column>
                    <Column field='types' header="Type"></Column>
                    <Column header="action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

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

export default function ExamenEff(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listeFichier, setlisteFichier] = useState([{ name: '', link: '' }]);


    /**Style css */

    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }



    const changecharge = (value) => {
        setrefreshData(value)
    }

    const getData = async () => {
        setCharge(true);
        try {
            await axios.get(`http://${window.location.hostname}:3354/files`, {
                headers: {
                    'Content-Type': 'text/html'
                }
            }).then(
                (result) => {
                    setlisteFichier(result.data);
                    setrefreshData(0);
                    initFilters1();
                    setCharge(false);
                }
            )
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 800)
    }, [refreshData]);





    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} label='Supprimer' tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {
                            let filenames=data.name+'.html'
                            const accept = () => {
                                axios.delete(`http://${window.location.hostname}:3354/api/deletefile/${filenames}`)
                                    .then((response) => {
                                        setrefreshData(1);
                                        console.log(response.data); // affiche le message de confirmation
                                        notificationAction('success','Modèle '+data.name+' supprimé !','Modèle bien supprimé !')
                                    })
                                    .catch((error) => {
                                        console.error(error); // affiche l'erreur en cas de problème
                                    });
                            }
                            const reject = () => {
                                return null;
                            }
                            confirmDialog({
                                message: 'Voulez vous supprimer le modèle : ' + data.name,
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
                <h3 className='m-3'>Liste des Modeles de Compte Rendu</h3>
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

    //Global filters
    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center">

                <DataTable header={header1} filters={filters1} globalFilterFields={['name']} value={listeFichier} loading={charge} scrollable scrollHeight="500px" responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun examen "} >

                    <Column field='name' header={'Nom modele'} style={{ fontWeight: '600' }}></Column>
                    <Column header="Action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Insertion from './Client_c/Insertion'
import Modification from './Client_c/Modification'
import Recherche from './Client_c/Recherche'
import Voir from './Client_c/Voir'
import axios from 'axios';
import { Toast } from 'primereact/toast';


export default function Client(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listClient, setlistClient] = useState([{ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' }]);
    const [infoClient, setinfoClient] = useState({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
    const onVideInfo = () => {
        setinfoClient({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
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
        await axios.get(props.url + `getClientFact`)
            .then(
                (result) => {
                    onVideInfo();
                    setrefreshData(0);
                    setlistClient(result.data.all);
                    settotalenrg(result.data.nbenreg)
                    setCharge(false);
                }
            );
    }

    useEffect(() => {
        setCharge(true);
        setlistClient([{ stat: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }, [refreshData]);




    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <Insertion url={props.url} setrefreshData={setrefreshData} />
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistClient={setlistClient} setrefreshData={setrefreshData} url={props.url} infoClient={infoClient} setinfoClient={setinfoClient} />
                {infoClient.code_client == "" && infoClient.nom == "" ? null : <label className='ml-5 mt-2'>Resultat de recherche ,   code client : <i style={{ fontWeight: '700' }}>"{(infoClient.code_client).toUpperCase()}"</i>  , Nom : <i style={{ fontWeight: '700' }}>"{(infoClient.nom).toUpperCase()}"</i>  </label>}
            </div>
            {infoClient.code_client != "" || infoClient.nom != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                :
                <>
                    <label >Liste des Clients (nb : 10)</label>
                    <label className='ml-5 mt-1'>Total enregistrement : {totalenrg - 1}  </label>
                </>
            }
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    {/* <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-1 mr-2' onClick={() => { alert('Nom : ' + data.nom + ' !') }} tooltip='Voir' /> */}
                    <Voir data={data} url={props.url} setrefreshData={setrefreshData} />
                    <Modification data={data} url={props.url} setrefreshData={setrefreshData} />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} disabled tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `deleteClientFact/${data.code_client}`)
                                    .then(res => {
                                        // console.log(res)
                                        notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                                        // setrefreshData(1)
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
                                message: 'Voulez vous supprimer l\'enregistrement : ' + data.code_client,
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

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <div className="flex flex-column justify-content-center m-1">
                <DataTable header={header} value={listClient} responsiveLayout="scroll" scrollable scrollHeight="500px"   loading={charge} className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='code_client' header="Code"></Column>
                    <Column field='nom' header="Nom"></Column>
                    <Column field='rc' header="RC"></Column>
                    <Column field='stat' header="STAT"></Column>
                    <Column field='cif' header="CIF"></Column>
                    <Column field='nif' header="NIF"></Column>
                    <Column field='description' header="Decription" ></Column>
                    <Column header="action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}

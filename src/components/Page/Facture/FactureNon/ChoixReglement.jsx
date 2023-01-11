import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';


export default function ChoixReglement(props) {


    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [listReglement, setlistReglement] = useState([{ reglement_id: '', libelle: '', description: '' }]);
    const [user, setuser] = useState('crdt');
    const onVideInfo = () => {
        setuser('admin');
    }
 

    const toastTR = useRef(null);
    /*Notification Toast */
   

    //Get List client
    const loadData = async () => {
        await axios.get(props.url + `rechercheReglementParUser/${user}`)
            .then(
                (result) => {
                    onVideInfo();
                    setlistReglement(result.data);
                    setCharge(false);
                }
            );
    }

    const chargementData = () => {
        setCharge(true);
        setlistReglement([{ libelle: 'Chargement...' }])
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
                            props.setinfoFacture({ ...props.infoFacture, code_cli: data.code_client, nom_cli: data.nom })
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
        return null
    }
    /** Fin modal */


    //Global filters  
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-center">
                <h3 className='m-3'>List reglements</h3>
            </div>
        )
    }
    const header1 = renderHeader1();

    //Global filters
    return (
        <>
            <Toast ref={toastTR} position="top-right" />

            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-1 mr-2 mt-5 p-button-secondary ' tooltip='Choisir' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />
            <Dialog header={renderHeader('displayBasic2')} className="lg:col-4 md:col-5 col-8 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="flex flex-column justify-content-center">
                    <BlockUI blocked={charge} template={<ProgressSpinner />}>
                        <DataTable  header={header1} value={listReglement} scrollable scrollHeight="350px" responsiveLayout="scroll" className='bg-white' emptyMessage={'Aucun resultat trouvé'} style={{ fontSize: '1em' }}>
                            <Column field='reglement_id' header="Id"></Column>
                            <Column field='libelle' header="Libellé"></Column>
                            <Column field='description' header="Description"></Column>
                            <Column header="action" body={bodyBoutton} align={'left'}></Column>
                        </DataTable>
                    </BlockUI>
                </div>
            </Dialog>
        </>
    )
}

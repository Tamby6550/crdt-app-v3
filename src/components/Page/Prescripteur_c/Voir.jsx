import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Voir(props) {

    //Declaration useSatate
    const [infoClient, setinfoClient] = useState({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
    const oncharger = (data) => {
        setinfoClient({ code_presc: data.code_presc, nom: data.nom, phone1: data.phone1, phone2: data.phone2, mobile: data.mobile, adresse: data.adresse });
    }


    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    /**Style css */


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
                <h4 className='mb-1'>Information Prescripteur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    return (
        <>
            <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-button-secondary p-1 mr-2 ' tooltipOptions={{position: 'top'}} tooltip='Voir' onClick={() => { onClick('displayBasic2'); oncharger(props.data) }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '30vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <h5> <u>CODE</u>  :  {infoClient.code_presc} </h5>
                        <h5> <u>Nom</u>  :  {infoClient.nom} </h5>
                        <h5> <u>Phone 1</u>  :  {infoClient.phone1} </h5>
                        <h5> <u>Phone 2</u>  :  {infoClient.phone2} </h5>
                        <h5> <u>Mobile</u>  :  {infoClient.mobile} </h5>
                        <h5> <u>Adresse</u>  :  {infoClient.adresse} </h5>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

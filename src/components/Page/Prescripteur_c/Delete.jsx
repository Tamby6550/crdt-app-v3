import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Delete(props) {

    //Declaration useSatate
    const [infoClient, setinfoClient] = useState({ code_client: '', nom: '', description: '', rc: '', stat: '', nif: '', cif: '' });
    const oncharger = (data) => {
        setinfoClient({ code_client: data.code_client, nom: data.nom, description: data.description, rc: data.rc, stat: data.stat, nif: data.nif, cif: data.cif });
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
                <h4 className='mb-1'>Information du patient </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    return (
        <>
            <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-1 mr-2 ' tooltip='Voir' onClick={() => { onClick('displayBasic2'); oncharger(props.data) }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '30vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <h5> <u>Id</u>  :  {infoClient.code_client} </h5>
                        <h5> <u>Nom</u>  :  {infoClient.nom} </h5>
                        <h5> <u>Type</u>  :  {infoClient.rc} </h5>
                        <h5> <u>Sexe</u>  :  {infoClient.stat} </h5>
                        <h5> <u>Date de naissance</u>  : {infoClient.cif} </h5>
                        <h5> <u>Téléphone</u>  : {infoClient.nif}  </h5>
                        <h5> <u>Adresse</u>  : {infoClient.description}  </h5>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

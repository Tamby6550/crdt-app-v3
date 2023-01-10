import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'

export default function ListeExamen(props) {

    const [quantite, setquantite] = useState(1);

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnCheck = {
        fontSize: '0.5rem', padding: ' 0.8rem 0.5rem', backgroundColor: '#2196F3', border: '1px solid #2196F3'
    };


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
                <h4 className='m-1'>"<i style={{fontWeight:'800'}} >{props.data.lib}</i>"</h4>
            </div>
        );
    }
    /** Fin modal */

    const saveData = (data,index) => {
        props.handleChange(index, 'lib_examen', data.lib);
        props.handleChange(index, 'code_tarif', data.code_tarif);
        props.handleChange(index, 'quantite', quantite);
        props.handleChange(index, 'montant', data.montant);
        props.handleChange(index, 'type_examen', data.types);
        onHide('displayBasic2');
        props.onHide('displayBasic2');
    }

    return (
        <>
            <Button icon={PrimeIcons.CHECK_CIRCLE} className='p-buttom-sm p-1 ' style={stylebtnCheck} tooltip='Choisir' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2');}} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-2 md:col-4 col-4 p-0" onHide={() => onHide('displayBasic2')}>
                <div className="p-1  style-modal-tamby">
                    <div className="flex flex-column justify-content-center">
                        <div className='grid px-3'>
                            <div className="col-12  field my-0  flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Quantité</label>
                                <InputNumber id="username2"  value={quantite} aria-describedby="username2-help" className='form-input-css-tamby' name='lib_examen' onValueChange={(e) => { setquantite(e.target.value) }} />
                            </div>
                        </div>
                        <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.CHECK} className='p-button-sm p-button-info ' label={'Ok'} 
                        onClick={() => { 
                            if (quantite==null || quantite=="" || quantite<=0) {
                                return false;
                            }
                            saveData(props.data,props.index) 
                            }} />
                    </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

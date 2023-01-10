import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {


    const [verfChamp, setverfChamp] = useState(false);
    const [selectAppelation, setselectAppelation] = useState(null);


    const onAppelationChange = (e) => {
        setselectAppelation(e.value);
        props.setinfoClient({ ...props.infoClient, [e.target.name]: (e.target.value) });
    }
    const onInfoClient = (e) => {
        props.setinfoClient({ ...props.infoClient, [e.target.name]: (e.target.value) })
    }

    const choixPresc = [
        { label: 'Pr', value: 'Pr' },
        { label: 'Dr', value: 'Dr' }
    ]

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
        setverfChamp(false);
        setselectAppelation(null)

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
                <h4 className='mb-1'>Recherche Prescripteur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



  
    //Recherche List client
    const RechercheloadData = async () => {
        props.setCharge(true);
        props.setlistClient([{ stat: 'Chargement de données...' }])
        axios.post(props.url + 'recherchePrescripteur', props.infoClient)
           .then(
                (result) => {
                    props.setrefreshData(0);
                    props.setlistClient(result.data)
                    props.setCharge(false);
                    onHide('displayBasic2');
                }
            );
    }
    return (
        <div>

            <Button  tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary' onClick={() => {onClick('displayBasic2');props.setinfoClient({code_presc: '', nom: '', phone1: '', phone2: '', mobile: '', adresse: '',titre:''})}} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} style={{ width: '35vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <form className='flex flex-column justify-content-center'>
                    <div className='grid px-4'>
                                <div className="lg:col-3  field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Code*</label>
                                    <InputText id="username2" value={props.infoClient.code_presc} aria-describedby="username2-help" name='code_presc' className={verfChamp.code_presc ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={onInfoClient} />
                                </div>
                            </div>

                            <div className='grid px-4'>
                                <div className="lg:col-2 md:col-3 col-3 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Appelation</label>
                                    <Dropdown value={selectAppelation} options={choixPresc} onChange={onAppelationChange} name="titre" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder="" />
                                    {verfChamp.nom ? <small id="username2-help" className="p-error block">champ vide !</small> : null}
                                </div>
                                <div className="lg:col-10 md:col-9 col-9 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom*</label>
                                    <InputText id="username2" value={props.infoClient.nom} aria-describedby="username2-help" className={verfChamp.nom ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='nom' onChange={onInfoClient} />
                                    {verfChamp.nom ? <small id="username2-help" className="p-error block">champ vide !</small> : null}
                                </div>

                            </div>
                            <div className='grid px-4'>
                                <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Phone 1</label>
                                    <InputNumber inputId="withoutgrouping" value={props.infoClient.phone1} name="phone1" onValueChange={onInfoClient} mode="decimal" useGrouping={false} />
                                </div>
                                <div className="lg:col-6 col-12 field my-0  flex flex-column ">
                                    <label htmlFor="username2" className="label-input-sm">Phone 2</label>
                                    <InputNumber inputId="withoutgrouping" value={props.infoClient.phone2} name="phone2" onValueChange={onInfoClient} mode="decimal" useGrouping={false} />
                                </div>
                                <div className="col-12 lg:col-6 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Mobile</label>
                                    <InputMask mask='099 99 999 99' name='mobile' onChange={onInfoClient} className="form-input-css-tamby" />
                                </div>
                                <div className="col-12 lg:col-12 field my-0 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Adresse</label>
                                    <InputText id="username2" value={props.infoClient.adresse} name="adresse" aria-describedby="username2-help" className="form-input-css-tamby" onChange={onInfoClient} />
                                </div>
                            </div>
                    </form>
                  {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{fontWeight:'bold'}}>Veuillez entrer la critère pour la recherche - Code ou Nom </small></center>  : null} 
                    <div className='flex mt-3 mr-4 justify-content-end '>
                        <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {
                            
                            if ( props.infoClient.code_presc=="" &&  props.infoClient.nom=="" && props.infoClient.phone1=="" && props.infoClient.phone2=="" && props.infoClient.mobile=="" && props.infoClient.adresse=="" && props.infoClient.titre=="" ) {
                                setverfChamp(true)
                            }
                            else{
                                setverfChamp(false)
                                RechercheloadData()
                            }
                        }} />

                    </div>
                </div>
            </Dialog>
        </div>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import ListeExamen from './ListeExamen';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function AjoutExamen(props) {


    
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoajoutExamen, setinfoajoutExamen] = useState({ num_arriv: '', date_arriv: '', donne: null });
    // ****************************ATO ABY NY ZAVATRA NATAOKO AMNAZY**********************************************  
    const [infoExamen, setinfoExamen] = useState([{ lib_examen: '', code_tarif: '', quantite: '', montant: '', type_examen: '' }]);
    let Nouveau = { lib_examen: '', code_tarif: '', quantite: '', montant: '', type_examen: '' };

    let handleChange = (i, name, valeur) => {
        let newFormExamen = [...infoExamen];
        newFormExamen[i][name] = valeur;   
        setinfoExamen(newFormExamen);        
    }
    
    let ajoutFormulaire = () => {
        setinfoExamen([...infoExamen, Nouveau]);
    }

    let supprimFormulaire = (i) => {
        let newFormExamen = [...infoExamen];
        newFormExamen.splice(i, 1);
        setinfoExamen(newFormExamen);
    }


    // **************************************************************************  

    const [verfChamp, setverfChamp] = useState(false);
    const onVide = () => {
        setinfoajoutExamen({ num_arriv: '', date_arriv: '', donne:null });
        setinfoExamen([{ lib_examen: '', code_tarif: '', quantite: '', montant: '', type_examen: '' }])
    }

   
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
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
        onVide()
        setverfChamp(false);

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
                <h4 className='mb-1'>Ajout examen de <i style={{ fontWeight: '800', color: 'black'  }} >{props.data.nom}({'Tarif :' + props.data.type_pat + ', ID :' + props.data.id_patient})</i> </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    const onSub = async () => { //Ajout de donnees vers Laravel
        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertExamenJour', { num_arriv: props.data.numero, date_arriv:  props.data.date_arr, donne: infoExamen })
            .then(res => {
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onHide('displayBasic2');
                    onVide();
                }, 600)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }


    return (
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button tooltip='Ajout examen' label='' icon={PrimeIcons.PLUS} tooltipOptions={{ position: 'top' }} value="Ajout" className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-9 md:col-10 col-11 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby ml-5" >
                        <h3 className='m-1' htmlFor="">Numéro d'arrivée : <u style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold', fontSize: '1.4rem' }}> {props.data.numero}</u></h3>
                        <h3 className='m-1' htmlFor="">Date d'arrivée : <u style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {props.data.date_arr}</u></h3>
                        <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau formulaire' label='Nouveau' tooltipOptions={{ 'position': 'top' }} className='mr-2 p-button-secondary ml-4 my-3 p-2' onClick={() => ajoutFormulaire()} />
                        {infoExamen.map((element, index) => (<div className='flex flex-column justify-content-center' key={index}>
                            <h4 className='m-1 ml-4'>Examen n° {index + 1} </h4>
                            <div className='grid px-4' >
                                <div className="col-3  field my-0  flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Libellé</label>
                                    <InputText id="username2" value={element.lib_examen} aria-describedby="username2-help" className='form-input-css-tamby' name='lib_examen' readOnly />
                                </div>

                                <div className="col-2 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Code tarif</label>
                                    <InputText id="username2" value={element.code_tarif} aria-describedby="username2-help" className='form-input-css-tamby' name='code_tarif' readOnly />
                                </div>
                                <div className="col-1 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">quantite</label>
                                    <InputText id="username2" value={element.quantite} aria-describedby="username2-help" className="form-input-css-tamby" name='quantite' readOnly />
                                </div>
                                <div className="col-2 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Montant</label>
                                    <InputText id="username2" value={element.montant} aria-describedby="username2-help" className="form-input-css-tamby" name='montant' readOnly />
                                </div>
                                <div className="col-2 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Type</label>
                                    <InputText id="username2" value={element.type_examen} aria-describedby="username2-help" className="form-input-css-tamby" name='type_examen' readOnly />
                                </div>
                                <div className="col-2 mt-5 field flex flex-row">
                                    <ListeExamen url={props.url} type_pat={props.type_pat} handleChange={handleChange} index={index} />
                                    {index ?
                                        <Button icon={PrimeIcons.TRASH} tooltip='Nouveau' className='mr-2 p- p-button-danger' onClick={() => { supprimFormulaire(index) }} />
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                        ))}

                    </div>
                    {verfChamp ? <center><label id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Examen manquante !  </label></center> : null}
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-info ' label={charge.chajoute ? 'Enregistrement en cours...' : 'Enregistrer'}
                            onClick={() => {
                                let verf=0;
                                for (let i = 0; i < infoExamen.length; i++) {
                                    if (infoExamen[i].code_tarif != "") {
                                        setverfChamp(false);
                                       verf=1;
                                    } else {
                                        verf=0
                                        setverfChamp(true);
                                        break;
                                    }
                                }
                                if (verf==1) {
                                    onSub()
                                } 
                            }} />
                    </div>
                </Dialog>
            </div >
        </div >
    )
}

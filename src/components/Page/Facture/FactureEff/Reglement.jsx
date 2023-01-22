import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'

import { InputNumber } from 'primereact/inputnumber'
import ChoixReglement from '../../Facture/FactureNon/ChoixReglement';
import moment from 'moment/moment';
import ChangementTarif from '../../Facture/FactureNon/ChoixReglement';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import ReactToPrint from 'react-to-print'
import FormatF from '../FormatF';

export default function RFacture(props) {

    const { format } = FormatF();

    const [blockedPanel, setBlockedPanel] = useState(true);
    const [printDesact, setprintDesact] = useState(true)



    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }

    //Declaration useSatate
    //Chargement de données
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [charge, setCharge] = useState(false);
    const [listReglement, setlistReglement] = useState([
        {
            num_fact: "",
            montant: "",
            reglement: "",
            rib: "",
            date_reglement: "",
            type_rglmt: ""
        }
    ]);
    const [infoFacture, setinfoFacture] = useState({
        num_facture: "",
        date_examen: "",
        montant_net: "",
        client: "",
        patient: "",
        status: "",
        remise: null,
        pec: "",
        montant_patient: "",
        montant_patient_regle: "",
        reste_patient: "",
        montant_pec: "",
        montant_pec_regle: "",
        reste_pec: "",
        reste: ""
    });

    const [resteVerf, setresteVerf] = useState('0')
    const [typePC, settypePC] = useState({ pat: true, cli: false })
    const [montantPatient, setmontantPatient] = useState(0)
    const [verfChamp, setverfChamp] = useState({ nom_presc: false, nom_cli: false });
    const [aujourd, setaujourd] = useState();

    const onVide = () => {

        setinfoFacture({
            num_facture: "",
            date_examen: "",
            montant_net: "",
            client: "",
            patient: "",
            status: "",
            remise: null,
            pec: "",
            montant_patient: "",
            montant_patient_regle: "",
            reste_patient: "",
            montant_pec: "",
            montant_pec_regle: "",
            reste_pec: "",
            reste: ""
        })
    }

    const mienregsitrerMtPatient = (mt) => {
        setmontantPatient(mt);
    }
    const calculMtPatient = (e) => {
        let v2 = e.target.value;
        let v1 = montantPatient;
        let s = v1 - v2;
        // setinfoFacture({ ...infoFacture, montant_patient: format(s, 2, " "), montantreglement: e.target.value });
        setinfoFacture({ ...infoFacture, montantRestPatient: format(s, 2, " "), montantreglement: e.target.value });
        setresteVerf('1');
        // console.log(infoFacture.montantRestPatient);
    }





    const loadData = async (num_facture) => {

        await axios.get(props.url + `getInfoPatientReglementFacture/${num_facture}`)
            .then(
                (results) => {
                    setinfoFacture(results.data);
                    setTimeout(() => {
                        loadReglemnt(num_facture);
                    }, 200)
                }
            );
    }
    const loadReglemnt = async (num_facture) => {

        await axios.get(props.url + `getListReglementFacture/${num_facture}`)
            .then(
                (results) => {
                    setlistReglement(results.data);
                    setBlockedPanel(false);
                    console.log(results.data)
                }
            );
    }


    const chargementData = () => {
        setBlockedPanel(true);
        let num_facture = (props.data.num_fact).split('/');
        let conv_num_f = num_facture[0] + '-' + num_facture[1] + '-' + num_facture[2];
        // setCharge(true);
        setTimeout(() => {
            loadData(conv_num_f);
        }, 300)
    }

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    /**Style css */


    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('top');
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
        onVide();
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    const renderHeader = (name) => {
        let jr = moment(aujourd);
        return (
            <div>
                <center>
                    <h3 className='mb-1'>Facture n° {infoFacture.num_facture}, Saisie reglement</h3>
                </center>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <h3 className='m-3'></h3>
        </div>
    )

    const onVerfeCh = () => {
        if (infoFacture.type == 'L2') {
            if (infoFacture.code_presc == '') {
                setverfChamp({ nom_presc: true, nom_cli: false })
            } else {
                console.log('first')
                onInsertFacture();
            }
        } else {
            if (infoFacture.code_presc == '' && infoFacture.code_cli == '') {
                setverfChamp({ nom_presc: true, nom_cli: true })
            }
            if (infoFacture.code_cli == '' && infoFacture.code_presc != '') {
                setverfChamp({ nom_presc: false, nom_cli: true })
            }
            if (infoFacture.code_cli != '' && infoFacture.code_presc == '') {
                setverfChamp({ nom_presc: true, nom_cli: false })
            }
            if (infoFacture.code_cli != '' && infoFacture.code_presc != '') {
                onInsertFacture();
            }
        }
    }



    const onInsertFacture = async () => {

        setchargeV({ chupdate: true });
        await axios.post(props.url + 'insertFacture', infoFacture)
            .then(res => {
                notificationAction(res.data.etat, 'Facture ', res.data.message);//message avy @back
                setchargeV({ chupdate: false });
                setverfChamp({ nom_presc: false, nom_cli: false })
                setTimeout(() => {
                    onHide('displayBasic2');
                    props.changecharge(1);
                }, 600)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setchargeV({ chupdate: false });
            });
    }

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 mr-2 p-button-info ' tooltip='Ajout facture' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className="lg:col-10 col-10 md:col-11 sm:col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <div className="ml-4 mr-4 style-modal-tamby" >
                        <div className="grid h-full">
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset style={{ backgroundColor: 'white' }} >
                                    <div className="card">
                                        <div className="p-fluid  formgrid grid">

                                            <div className="field   lg:col-4 md:col-4 col:12 my-1 flex flex-column">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                        {/* <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                            <label htmlFor="username2" style={{ fontWeight: '500' }} className="label-input-sm">N° Facture</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.num_facture} style={{ border: '1px solid grey' }} readOnly />
                                                        </div> */}
                                                        <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                            <label className="label-input-sm">Date Examen</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.date_examen} s readOnly />
                                                        </div>
                                                        <div className='flex lg:flex-row md:flex-column justify-content-between flex-column col-12 p-0'>
                                                            <div className="field   lg:col-7 md:col-12 col:12 m-0 p-0">
                                                                <label style={{ fontWeight: '500' }} className="label-input-sm">Montant Net	 </label>
                                                                <InputText id="username2" aria-describedby="username2-help" style={{ border: '1px solid grey' }} value={format(infoFacture.montant_net, 2, " ")} readOnly />
                                                            </div>
                                                            <div className="field   lg:col-4 md:col-12 col:12 m-0 p-0">
                                                                <label htmlFor="username2" style={{ fontWeight: '500' }} className="label-input-sm">Status</label>
                                                                <InputText id="username2" aria-describedby="username2-help" n style={{ border: '1px solid grey' }} value={infoFacture.status} readOnly />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* NUMERO ARRIVE */}
                                            <div className="field   lg:col-3 md:col-4 col:12 my-1 flex flex-column">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field   lg:col-12 md:col-12 sm:col:12 m-0 p-0">
                                                        <label htmlFor="username2" className="label-input-sm">N° arriv </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={props.data.numero} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 sm:col:12 m-0 p-0 ">
                                                        <label htmlFor="username2" className="label-input-sm">Date arriv</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={props.data.date_arr} readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PATIENT CLIENT */}
                                            <div className="field   lg:col-5 md:col-4 col:12 my-1 flex flex-column">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className='flex lg:flex-row md:flex-column justify-content-between flex-column col-12 p-0'>
                                                        <div className="field   lg:col-8 md:col-8 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">Patient</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.patient} readOnly />
                                                        </div>
                                                        <div className="field   lg:col-3 md:col-4 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">Type Client</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='patient' value={props.data.type_patient} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                        <label htmlFor="username2" className="label-input-sm">Client</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.client} readOnly />
                                                    </div>

                                                </div>
                                            </div>

                                            {/* REGLEMENT */}
                                            <div className="field   lg:col-12 md:col-12 col:12  flex flex-column pl-4 m-0" style={{ border: '1px solid #f3f3f3', backgroundColor: '#F7F7F5' }}>
                                                <div className="p-fluid  formgrid grid">

                                                    {/* MONTANT A REGLER */}
                                                    <div className="field   lg:col-4 md:col-4 sm:col:6 col:6 my-1 flex flex-column">
                                                        <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0 flex flex-row justify-content-between align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Montant à régler par le patient :</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '180px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.montant_patient, 2, " ")} readOnly />
                                                        </div>
                                                        <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-between align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Montant prise en charge	 :</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '180px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.montant_pec, 2, " ")} readOnly />
                                                        </div>
                                                    </div>

                                                    {/* MONTANT REGLE */}
                                                    <div className="field   lg:col-5 md:col-4 sm:col:6 col:6 my-1 flex flex-column">
                                                        <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0 flex flex-row justify-content-evenly align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Montant Reglé  Patient:</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '180px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.montant_patient_regle, 2, " ")} readOnly />
                                                        </div>
                                                        <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-evenly align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Montant Reglé  Client:</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '180px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.montant_pec_regle, 2, " ")} readOnly />
                                                        </div>
                                                    </div>

                                                    {/* RESTE  */}
                                                    <div className="field   lg:col-3 md:col-4 col:12 my-1 flex flex-column">
                                                        <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0 flex flex-row justify-content-between align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Reste  Patient:</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '170px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.reste_patient, 2, " ")} readOnly />
                                                        </div>
                                                        <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-between align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }} >Reste  Client:</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '170px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.reste_pec, 2, " ")} readOnly />
                                                        </div>
                                                        <hr className='col-12' />
                                                        <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-between align-items-center" >
                                                            <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '700' }} >Reste  :</label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '170px', border: '1px solid #2a2b2c' }} name='patient' value={format(infoFacture.reste, 2, " ")} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <center style={{ fontWeight: '600' }} >en Ar</center>
                                            </div>
                                        </div>
                                    </div>

                                </Fieldset>
                            </div>
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column ">
                                <div className="grid h-full justify-content-evenly">
                                    <div className="field   lg:col-4 md:col-8 sm:col-12 col-12 my-1 flex flex-column">
                                        <Fieldset legend="Reglement">
                                            <div className="card ">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">

                                                        <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-row justify-content-between  align-items-center">
                                                            <label htmlFor="username2" className="label-input-sm">Réglement fait par :</label>
                                                            <div className='m-1 flex flex-row align-items-center mb-3'>
                                                                <div className='m-0 align-items-center'>
                                                                    <label htmlFor="">Patient</label>
                                                                    <RadioButton checked={typePC.pat} name='a' className='ml-2' onChange={() => { settypePC({ pat: true, cli: false }) }} />
                                                                </div>
                                                                <div className='m-0 ml-5 align-items-center'>
                                                                    <label htmlFor="">Client</label>
                                                                    <RadioButton checked={typePC.cli} name='a' className='ml-2' onChange={() => { settypePC({ pat: false, cli: true }) }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-row justify-content-between  align-items-center">
                                                            <label htmlFor="username2" className="label-input-sm">Type Reglement : </label>
                                                            <div className='m-1 flex flex-row align-items-center '>
                                                                <InputText id="username2" aria-describedby="username2-help" style={{ width: '190px' }} name='code_cli' value={infoFacture.nomreglement} readOnly />
                                                                <ChoixReglement url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} />
                                                            </div>
                                                        </div>

                                                        <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-row lg:justify-content-between align-items-center">
                                                            <label htmlFor="username2" className="label-input-sm">Montant : </label>
                                                            <InputNumber id="username2" aria-describedby="username2-help" name='montantreglement' style={{ width: '70%' }} value={infoFacture.montantreglement} min={0} max={montantPatient}
                                                                onValueChange={(e) => { calculMtPatient(e) }}
                                                            />
                                                        </div>
                                                        <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-row lg:justify-content-between align-items-center">
                                                            <label htmlFor="username2" className="label-input-sm mr-2">N° Chèque	: </label>
                                                            <InputText id="username2" aria-describedby="username2-help" style={{ width: '70%' }} name='rib' value={infoFacture.rib} onChange={(e) => { setinfoFacture({ ...infoFacture, rib: (e.target.value).toUpperCase() }) }} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Fieldset>
                                    </div>



                                    <div className="field   lg:col-12 md:col-9 col:9 my-1 flex flex-column">
                                        <Fieldset legend="Historique reglement" className='montant' style={{ backgroundColor: 'rgb(241 242 243 / 81%)' }} >
                                            <DataTable value={listReglement} scrollable scrollHeight="350px" loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun resultat !"} style={{ fontSize: '0.98em' }} >
                                                <Column field='num_fact' header={'N° Fact'}></Column>
                                                <Column field={'montant'} header={'Montant'} ></Column>
                                                <Column field={'reglement'} header="Reglement"></Column>
                                                <Column field='rib' header="RIB"></Column>
                                                <Column field='date_reglement' header="Date"></Column>
                                                <Column field='type_rglmt' header="Type"></Column>
                                            </DataTable>
                                        </Fieldset>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr />
                    </div>
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-success ' tooltip="Valider l'examen" style={{ cursor: 'pointer' }} label={chargeV.chupdate ? 'Veuillez attendez...' : 'Valider'}
                            onClick={() => {
                                onVerfeCh()
                            }} />
                        <ReactToPrint trigger={() =>
                            <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-5 ' label={'Imprimer'} disabled={printDesact} />
                        } content={() => document.getElementById("scan")} />
                    </div>
                </BlockUI>
            </Dialog >
        </>
    )
}

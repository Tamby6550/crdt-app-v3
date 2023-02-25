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
import moment from 'moment/moment';
import ChangementTarif from '../PatientNonFact/ChangementTarif';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import ChoixClient from '../PatientNonFact/ChoixClient'
import ChoixPrescr from '../PatientNonFact/ChoixPrescr';
import ReactToPrint from 'react-to-print'
import ChoixReglement from '../PatientNonFact/ChoixReglement';
import { RadioButton } from 'primereact/radiobutton';
import Modifier from './Modifier';
import FormatF from '../FormatF';
import Impression from './Impression';


export default function ModifReglement(props) {

    const [blockedPanel, setBlockedPanel] = useState(true);

    const [listReglement, setlistReglement] = useState([
        {
            num_fact: null,
            montant: null,
            reglement: null,
            rib: null,
            date_reglement: null,
            type_rglmt: null
        }
    ]);
    const [charge, setCharge] = useState(false);
    const [chargepec, setChargepec] = useState(false);
    const { format } = FormatF();
    const [typePC, settypePC] = useState({ pat: false, cli: false })
    const [dataReglement, setdataReglement] = useState({
        num_facture: '',
        reglement_id: '0',
        nomreglement: '',
        type_reglmnt: '',
        montantreglement: '0',
        rib: null,
        num_arriv: '',
        date_arriv: ''
    })

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }

    const bddialogReglement = (msg) => {
        return (
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <h4> {msg} </h4>
            </div>
        )
    }
    const bodyConfirme = () => {
        return (
            <div>
                <label className='m-2'>Prise en charge : <strong className='m-1'>{infoFacture.pec}%</strong> </label> <hr />
                <label className='m-2'>Remise : <strong className='m-1'>{infoFacture.remise}%</strong> </label> <hr />
            </div>
        );
    }

    const onVerfeCh = () => {

        const accept = () => {
            onModifReglement();
        }
        const reject = () => {
            // onVideReglement();
            return null;
        }
        confirmDialog({
            message: bodyConfirme,
            header: '',
            icon: 'pi pi-exclamation-circle',
            acceptClassName: 'p-button-secondary',
            acceptLabel: 'Ok, modifier',
            rejectLabel: 'Annuler',
            accept,
            reject
        });
    }

    const montantReglementVerf = (e) => {
        if (!/^\d*$/.test(e.target.value)) {
            e.preventDefault();
            return;
        }

        setdataReglement({ ...dataReglement, montantreglement: e.target.value });
    };
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
                <center>
                    <h3 className='mb-1'>Modification</h3>
                </center>
                <hr />
            </div>
        );
    }
    /** Fin modal */


    const onModifReglement = async () => {

        // console.log(infoFacture);
        setChargepec(true);
        await axios.put(props.url + 'modifPecRemiseFacture', infoFacture)
            .then(res => {
                //message avy @back
                notificationAction(res.data.etat, 'Modification facture ', res.data.message);
                setChargepec(false);
                setTimeout(() => {
                    onHide('displayBasic2');
                }, 500)
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setChargepec(false);
            });
    }

    const loadReglemnt = async (num_facture) => {
        await axios.get(props.url + `getListReglementFacture/${num_facture}`)
            .then(
                (results) => {

                    setlistReglement(results.data);
                    setCharge(false);
                    console.log(results.data)
                }
            );
    }
    const chargementData = () => {
        let num_facture = (props.data.num_fact).split('/');
        let conv_num_f = num_facture[0] + '-' + num_facture[1] + '-' + num_facture[2];
        // setCharge(true);
        setTimeout(() => {
            //Rehefa misy reglement vao mandefa requette
            if (props.data.nbrergl != 0) {
                setCharge(true);
                loadReglemnt(conv_num_f);
            }
            setBlockedPanel(false);
        }, 300)
    }

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    {data.ajr == data.date_reglement ?
                        null
                        :
                        null
                    }
                    <Modifier data={data} url={props.url}
                        num_arriv={props.data.numero}
                        date_arriv={props.data.date_arr}
                        chargementData={chargementData}
                        patient_reste={data.reste_patient}
                        client_reste={data.reste_client}
                    />
                </div>
            </div>
        )
    }


    /**Resak Pec sy remise */
    const [verfChamp, setverfChamp] = useState(false)
    const [montantPatient, setmontantPatient] = useState(0)
    const [totalMt, settotalMt] = useState(0);
    const [infoExamen, setinfoExamen] = useState([{ num_facture: '', patient: '', type: '', code_cli: '', pec: '', remise: '', code_presc: '' }]);
    const [infoFacture, setinfoFacture] = useState({
        num_facture: '',
        pec: '0', remise: '0',
        num_arriv: '', date_arriv: '',
        montant_brute: '0', montant_net: '0',
        montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0',
        code_presc: '',
        code_cli: '',
        nom_client: '',
        nom_presc: '',
    });


    const mienregsitrerMtPatient = (mt) => {
        setmontantPatient(mt);
    }
    const max = (e) => {
        if (!/^\d*$/.test(e.target.value) || parseInt(e.target.value) > 100) {
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }

    }
    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }
    const calculeMis = (total, remise, pec, e) => {

        if (max(e)) {
            let mtremise = 0;
            let mtnet = 0;
            let mtpat = 0;
            let mtpec = 0;
            setinfoFacture({ ...infoFacture, montantreglement: '0', rib: '' });
            if (remise == '' || remise == "0") {
                mtremise = 0;
                mtnet = total;
                if (pec == '' || pec == "0") {
                    mtpat = mtnet;
                    mtpec = 0;
                } else if (pec != '' || pec != "0") {
                    let paye = poucentage(mtnet, pec);
                    let montant_pec = mtnet - paye;

                    mtpat = paye;
                    mtpec = montant_pec;
                }
            } else if (remise != '' || remise != "0") {
                let remises = poucentage(total, remise);
                mtremise = total - remises;
                mtnet = total - mtremise;
                if (pec == '' || pec == "0") {
                    mtpat = mtnet;
                    mtpec = 0;
                } else if (pec != '' || pec != "0") {
                    let paye = poucentage(mtnet, pec);
                    let montant_pec = mtnet - paye;
                    mtpat = paye;
                    mtpec = montant_pec;
                }
            }
            setTimeout(() => {
                mienregsitrerMtPatient(mtpat);
                setinfoFacture({
                    ...infoFacture, remise: remise, pec: pec, montant_brute: format(total, 2, " "), montant_remise: format(mtremise, 2, " "), montant_net: format(mtnet, 2, " "), montant_patient: format(mtpat, 2, " "), montant_pech: format(mtpec, 2, " ")
                });
            }, 100);
        }
    }
    const calcule = (total, datefact, pec_remise, res) => {
        let mtremise = 0;
        let mtnet = 0;
        let mtpat = 0;
        let mtpec = 0;

        if (pec_remise.remise == '' || pec_remise.remise == "0") {
            mtremise = 0;
            mtnet = total;
            if (pec_remise.pec == '' || pec_remise.pec == "0") {
                mtpat = mtnet;
                mtpec = 0;
            } else if (pec_remise.pec != '' || pec_remise.pec != "0") {
                let paye = poucentage(mtnet, pec_remise.pec);
                let montant_pec = mtnet - paye;

                mtpat = paye;
                mtpec = montant_pec;
            }
        } else if (pec_remise.remise != '' || pec_remise.remise != "0") {
            let remises = poucentage(total, pec_remise.remise);
            mtremise = total - remises;
            mtnet = total - mtremise;
            if (pec_remise.pec == '' || pec_remise.pec == "0") {
                mtpat = mtnet;
                mtpec = 0;
            } else if (pec_remise.pec != '' || pec_remise.pec != "0") {
                let paye = poucentage(mtnet, pec_remise.pec);
                let montant_pec = mtnet - paye;
                mtpat = paye;
                mtpec = montant_pec;
            }
        }
        setinfoFacture({
            ...infoFacture, num_facture: props.data.num_fact, date_facture: moment(datefact).format('DD/MM/YYYY'), pec: pec_remise.pec, remise: pec_remise.remise,
            num_arriv: props.data.numero, date_arriv: props.data.date_arr, patient: props.data.nom,
            montant_brute: format(total, 2, " "), montant_remise: format(mtremise, 2, " "), montant_net: format(mtnet, 2, " "),
            montant_patient: format(mtpat, 2, " "), montant_pech: format(mtpec, 2, " "),
            code_presc: res.code_presc,
            code_cli: res.code_client,
            nom_cli: res.nom_client,
            nom_presc: res.nom_presc,
        });

        mienregsitrerMtPatient(total);
    }
    const loadData = async () => {
        let dt = (props.data.date_arr).split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        await axios.get(props.url + `getPatientExamenFacture/${props.data.numero}&${cmpltDate}`)
            .then(
                (results) => {
                    // console.log(results.data.total)
                    setinfoExamen(results.data.all);
                    settotalMt(results.data.total)
                    calcule(results.data.total, results.data.datej, results.data.pec_rmise, results.data.pec_rmise);
                    setCharge(false);
                    chargementData()
                }
            );
    }


    const chargementDataPEC = () => {
        setBlockedPanel(true);
        setTimeout(() => {
            loadData()
        }, 500)
    }
    /**Resak Pec sy remise */

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltip='Modifier ' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementDataPEC() }} />

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className={props.data.nbrergl == 0 ? "lg:col-7 md:col-9 sm:col-12 col-12 p-0" : "lg:col-5 md:col-8 sm:col-12 col-12 p-0"} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    {props.data.nbrergl == 0 ?
                        <div className='col-12 grid px-5'>
                            <div className='col-12'>
                                <center> <u><h3 className='m-1'>Modification Prise en charge et Remise</h3></u> </center>
                            </div>
                            <div className='col-12  px-5' style={{alignItems:'center'}} >
                                <div className='grid flex flex-row justify-content-evenly'>
                                    <div className="field   lg:col-5 md:col-5 flex flex-column  col:12 m-0 p-0">
                                        <label htmlFor="username2" className="label-input-sm" style={{ color: infoFacture.type == 'L2' ? 'grey' : null }} >  P.en Charge(%)</label>
                                        <InputText id="username2" aria-describedby="username2-help" name='pec' value={infoFacture.pec}
                                            onChange={(e) => { calculeMis(totalMt, infoFacture.remise, e.target.value, e); }} disabled={props.data.type_patient == 'L2' ? true : false} />
                                    </div>
                                    <div className="field   lg:col-5 md:col-5  flex flex-column col:12 m-0 p-0">
                                        <label htmlFor="username2" className="label-input-sm">Remise(%)</label>
                                        <InputText id="username2" aria-describedby="username2-help" name='remise' value={infoFacture.remise}
                                            onChange={(e) => {
                                                calculeMis(totalMt, e.target.value, infoFacture.pec, e);
                                            }} />
                                    </div>

                                    <div className="field  lg:col-5 md:col-5  m-0  p-0">
                                        <label htmlFor="username2" className="label-input-sm mt-2">Prescripteur*</label>
                                        <div className='m-0 flex flex-row align-items-center  '>
                                            <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)',width:'100%' }} aria-describedby="username2-help" name='code_presc' value={infoFacture.nom_presc} className={"form-input-css-tamby"} readOnly />
                                            <ChoixPrescr setverfChamp={setverfChamp} url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} />
                                        </div>
                                    </div>

                                    <div className="field  lg:col-5 md:col-5  m-0 p-0">
                                        <label htmlFor="username2" className="label-input-sm mt-2">Client*</label>
                                        <div className='m-0 flex flex-row align-items-center  '>
                                            <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)',width:'100%' }} aria-describedby="username2-help" className={"form-input-css-tamby"} name='code_cli' value={infoFacture.nom_cli} readOnly />
                                            <ChoixClient setverfChamp={setverfChamp} url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} typeclient={props.data.type_patient} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <Fieldset legend="Facturation" className='montant ml-3 mr-3' style={{ backgroundColor: 'rgb(245 245 245)' }} >
                                <div className="card">
                                    <div className="p-fluid px-4 formgrid grid">
                                        <div className="field   lg:col-4 md:col-12 col:12">
                                            <label htmlFor="username2" className="label-input-sm">Total(Ar)</label>
                                            <InputText id="username2" aria-describedby="username2-help" style={{ backgroundColor: '#efefef' }} name='montant_brute' value={infoFacture.montant_brute} readOnly />
                                        </div>
                                        <div className="field   lg:col-4 md:col-12 col:12">
                                            <label htmlFor="username2" className="label-input-sm">Remise <i style={{ fontWeight: '700' }}> {infoFacture.remise}% </i> (en Ar) </label>
                                            <InputText id="username2" aria-describedby="username2-help" style={{ backgroundColor: '#efefef' }} name='montant_remise' value={infoFacture.montant_remise} readOnly />
                                        </div>
                                        <div className="field   lg:col-4 md:col-12 col:12">
                                            <label htmlFor="username2" className="label-input-sm">Montant net(Ar)</label>
                                            <InputText id="username2" aria-describedby="username2-help" name='montant_net' value={infoFacture.montant_net} style={{ fontWeight: '600', borderColor: '#a1a2a7', backgroundColor: '#efefef' }} readOnly />
                                        </div>
                                        <div className="field   lg:col-6 md:col-12 col:12">
                                            <label htmlFor="username2" className="label-input-sm" style={{ fontWeight: '600' }} >A Payer par le patient(Ar)</label>
                                            <InputText id="username2" aria-describedby="username2-help" name='montant_patient' style={{ fontWeight: '600', borderColor: '#383737', backgroundColor: '#efefef' }} value={infoFacture.montant_patient} readOnly />
                                        </div>
                                        <div className="field   lg:col-6 md:col-12 col:12">
                                            <label htmlFor="username2" className="label-input-sm" style={{ fontWeight: '600' }}>Montant pris en charge <i style={{ fontWeight: '700' }}> {infoFacture.pec}% </i> (Ar)</label>
                                            <InputText id="username2" aria-describedby="username2-help" name='montant_pech' style={{ fontWeight: '600', borderColor: '#383737', backgroundColor: '#efefef' }} value={infoFacture.montant_pech} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </Fieldset>
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset legend="Examens éffectuées">
                                    <DataTable value={infoExamen} scrollable scrollHeight="350px" responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun resultat !"} style={{ fontSize: '0.98em' }} >
                                        <Column field='lib_examen' header={'Libellé'} style={{ fontWeight: '600' }}></Column>
                                        <Column field={'code_tarif'} header={'Cotation'} style={{ fontWeight: '600' }}></Column>
                                        <Column field={'quantite'} header="Quantité" style={{ fontWeight: '600' }}></Column>
                                        <Column field='montant' header="P.U"></Column>
                                        <Column field='date_exam' header="Date examen"></Column>
                                        <Column field='type' header="Type"></Column>
                                    </DataTable>
                                </Fieldset>
                            </div>
                            <div className="field  col-12 ">
                                <center>
                                    <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary '
                                        style={{ cursor: 'pointer' }} label={chargepec ? '...' : 'Sauvegarder le modification'}
                                        onClick={() => {
                                            onVerfeCh()
                                        }} />
                                </center>
                                <hr className='m-1' />
                            </div>
                        </div>
                        :
                        <div className="field  col-12 m-0 p-0 ">
                            <center> <u><h3 className='m-1'>Modification Règlement </h3></u> </center>
                            <DataTable value={listReglement} scrollable scrollHeight={"270px"} loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun réglement "} style={{ fontSize: '0.98em' }} >
                                <Column field='num_fact' header={'N° Fact'}></Column>
                                <Column field={'montant'} header={'Montant'} ></Column>
                                <Column field={'reglement'} header="Reglement"></Column>
                                <Column field='rib' header="RIB"></Column>
                                <Column field='date_reglement' header="Date"></Column>
                                <Column field='type_rglmt' header="Type"></Column>
                                <Column header="Action" body={bodyBoutton} align={'left'}></Column>

                            </DataTable>
                        </div>
                    }
                </BlockUI>
            </Dialog >
        </>
    )
}

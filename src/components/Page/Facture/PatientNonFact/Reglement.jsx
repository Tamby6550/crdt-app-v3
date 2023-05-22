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
import Modifier from '../FactureNonReg/Modifier';
import ChoixReglement from '../PatientNonFact/ChoixReglement';
import moment from 'moment/moment';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormatF from '../FormatF';
import Impression from '../FactureNonReg/Impression';

export default function RFacture(props) {

    const { format } = FormatF();

    const [blockedPanel, setBlockedPanel] = useState(true);
    //Miverifie hoe nanao reglement ve izy alohany hiquité
    const [verffaireReglmnt, setverffaireReglmnt] = useState(false)

    const [verfbtnajoutreglmn, setverfbtnajoutreglmn] = useState(false)

    const [visible, setVisible] = useState(false);
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [isClicked, setisClicked] = useState(true);


    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }

    //Declaration useSatate
    //Chargement de données
    //Miverifie hoe vita 100% ve ny paymant anle reglement
    const [chRegle, setchRegle] = useState(false)
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
    const [dataReglement, setdataReglement] = useState({
        num_facture: props.num_fact,
        num_arriv: props.numero,
        date_arriv: props.date_arr,
        reglement_id: '0',
        nomreglement: '',
        type_reglmnt: 'P',
        montantreglement: '0',
        rib: null,
    })

    const [resteVerf, setresteVerf] = useState('0')
    const [typePC, settypePC] = useState({ pat: true, cli: false });
    const [montantPatient, setmontantPatient] = useState(0)
    const [verfChamp, setverfChamp] = useState({ nom_presc: false, nom_cli: false });
    const [aujourd, setaujourd] = useState();

    const onVideReglement = () => {
        settypePC({ pat: false, cli: false });
        setdataReglement({
            num_facture: props.num_fact,
            num_arriv: props.numero,
            date_arriv: props.date_arr,
            reglement_id: '0',
            nomreglement: '',
            type_reglmnt: '',
            montantreglement: '0',
            rib: ''
        });
    }
    const onVide = () => {
        settypePC({ pat: false, cli: false });
        setdataReglement({
            num_facture: '',
            reglement_id: '0',
            nomreglement: '',
            type_reglmnt: '',
            montantreglement: '0',
            rib: null
        });
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

    const bddialogReglement = (msg) => {
        return (
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <h4> {msg} </h4>
            </div>
        )
    }

    const montantReglementVerf = (e) => {
        if (!/^\d*\.?\d*$/.test(e.target.value)) {
            e.preventDefault();
            return;
        }
        if (dataReglement.type_reglmnt == 'P') {

            if (parseFloat(e.target.value) > parseFloat(infoFacture.reste_patient)) {
                e.preventDefault();
                confirmDialog({
                    message: bddialogReglement('Le reste de montant du patient est ' + format(infoFacture.reste_patient, 2, " ")),
                    header: '',
                    icon: 'pi pi-exclamation-circle',
                    acceptClassName: 'p-button-info',
                    acceptLabel: 'Ok',
                    rejectLabel: '_',
                });

                return;
            }
        } else {
            if (parseFloat(e.target.value) > parseFloat(infoFacture.reste_pec)) {
                e.preventDefault();

                confirmDialog({
                    message: bddialogReglement('Le reste de montant du client est  ' + format(infoFacture.reste_pec, 2, " ")),
                    header: '',
                    icon: 'pi pi-exclamation-circle',
                    acceptClassName: 'p-button-info',
                    acceptLabel: 'Ok',
                    rejectLabel: '_',
                });
                return;
            }
        }
        setdataReglement({ ...dataReglement, montantreglement: e.target.value });
    };


    const loadData = async (num_facture) => {

        await axios.get(props.url + `getInfoPatientReglementFacture/${num_facture}`)
            .then(
                (results) => {
                    setinfoFacture(results.data);
                    setdataReglement({ ...dataReglement, montantreglement: results.data.reste_patient });
                    setTimeout(() => {
                        loadReglemnt(num_facture);
                    }, 200)
                }
            );
    }
    const loadReglemnt = async (num_facture) => {
        setCharge(true)
        await axios.get(props.url + `getListReglementFacture/${num_facture}`)
            .then(
                (results) => {

                    setlistReglement(results.data);
                    setBlockedPanel(false);
                    setCharge(false)
                }
            );
    }


    const chargementData = () => {
        setBlockedPanel(true);
        setdataReglement({ ...dataReglement, num_arriv: props.numero, date_arriv: props.date_arr, num_facture: props.num_fact });
        let num_facture = (props.num_fact).split('/');
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
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(9 167 120)', border: '1px solid rgb(9 167 120)'
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
        if (chRegle || verffaireReglmnt) {
            props.changecharge('1');
        }
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

    const bodyConfirme = () => {
        return (
            <div style={{ fontSize: '1.1em' }}>
                <label className='m-2'>Reglement fait par : <strong className='m-1'>{dataReglement.type_reglmnt == 'P' ? 'Patient' : 'Client'}</strong> </label> <hr />
                <label className='m-2'>Type règlement : <strong className='m-1'>{dataReglement.nomreglement}</strong> </label> <hr />
                <label className='m-2'>Montant : <strong className='m-1'>{dataReglement.montantreglement} Ar </strong> </label><hr />
                <label className='m-2'>RIB : <strong className='m-1'>{dataReglement.rib == '' ? '-' : dataReglement.rib}</strong> </label>
            </div>
        );
    }

    const onVerfeCh = () => {
        if ((typePC.cli == false && typePC.pat == false) || dataReglement.type_reglmnt == '') {
            confirmDialog({
                message: bddialogReglement('Réglement fait par qui ?'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        }
        else if (dataReglement.reglement_id == '0' || dataReglement.nomreglement == '') {
            confirmDialog({
                message: bddialogReglement('Veuillez choisir le type de réglement'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        }
        else if ((parseInt(dataReglement.montantreglement) + 0) == 0 || dataReglement.montantreglement == '') {
            confirmDialog({
                message: bddialogReglement('Veuillez entrer le montant de réglement'),
                header: '',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-info',
                acceptLabel: 'Ok',
                rejectLabel: '_',
            });
        } else {
            setVisible(true)
            // const accept = () => {
            //     onInsertReglement();
            // }
            // const reject = () => {
            //     onVideReglement();
            //     return null;
            // }
            // confirmDialog({
            //     message: bodyConfirme,
            //     header: '',
            //     icon: 'pi pi-exclamation-circle',
            //     acceptClassName: 'p-button-success',
            //     acceptLabel: 'Confirmer et ajouter',
            //     rejectLabel: 'Annuler',
            //     accept,
            //     reject
            // });

        }

    }


    const onInsertReglement = async () => {
        setchargeV({ chupdate: true });

        setCharge(true);
        await axios.post(props.url + 'insertReglementFacture', dataReglement)
            .then(res => {
                //message avy @back
                notificationAction(res.data.etat, 'Règlement ', res.data.message);
                setchargeV({ chupdate: false });

                setTimeout(() => {
                    setVisible(false);
                    chargementData();

                    setverffaireReglmnt(true);

                    //Raha vita daholo ny reglement
                    if (res.data.regle == '1') {
                        setchRegle(true);
                        props.setredirege(2);
                    }

                }, 900)
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setCharge(false);
            });
    }



    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>

                    {data.ajr == data.date_reglement ?
                        <>
                            <Impression url={props.url} data={data}
                                charge={charge} patient={infoFacture.patient} client={infoFacture.client} format={format}
                                restPat={infoFacture.reste_patient}
                                restClie={infoFacture.reste_pec} />
                        </>
                        :
                        null
                    }
                    {/* <Modifier data={data} url={props.url}
                        num_arriv={props.numero}
                        date_arriv={props.date_arr}
                        chargementData={chargementData}
                        patient_reste={infoFacture.reste_patient}
                        client_reste={infoFacture.reste_pec}
                    /> */}
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (props.displayBasic) {
            chargementData()
        }
    }, [props.displayBasic]);

    const chargmm = () => {
        return (
            <div className=''>
                <center>

                    <ProgressSpinner />
                    <h1 style={{ color: 'white' }} className=' m-0 pr-4'>Chargement Saisie Reglement...</h1>
                </center>
            </div>
        )
    }



    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Dialog header="Confirmation" visible={visible} style={{ width: '15vw' }} onHide={() => setVisible(false)}>
                <div className='flex flex-column justify-content-center'>
                    <div style={{ fontSize: '1.1em' }}>
                        <label className='m-2'>Reglement fait par : <strong className='m-1'>{dataReglement.type_reglmnt == 'P' ? 'Patient' : 'Client'}</strong> </label> <hr />
                        <label className='m-2'>Type règlement : <strong className='m-1'>{dataReglement.nomreglement}</strong> </label> <hr />
                        <label className='m-2'>Montant : <strong className='m-1'>{dataReglement.montantreglement} Ar </strong> </label><hr />
                        <label className='m-2'>RIB : <strong className='m-1'>{dataReglement.rib == '' ? '-' : dataReglement.rib}</strong> </label>
                    </div> <br />

                    <div className='flex justify-content-between'>
                        <Button className='p-button-text p-button-info ' tooltip="Annuler" style={{ cursor: 'pointer' }} label={'Annuler'}
                            onClick={() => {
                                setVisible(false);
                            }} />
                        <Button icon={PrimeIcons.CHECK} className='p-button-sm p-button-success ' tooltip="Valider" style={{ cursor: 'pointer' }} label={chargeV.chupdate ? 'Patienter...' : 'Ok, Valider'}
                            onClick={() => {
                                if (isClicked) {
                                    setisClicked(false);
                                    onInsertReglement();
                                }
                            }} />
                    </div>
                </div>
            </Dialog>
            <BlockUI blocked={blockedPanel} template={chargmm} >
                <div className="ml-4 mr-4 style-modal-tamby"  >
                    <div className="grid h-full" >
                        <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                            <Fieldset style={{ backgroundColor: 'white', fontSize: '1.1em' }} >
                                <div className="card">
                                    <div className="p-fluid  formgrid grid">

                                        <div className="field   lg:col-4 md:col-4 col:12 my-1 flex flex-column">
                                            <div className="p-fluid px-4 formgrid grid">
                                                <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">

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
                                                    <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={props.numero} readOnly />
                                                </div>
                                                <div className="field   lg:col-12 md:col-12 sm:col:12 m-0 p-0 ">
                                                    <label htmlFor="username2" className="label-input-sm">Date arriv</label>
                                                    <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={props.date_arr} readOnly />
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
                                                        <InputText id="username2" aria-describedby="username2-help" name='patient' value={props.type_patient} readOnly />
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
                                                <div className="field   lg:col-4 md:col-4 sm:col:6 col:6 my-1 flex flex-column">
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
                                                <div className="field   lg:col-4 md:col-4 col:12 my-1 flex flex-column">
                                                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0 flex flex-row justify-content-evenly align-items-center" >
                                                        <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }}>Reste  Patient:</label>
                                                        <InputText id="username2" aria-describedby="username2-help" style={{ width: '170px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.reste_patient, 2, " ")} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-evenly align-items-center" >
                                                        <label htmlFor="username2" className="label-input-sm " style={{ fontWeight: '500' }} >Reste  Client:</label>
                                                        <InputText id="username2" aria-describedby="username2-help" style={{ width: '170px', border: '1px solid #939090' }} name='patient' value={format(infoFacture.reste_pec, 2, " ")} readOnly />
                                                    </div>
                                                    <hr className='col-12' />
                                                    <div className="field   lg:col-12 md:col-12 col:12 mt-2 p-0 flex flex-row justify-content-evenly align-items-center" >
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
                            <div className="p-fluid  formgrid grid justify-content-between ">
                                <div className="field   lg:col-4 md:col-12 sm:col-12 col-2 my-1 ">
                                    <Fieldset legend="Ajout Règlement" style={{ backgroundColor: '#d3d3d3' }} >
                                        <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column p-0 m-0">

                                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-row   align-items-center">
                                                <label htmlFor="username2" className="label-input-sm">Réglement fait par :</label>
                                                <div className='m-1 flex flex-row align-items-center mb-3 ml-5'>
                                                    <div className='m-0 align-items-center'>
                                                        <label htmlFor="">Patient</label>
                                                        <RadioButton checked={typePC.pat} name='a' className='ml-2'
                                                            onChange={() => {
                                                                if (infoFacture.reste_patient == '0' || infoFacture.reste == '0') {
                                                                    setverfbtnajoutreglmn(true);
                                                                    confirmDialog({
                                                                        message: bddialogReglement('Montant patient déjà réglé !'),
                                                                        header: '',
                                                                        icon: 'pi pi-exclamation-circle',
                                                                        acceptClassName: 'p-button-info',
                                                                        acceptLabel: 'Ok',
                                                                        rejectLabel: '_',
                                                                    });
                                                                } else {
                                                                    setverfbtnajoutreglmn(false);
                                                                }
                                                                settypePC({ pat: true, cli: false });
                                                                setdataReglement({ ...dataReglement, type_reglmnt: 'P', montantreglement: '0' });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='m-0 ml-5 align-items-center'>
                                                        <label htmlFor="">Client</label>
                                                        <RadioButton checked={typePC.cli} name='a' className='ml-2'
                                                            onChange={() => {
                                                                if (infoFacture.reste_pec == '0' || infoFacture.reste == '0') {
                                                                    setverfbtnajoutreglmn(true);
                                                                    confirmDialog({
                                                                        message: bddialogReglement('Montant client réglés !'),
                                                                        header: '',
                                                                        icon: 'pi pi-exclamation-circle',
                                                                        acceptClassName: 'p-button-info',
                                                                        acceptLabel: 'Ok',
                                                                        rejectLabel: '_',
                                                                    });
                                                                } else {
                                                                    setverfbtnajoutreglmn(false);
                                                                }
                                                                settypePC({ pat: false, cli: true });
                                                                setdataReglement({ ...dataReglement, type_reglmnt: 'C', montantreglement: '0' });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 flex flex-column  ">
                                                <hr className='m-0 mb-1 p-0' />
                                                <label htmlFor="username2" className="label-input-sm">Type Reglement : </label>
                                                <div className='m-1 flex flex-row align-items-center '>
                                                    <InputText id="username2" style={{ height: '25px' }} aria-describedby="username2-help" name='code_cli' value={dataReglement.nomreglement} readOnly />
                                                    <ChoixReglement url={props.url} reglement='ok' dataReglement={dataReglement} setdataReglement={setdataReglement} />
                                                </div>
                                            </div>

                                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-column ">
                                                <label htmlFor="username2" className="label-input-sm">Montant : </label>
                                                <InputText id="username2" aria-describedby="username2-help" name='montantreglement' style={{ height: '25px' }} value={dataReglement.montantreglement}
                                                    onChange={(e) => { montantReglementVerf(e) }}
                                                />
                                            </div>
                                            <div className="field lg:col-12 md:col-9 col:10 m-0 p-0 mt-2 flex flex-column">
                                                <label htmlFor="username2" className="label-input-sm mr-2">N° Chèque	: </label>
                                                <InputText id="username2" aria-describedby="username2-help" style={{ height: '25px' }} name='rib' value={dataReglement.rib} onChange={(e) => { setdataReglement({ ...dataReglement, rib: (e.target.value).toUpperCase() }) }} />
                                            </div>
                                        </div>
                                        <div className='flex mt-3 mr-4 justify-content-between '>
                                            <Button icon={PrimeIcons.TIMES} className='p-button-sm p-button-secondary mr-2 '
                                                tooltip="Fermer " tooltipOptions={{ position: 'top' }} style={{ cursor: 'pointer' }} label={'Fermer'} onClick={() => { props.onHide1('displayBasic') }}
                                            />

                                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-success '
                                                disabled={verfbtnajoutreglmn}
                                                tooltip="Ajouter reglement " tooltipOptions={{ position: 'top' }} style={{ cursor: 'pointer' }} label={charge ? '...' : 'Ajouter'}
                                                onClick={() => {
                                                    onVerfeCh()
                                                }} />

                                        </div>
                                    </Fieldset>
                                </div>
                                <div className="field   lg:col-8 md:col-12 col:12 my-1 flex flex-column pl-4">
                                    <Fieldset legend="Hisorique de dérnière règlement(s)" className='montant' style={{ backgroundColor: 'rgb(241 242 243 / 81%)' }} >
                                        <DataTable value={listReglement} scrollable scrollHeight="250px" loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun réglement "} style={{ fontSize: '0.98em' }} >
                                            <Column field='num_fact' header={'N° Fact'}></Column>
                                            <Column field={'montant'} header={'Montant'} ></Column>
                                            <Column field={'reglement'} header="Reglement"></Column>
                                            <Column field='rib' header="RIB"></Column>
                                            <Column field='date_reglement' header="Date"></Column>
                                            <Column field='type_rglmt' header="Type"></Column>
                                            <Column header="Action" body={bodyBoutton} align={'left'}></Column>

                                        </DataTable>
                                    </Fieldset>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                {/* <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-success ' tooltip="Valider l'examen" style={{ cursor: 'pointer' }} label={charge ? 'Veuillez attendez...' : 'Valider reglement'}
                            onClick={() => {
                                onVerfeCh()
                            }} />
                        <ReactToPrint trigger={() =>
                            <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-5 ' label={'Imprimer'} disabled={verffaireReglmnt} />
                        } content={() => document.getElementById("scan")} />
                    </div> */}
            </BlockUI>

        </>
    )
}

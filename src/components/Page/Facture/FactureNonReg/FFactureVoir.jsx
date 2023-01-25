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
import { InputNumber } from 'primereact/inputnumber'
import moment from 'moment/moment';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import ReactToPrint from 'react-to-print'

export default function FFactureVoir(props) {

    const [blockedPanel, setBlockedPanel] = useState(true);
    const [printDesact, setprintDesact] = useState(true)

    function numberV(value) {
        let numberValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
        return numberValue;
    }
    function format(valeur, decimal, separateur) {
        var deci = Math.round(Math.pow(10, decimal) * (Math.abs(valeur) - Math.floor(Math.abs(valeur))));
        var val = Math.floor(Math.abs(valeur));
        if ((decimal == 0) || (deci == Math.pow(10, decimal))) {
            val = Math.floor(Math.abs(valeur));
            deci = 0;
        }
        var val_format = val + "";
        var nb = val_format.length;
        for (var i = 1; i < 4; i++) {
            if (val >= Math.pow(10, (3 * i))) {
                val_format = val_format.substring(0, nb - (3 * i)) + separateur + val_format.substring(nb - (3 * i));
            }
        }
        if (decimal > 0) {
            var decim = "";
            for (var j = 0; j < (decimal - deci.toString().length); j++) {
                decim += "0";
            }
            deci = decim + deci.toString();
            val_format = val_format + "." + deci;
        }
        if (parseFloat(valeur) < 0) {
            val_format = "-" + val_format;
        }
        return val_format;
    }

    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }

    //Declaration useSatate
    //Chargement de données
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [charge, setCharge] = useState(false);
    const [infoExamen, setinfoExamen] = useState({ num_facture: '', patient: '', type: '', code_cli: '', pec: '', remise: '', code_presc: '' });
    const [infoFacture, setinfoFacture] = useState({
        num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
        reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
        code_cli: '', nom_cli: '', pec: '0', remise: '0', montantRestPresc: '0', montantRest: '0',
        code_presc: '', nom_presc: '',
        num_arriv: '', date_arriv: '',
        montant_brute: '0', montant_net: '0', status: '',
        montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0'
    });
    const [montantPatient, setmontantPatient] = useState(0)
    const [verfChamp, setverfChamp] = useState({ nom_presc: false, nom_cli: false });
    const [totalMt, settotalMt] = useState(0);
    const [aujourd, setaujourd] = useState();

    const onVide = () => {
        setinfoFacture({
            num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
            reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
            code_cli: '', nom_cli: '', pec: '0', remise: '0',
            code_presc: '', nom_presc: '', montantRest: '0', montantRest: '0',
            num_arriv: '', date_arriv: '',
            montant_brute: '0', montant_net: '0', status: '',
            montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0'
        })
    }

    const mienregsitrerMtPatient = (mt) => {
        setmontantPatient(mt);
    }
    const calculMtPatient = (e) => {
        let v2 = e.target.value;
        let v1 = montantPatient;
        let s = v1 - v2;
        // setinfoFacture({ ...infoFacture, montant_patient: format(s, 2, " "), montantreglementpat: e.target.value });
        setinfoFacture({ ...infoFacture, montantRestPatient: format(s, 2, " "), montantreglementpat: e.target.value });
        // console.log(infoFacture.montantRestPatient);
    }


    //Get List Examen
    const loadData = async (numero) => {
        let dt = (props.data.date_arr).split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        await axios.get(props.url + `getPatientExamenFacture/${numero}&${cmpltDate}`)
            .then(
                (results) => {
                    setinfoExamen(results.data.all);
                    settotalMt(results.data.total)
                    setaujourd(results.data.datej);
                    setBlockedPanel(false);
                    setCharge(false);
                }
            );
    }

    //Get List numfacture et tarif
    const loadDataFact = async () => {
        let numf = (props.data.num_fact).split('/');
        let cmpltFact = numf[0] + '-' + numf[1] + '-' + numf[2];
        setBlockedPanel(true);
        await axios.get(props.url + `getInfoPatientFacture/${cmpltFact}`)
            .then(
                (result) => {
                    setinfoFacture({
                        ...infoFacture,
                        num_facture: result.data.num_fact,
                        date_facture: props.data.date_facture,
                        patient: result.data.patient,
                        type: result.data.type_client,
                        nomreglement: result.data.reglemnt,
                        montantreglementpat: format(result.data.montant_patient_regle, 2, " "),
                        nom_cli: result.data.client,
                        pec: result.data.pec,
                        remise: result.data.remise,
                        nom_presc: result.data.presc,
                        num_arriv: result.data.num_arriv,
                        date_arriv: props.data.date_arr,
                        montant_brute: format(result.data.montant_brute, 2, " "),
                        montant_net: format(result.data.montant_net, 2, " "),
                        montant_patient: format(result.data.montant_patient, 2, " "),
                        montant_pech: format(result.data.montant_pec, 2, " "),
                        montantRestPatient: format(result.data.reste_patient, 2, " "),
                        montant_pec_regle: format(result.data.montant_pec_regle, 2, " "),
                        code_cli: result.data.code_cli, status: result.data.status,
                        montantRestPresc: format(result.data.reste_pec, 2, " "),
                        montantRest: format(result.data.reste, 2, " ")
                    });
                    console.log(result.data)
                    setTimeout(() => {
                        loadData(props.data.numero);
                    }, 900)
                }
            );
    }

    const chargementData = () => {
        setCharge(true);
        setinfoExamen([{ quantite: 'Chargement de données...' }]);
        setTimeout(() => {
            loadDataFact()
        }, 200)
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
        props.setrefreshData(1);
        onVide();
        setchargeV({ chupdate: false });
        setverfChamp({ nom_presc: false, nom_cli: false })

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
                    <h4 className='mb-1'>Information Facture  </h4>
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
            if (infoFacture.code_presc == '') {
                setverfChamp({ nom_presc: true, nom_cli: false })
            }
            if (infoFacture.code_cli == '') {
                setverfChamp({ nom_presc: false, nom_cli: true })
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
            <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-1 mr-2 p-button-info ' tooltip='Voir' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className="lg:col-11 md:col-11 sm:col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <div className="ml-4 mr-4 style-modal-tamby" >
                        <div className="grid h-full">
                            <div className="field   lg:col-4 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset legend="Facture" >
                                    <div className="card">
                                        <div className="p-fluid px-4 formgrid grid">
                                            <div className="field   lg:col-5 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Numéro Facture</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_facture' value={infoFacture.num_facture} readOnly />
                                                {/* {verfChamp.num_facture ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>
                                            <div className="field   lg:col-3 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">N° arrivée</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={infoFacture.num_arriv} readOnly />
                                                {/* {verfChamp.num_arriv ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>
                                            <div className="field   lg:col-4 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Date d'arrivée</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={infoFacture.date_arriv} readOnly />
                                                {/* {verfChamp.date_arriv ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>

                                        </div>
                                        <div className="card">
                                            <div className="p-fluid px-4 formgrid grid">
                                                <div className="field   lg:col-7 md:col-12 col:12">
                                                    <label htmlFor="username2" className="label-input-sm">Patient</label>
                                                    <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.patient} readOnly />
                                                    {/* {verfChamp.patient ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                                </div>

                                                <div className="field   lg:col-2 md:col-3 col:2">
                                                    <label htmlFor="username2" className="label-input-sm">Tarif</label>
                                                    <InputText id="username2" aria-describedby="username2-help" name='type' value={infoFacture.type} readOnly />
                                                    {/* {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}

                                                </div>
                                                <div className="field   lg:col-2 md:col-3 col:2">
                                                    {/* <ChangementTarif setrefreshData={props.changecharge} url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} setBlockedPanel={setBlockedPanel} loadData={loadDataFact} ancientarif={infoFacture.type} examen={infoExamen} id_patient={props.data.id_patient} num_arriv={props.data.numero} date_arriv={props.data.date_arr} /> */}
                                                </div>

                                                <div className="field   lg:col-10 md:col-10 col:10">
                                                    <label htmlFor="username2" className="label-input-sm">Client </label>
                                                    <InputText id="username2" aria-describedby="username2-help" name='code_cli' value={infoFacture.nom_cli} readOnly />
                                                    {/* {verfChamp.nom_cli ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                                </div>
                                                <div className="field   lg:col-2 md:col-2 col:2">
                                                    {/* <ChoixClient url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} typeclient={infoFacture.type} /> */}
                                                </div>
                                                <div className="field   lg:col-4 md:col-8 col:12">
                                                    <label htmlFor="username2" className="label-input-sm"  >  P.en Charge(%)</label>
                                                    <InputNumber id="username2" aria-describedby="username2-help" name='pec' min={0} max={100} value={infoFacture.pec} readOnly />
                                                </div>
                                                <div className="field   lg:col-4 md:col-8 col:12">
                                                    <label htmlFor="username2" className="label-input-sm">Remise(%)</label>
                                                    <InputNumber id="username2" aria-describedby="username2-help" name='remise' min={0} max={100} value={infoFacture.remise} readOnly />
                                                </div>
                                                <div className="field   lg:col-8 md:col-10 col:10">
                                                    <label htmlFor="username2" className="label-input-sm">Prescripteur*</label>
                                                    <InputText id="username2" aria-describedby="username2-help" name='code_presc' value={infoFacture.nom_presc} readOnly />
                                                    {/* {verfChamp.nom_presc ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                                </div>
                                                <div className="field   lg:col-2 md:col-2 col:2">
                                                    {/* <ChoixPrescr url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} /> */}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Fieldset>
                            </div>
                            <div className="field   lg:col-8 md:col-12 col:12 my-1 flex flex-column">
                                <div className="grid h-full">
                                    <div className="field   lg:col-6 md:col-12 col:12 my-1 flex flex-column">
                                        <Fieldset legend="Reglement">
                                            <div className="card">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field lg:col-10 md:col-10 col:10">
                                                        <label htmlFor="username2" className="label-input-sm">Reglement </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='code_cli' value={infoFacture.nomreglement} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-2 md:col-2 col:2">
                                                        {/* <ChoixReglement url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} /> */}
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <div className="p-fluid  formgrid grid">
                                                            <div className="field   lg:col-5 md:col-12 col:12">
                                                                <label htmlFor="username2" className="label-input-sm">Montant regle par patient</label>
                                                                <InputText id="username2" aria-describedby="username2-help" name='montantreglementpat' value={infoFacture.montantreglementpat} />
                                                                <label htmlFor="username2" className="label-input-sm">Reste a payer par le patient</label>
                                                                <InputText id="username2" aria-describedby="username2-help" name='montantreglementpat' value={infoFacture.montantRestPatient} />
                                                            </div>
                                                            <div className="field   lg:col-1 md:col-0 col:0">
                                                            <hr style={{ rotate: '90deg',width:'auto' }} />
                                                            </div>
                                                            <div className="field   lg:col-6 md:col-12 col:12">
                                                             
                                                                <label htmlFor="username2" className="label-input-sm">Montant regle par client</label>
                                                                <InputText id="username2" aria-describedby="username2-help" name='montantreglementpat' value={infoFacture.montant_pec_regle} />
                                                                <label htmlFor="username2" className="label-input-sm">Reste a payer par le client</label>
                                                                <InputText id="username2" aria-describedby="username2-help" name='montantreglementpat' value={infoFacture.montantRestPresc} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">N° Chèque	</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='rib' value={infoFacture.rib} onChange={(e) => { setinfoFacture({ ...infoFacture, rib: (e.target.value).toUpperCase() }) }} />
                                                    </div> */}


                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <hr />
                                                        <label htmlFor="username2" className="label-input-sm">Reste a payer	</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='rib' value={infoFacture.montantRest} readOnly />
                                                    </div>

                                                </div>
                                            </div>
                                        </Fieldset>
                                    </div>
                                    <div className="field   lg:col-6 md:col-12 col:12 my-1 flex flex-column">
                                        <Fieldset legend="Compte" className='montant'>
                                            <div className="card">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Total(en Ar)</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_brute' value={infoFacture.montant_brute} readOnly />
                                                    </div>
                                                    {/* <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Remise <i style={{ fontWeight: '700' }}> {infoFacture.remise}% </i> (en Ar) </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_remise' value={infoFacture.montant_remise} readOnly />
                                                    </div> */}
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">
                                                            Montant net(en Ar)
                                                            {infoFacture.remise != null ? ' ,avec remise ' + infoFacture.remise + ' %' : null}
                                                        </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_net' value={infoFacture.montant_net} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">A Payer par le patient(en Ar)</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_patient' style={{ fontWeight: '600', borderColor: 'grey' }} value={infoFacture.montant_patient} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Montant pris en charge <i style={{ fontWeight: '700' }}> {infoFacture.pec}% </i> (en Ar)</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_pech' style={{ fontWeight: '600', borderColor: 'grey' }} value={infoFacture.montant_pech} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </Fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="grid h-full">
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset legend="Examens éffectuées">
                                    <DataTable value={infoExamen} scrollable scrollHeight="350px" loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun resultat !"} style={{ fontSize: '0.98em' }} >
                                        <Column field='lib_examen' header={'Libellé'} style={{ fontWeight: '600' }}></Column>
                                        <Column field={'code_tarif'} header={'Cotation'} style={{ fontWeight: '600' }}></Column>
                                        <Column field={'quantite'} header="Quantité" style={{ fontWeight: '600' }}></Column>
                                        <Column field='montant' header="P.U"></Column>
                                        <Column field='date_exam' header="Date examen"></Column>
                                        <Column field='type' header="Type"></Column>
                                    </DataTable>
                                </Fieldset>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        <ReactToPrint trigger={() =>
                            <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-5 ' label={'Imprimer'} />
                        } content={() => document.getElementById("scan")} />
                    </div>
                </BlockUI>
            </Dialog >
        </>
    )
}

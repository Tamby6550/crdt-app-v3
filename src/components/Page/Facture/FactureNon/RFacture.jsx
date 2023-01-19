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
import ChoixReglement from './ChoixReglement';
import moment from 'moment/moment';
import ChangementTarif from './ChangementTarif';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import ChoixClient from './ChoixClient'
import ChoixPrescr from './ChoixPrescr';
import ReactToPrint from 'react-to-print'

export default function RFacture(props) {

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
        reglement_id: '0', nomreglement: '', montantreglement: '0', rib: '',
        code_cli: '', nom_cli: '', pec: '0', remise: '0',
        code_presc: '', nom_presc: '',
        num_arriv: '', date_arriv: '',
        montant_brute: '0', montant_net: '0',
        montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0'
    });

    const [tarifCh, settarifCh] = useState('')
    const [resteVerf, setresteVerf] = useState('0')
    const [montantPatient, setmontantPatient] = useState(0)
    const [verfChamp, setverfChamp] = useState({ nom_presc: false, nom_cli: false });
    const [totalMt, settotalMt] = useState(0);
    const [aujourd, setaujourd] = useState();

    const onVide = () => {

        setinfoFacture({
            num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
            reglement_id: '0', nomreglement: '', montantreglement: '0', rib: '',
            code_cli: '', nom_cli: '', pec: '0', remise: '0',
            code_presc: '', nom_presc: '',
            num_arriv: '', date_arriv: '',
            montant_brute: '0', montant_net: '0',
            montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0'
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



    useEffect(() => {
        setinfoFacture({ ...infoFacture, montantreglement: '0' });
    }, [infoFacture.pec, infoFacture.remise])

    //refa mis a jour ny input remise na pec
    const calculeMis = (total, remise, pec) => {

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
            setresteVerf('0')
            mienregsitrerMtPatient(mtpat);
            setinfoFacture({
                ...infoFacture, remise: remise, pec: pec, montant_brute: format(total, 2, " "), montant_remise: format(mtremise, 2, " "), montant_net: format(mtnet, 2, " "), montant_patient: format(mtpat, 2, " "), montant_pech: format(mtpec, 2, " ")
            });
        }, 100);
    }

    //eo @chargement de BD
    const calcule = (result, total, datefact) => {
        let mtremise = 0;
        let mtnet = 0;
        let mtpat = 0;
        let mtpec = 0;
        if (infoFacture.remise == '' || infoFacture.remise == "0") {
            mtremise = 0;
            mtnet = total;
        }

        if (infoFacture.pec == '' || infoFacture.pec == "0") {
            mtpat = total;
            mtpec = 0;
        }
        setinfoFacture({
            ...infoFacture, num_facture: result.data.num_facture, date_facture: moment(datefact).format('DD/MM/YYYY'), pec: '', remise: '',
            num_arriv: props.data.numero, date_arriv: props.data.date_arr, patient: props.data.nom, type: result.data.tarif,
            montant_brute: format(total, 2, " "), montant_remise: format(mtremise, 2, " "), montant_net: format(total, 2, " "), montant_patient: format(total, 2, " "), montant_pech: format(mtpec, 2, " ")
        });

        mienregsitrerMtPatient(total);
    }



    //Get List Examen
    const loadData = async (numero, datearr, result) => {

        await axios.get(props.url + `getPatientExamenFacture/${numero}&${datearr}`)
            .then(
                (results) => {
                    setinfoExamen(results.data.all);
                    settotalMt(results.data.total)
                    setaujourd(results.data.datej);
                    setBlockedPanel(false);
                    calcule(result, results.data.total, results.data.datej)
                    setCharge(false);
                }
            );
    }

    //Get List numfacture et tarif
    const loadDataFact = async () => {
        let dt = (props.data.date_arr).split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        setBlockedPanel(true);
        await axios.get(props.url + `getPageFacture/${props.data.numero}&${cmpltDate}`)
            .then(
                (result) => {
                    setTimeout(() => {
                        loadData(props.data.numero, cmpltDate, result);
                    }, 500)
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
        settarifCh('');
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
                    <h4 className='mb-1'>Facture n° {infoFacture.num_facture} , Aujourd'hui : {infoFacture.date_facture}  </h4>
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
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 mr-2 p-button-info ' tooltip='Ajout facture' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className="lg:col-8 md:col-11 sm:col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <div className="ml-4 mr-4 style-modal-tamby" >
                        <div className="grid h-full">
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset legend="Info Patient" >
                                    <div className="card">
                                        <div className="p-fluid px-4 formgrid grid">
                                            {/* <div className="field   lg:col-2 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Numéro Facture*</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_facture' value={infoFacture.num_facture} readOnly />
                                            </div> */}
                                            <div className="field   lg:col-1 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">N° arrivée*</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={infoFacture.num_arriv} readOnly />
                                                {/* {verfChamp.num_arriv ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>
                                            <div className="field   lg:col-2 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Date arriv*</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='num_arriv' value={infoFacture.date_arriv} readOnly />
                                                {/* {verfChamp.date_arriv ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>

                                            {/* </div>
                                        <div className="card">
                                            <div className="p-fluid px-4 formgrid grid"> */}
                                            <div className="field   lg:col-3 md:col-12 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Patient*</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='patient' value={infoFacture.patient} readOnly />
                                                {/* {verfChamp.patient ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                            </div>

                                            <div className="field   lg:col-1 md:col-2 col:2">
                                                <label htmlFor="username2" className="label-input-sm">Tarif*</label>
                                                {
                                                    // tarifCh==''? 
                                                    // <InputText id="username2" aria-describedby="username2-help" name='type' value={infoFacture.type} readOnly />
                                                    // : 
                                                    // <InputText id="username2" aria-describedby="username2-help" name='type' value={tarifCh} readOnly />
                                                }
                                                {/* {verfChamp.type ? <small id="username2-help" className="p-error block">Champ vide !</small> : null} */}
                                                <InputText id="username2" aria-describedby="username2-help" name='type' value={infoFacture.type} readOnly />

                                            </div>
                                            <div className="field   lg:col-1 md:col-3 col:2">
                                                <ChangementTarif settarifCh={settarifCh} setrefreshData={props.changecharge} url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} setBlockedPanel={setBlockedPanel} loadData={loadDataFact} ancientarif={infoFacture.type} examen={infoExamen} id_patient={props.data.id_patient} num_arriv={props.data.numero} date_arriv={props.data.date_arr} />
                                            </div>
                                            <div className="field   lg:col-3 md:col-10 col:10">
                                                <label htmlFor="username2" className="label-input-sm">Prescripteur*</label>
                                                <InputText id="username2" aria-describedby="username2-help" name='code_presc' value={infoFacture.nom_presc} readOnly />
                                                {verfChamp.nom_presc ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="field   lg:col-1 md:col-2 col:2">
                                                <ChoixPrescr url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} />
                                            </div>
                                            <div className="field   lg:col-3 md:col-10 col:10">
                                                <label htmlFor="username2" className="label-input-sm">Client* </label>
                                                <InputText id="username2" aria-describedby="username2-help" name='code_cli' value={infoFacture.nom_cli} readOnly />
                                                {verfChamp.nom_cli ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="field   lg:col-1 md:col-2 col:2">
                                                <ChoixClient url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} typeclient={infoFacture.type} />
                                            </div>


                                            <div className="field   lg:col-2 md:col-8 col:12">
                                                <label htmlFor="username2" className="label-input-sm" style={{ color: infoFacture.type == 'L2' ? 'grey' : null }} >  P.en Charge(%)</label>
                                                <InputNumber id="username2" aria-describedby="username2-help" name='pec' min={0} max={100} value={infoFacture.pec} onValueChange={(e) => { calculeMis(totalMt, infoFacture.remise, e.target.value); }} disabled={infoFacture.type == 'L2' ? true : false} />
                                            </div>
                                            <div className="field   lg:col-2 md:col-8 col:12">
                                                <label htmlFor="username2" className="label-input-sm">Remise(%)</label>
                                                <InputNumber id="username2" aria-describedby="username2-help" name='remise' min={0} max={100} value={infoFacture.remise} onValueChange={(e) => { calculeMis(totalMt, e.target.value, infoFacture.pec); }} />
                                            </div>
                                        </div>
                                    </div>

                                </Fieldset>
                            </div>
                          
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
                          
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column ">
                                <div className="grid h-full justify-content-evenly">
                                    <div className="field   lg:col-4 md:col-12 col:12 my-1 flex flex-column">
                                        <Fieldset legend="Reglement">
                                            <div className="card">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field lg:col-10 md:col-10 col:10">
                                                        <label htmlFor="username2" className="label-input-sm">Reglement </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='code_cli' value={infoFacture.nomreglement} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-2 md:col-2 col:2">
                                                        <ChoixReglement url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Montant</label>
                                                        <InputNumber id="username2" aria-describedby="username2-help" name='montantreglement' value={infoFacture.montantreglement} min={0} max={montantPatient}
                                                            onValueChange={(e) => { calculMtPatient(e) }}
                                                        />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">N° Chèque	</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='rib' value={infoFacture.rib} onChange={(e) => { setinfoFacture({ ...infoFacture, rib: (e.target.value).toUpperCase() }) }} />
                                                    </div>

                                                    {infoFacture.montantRestPatient == '0' || infoFacture.montantRestPatient == infoFacture.montant_patient || resteVerf == '0' ? null :
                                                        <div className="field   lg:col-12 md:col-12 col:12">
                                                            <hr />
                                                            <label htmlFor="username2" className="label-input-sm">Reste a payer par le patient	</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='rib' value={infoFacture.montantRestPatient} readOnly />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </Fieldset>
                                    </div>
                                    <div className="field   lg:col-5 md:col-12 col:12 my-1 flex flex-column">
                                        <Fieldset legend="Facturation" className='montant' style={{backgroundColor:'#dfdfdfcf'}} >
                                            <div className="card">
                                                <div className="p-fluid px-4 formgrid grid">
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Total(en Ar)</label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_brute' value={infoFacture.montant_brute} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Remise <i style={{ fontWeight: '700' }}> {infoFacture.remise}% </i> (en Ar) </label>
                                                        <InputText id="username2" aria-describedby="username2-help" name='montant_remise' value={infoFacture.montant_remise} readOnly />
                                                    </div>
                                                    <div className="field   lg:col-12 md:col-12 col:12">
                                                        <label htmlFor="username2" className="label-input-sm">Montant net(en Ar)</label>
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

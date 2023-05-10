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
import Reglement from './Reglement'

export default function RFacture(props) {

    const [blockedPanel, setBlockedPanel] = useState(true);
    const [redirege, setredirege] = useState(0);

    const [visible, setVisible] = useState(false);

    const [isClicked, setisClicked] = useState(true);

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
        code_cli: 'AAAA', nom_cli: '-', pec: '0', remise: '0',
        ref_carte: '',
        code_presc: 'AAAA', nom_presc: 'Dr   -',
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
            ref_carte: '',
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
        setinfoFacture({ ...infoFacture, montantRestPatient: format(s, 2, " "), montantreglement: e.target.value });
        setresteVerf('1');
    }



    useEffect(() => {
        setinfoFacture({ ...infoFacture, montantreglement: '0' });
    }, [infoFacture.pec, infoFacture.remise])


    const max = (e) => {
        if (!/^\d*$/.test(e.target.value) || parseInt(e.target.value) > 100) {
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }

    }
    //refa mis a jour ny input remise na pec
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
                setresteVerf('0')
                mienregsitrerMtPatient(mtpat);
                setinfoFacture({
                    ...infoFacture, remise: remise, pec: pec, montant_brute: format(total, 2, " "), montant_remise: format(mtremise, 2, " "), montant_net: format(mtnet, 2, " "), montant_patient: format(mtpat, 2, " "), montant_pech: format(mtpec, 2, " ")
                });
            }, 100);
        }
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
            ...infoFacture, num_facture: result.data.num_facture, date_facture: moment(datefact).format('DD/MM/YYYY'), pec: '0', remise: '0',
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
                    settotalMt(results.data.total);
                    setaujourd(results.data.datej);
                    setBlockedPanel(false);
                    calcule(result, results.data.total, results.data.datej)
                    setCharge(false);
                    // console.log(results.data.all)
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
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('top');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const dialogFuncMap1 = {
        'displayBasic': setDisplayBasic,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onClick1 = (name, position) => {
        dialogFuncMap1[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        // props.setrefreshData(1);
        onVide();
        settarifCh('');
        setchargeV({ chupdate: false });
        setverfChamp({ nom_presc: false, nom_cli: false })
    }
    const onHide1 = (name) => {
        dialogFuncMap1[`${name}`](false);
        onHide('displayBasic2');
        props.setActiveIndex(redirege);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => { onHide(name); onHide1(name) }} className="p-button-text" />
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

    /* Modal */


    const renderH = (name) => {
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
            <div className='flex flex-column justify-content-center align-items-center m-0 '>
                <label >Prise en charge : <strong>{infoFacture.pec}%</strong>  <br /> Remise :  <strong>{infoFacture.remise}%</strong>  </label>
            </div>
        )
    }

    const onVerfeCh = () => {
        if (infoFacture.type == 'L2') {
            if (infoFacture.code_presc == '') {
                setverfChamp({ nom_presc: true, nom_cli: false });

                alert('Verifer votre champ !')
            } else {
                const accept = () => {
                    onInsertFacture();
                }
                const reject = () => {
                    return null;
                }
                confirmDialog({
                    message: bodyConfirme,
                    header: '',
                    icon: 'pi pi-exclamation-circle',
                    acceptClassName: 'p-button-success',
                    acceptLabel: 'Ok , Valider',
                    rejectLabel: 'Annuler',
                    accept,
                    reject
                });

            }
        } else {
            if (infoFacture.code_presc == '' && infoFacture.code_cli == '') {
                setverfChamp({ nom_presc: true, nom_cli: true })
                alert('Verifer votre champ !')

            }
            if (infoFacture.code_cli == '' && infoFacture.code_presc != '') {
                setverfChamp({ nom_presc: false, nom_cli: true })
                alert('Verifer votre champ !')

            }
            if (infoFacture.code_cli != '' && infoFacture.code_presc == '') {
                setverfChamp({ nom_presc: true, nom_cli: false })
                alert('Verifer votre champ !')

            }
            if (infoFacture.code_cli != '' && infoFacture.code_presc != '') {
                const accept = () => {
                    onInsertFacture();
                }
                const reject = () => {
                    return null;
                }
                confirmDialog({
                    message: bodyConfirme,
                    header: '',
                    icon: 'pi pi-exclamation-circle',
                    acceptClassName: 'p-button-success',
                    acceptLabel: 'Ok , Valider',
                    rejectLabel: 'Annuler',
                    accept,
                    reject
                });
            }
        }
    }



    const onInsertFacture = async () => {

        setchargeV({ chupdate: true });
        setisClicked(false);
        await axios.post(props.url + 'insertFacture', infoFacture)
            .then(res => {
                notificationAction(res.data.etat, 'Facture ', res.data.message);//message avy @back
                setchargeV({ chupdate: false });
                setverfChamp({ nom_presc: false, nom_cli: false })
                setTimeout(() => {
                    setVisible(false);
                    onClick1('displayBasic');
                    setredirege(1);
                }, 600)
                // console.log(res.data)
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setchargeV({ chupdate: false });
            });
    }


    //    useEffect(() => {
    //      console.log(infoFacture)
    //    }, [infoFacture.nom_presc,infoFacture.nom_cli])


    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 mr-2 p-button-info ' tooltip='Ajout facture' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            {/* Saisie Reglement */}
            <Dialog header={renderH('displayBasic')} maximizable visible={displayBasic} className="lg:col-10 col-10 md:col-11 sm:col-12 p-0" footer={renderFooter('displayBasic')} onHide={() => onHide1('displayBasic')}  >
                <Reglement setredirege={setredirege} onHide1={onHide1} displayBasic={displayBasic} url={props.url} type_patient={infoFacture.type} numero={infoFacture.num_arriv} date_arr={infoFacture.date_arriv} num_fact={infoFacture.num_facture} changecharge={props.changecharge} />
            </Dialog>
            {/* Saisie Reglement */}

            <Dialog header={renderHeader('displayBasic2')} maximizable visible={displayBasic2} className="lg:col-8 md:col-11 sm:col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <Dialog header="Confirmation" visible={visible} style={{ width: '15vw' }} onHide={() => setVisible(false)}>
                    <div className='flex flex-column justify-content-center'>
                        <label style={{ textAlign: 'center', fontSize: '1.2em' }} >
                            Prise en charge : <strong>{infoFacture.pec}%</strong>
                            <br /> Remise :  <strong>{infoFacture.remise}%</strong>
                        </label> <br />

                        <div className='flex justify-content-between'>

                            <Button className='p-button-text p-button-info ' tooltip="Annuler" style={{ cursor: 'pointer' }} label={'Annuler'}
                                onClick={() => {
                                    setVisible(false);
                                }} />
                            <Button icon={PrimeIcons.CHECK} className='p-button-sm p-button-success ' tooltip="Valider" style={{ cursor: 'pointer' }} label={chargeV.chupdate?'Patienter...' : 'Ok, Valider'}
                                onClick={() => {
                                    if (isClicked) {
                                        onInsertFacture();
                                    }
                                }} />
                        </div>
                    </div>

                </Dialog>
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <div className="ml-4 mr-4 style-modal-tamby" >
                        <div className="grid h-full">
                            <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                                <Fieldset legend="Info Patient" >
                                    <div className="card">
                                        <div className="p-fluid px-4 formgrid grid">
                                            <div className="field   lg:col-6 md:col-4 col:12 my-1 flex flex-column m-0 p-0">
                                                <div className="p-fluid px-4 formgrid grid">

                                                    <div className='flex lg:flex-row md:flex-column justify-content-between flex-column col-12 p-0'>
                                                        <div className="field   lg:col-4 md:col-12 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">N° arriv *</label>
                                                            <InputText id="username2" style={{ backgroundColor: '#efefef' }} aria-describedby="username2-help" name='num_arriv' value={infoFacture.num_arriv} readOnly />
                                                        </div>
                                                        <div className="field   lg:col-6 md:col-12 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">Date arriv*</label>
                                                            <InputText id="username2" style={{ backgroundColor: '#efefef' }} aria-describedby="username2-help" name='num_arriv' value={infoFacture.date_arriv} readOnly />
                                                        </div>
                                                    </div>

                                                    <div className='flex lg:flex-row md:flex-column justify-content-between flex-column col-12 m-0 p-0'>
                                                        <div className="field   lg:col-8 md:col-8 col:8">
                                                            <label htmlFor="username2" className="label-input-sm">Patient*</label>
                                                            <InputText id="username2" style={{ backgroundColor: '#efefef' }} aria-describedby="username2-help" name='patient' value={infoFacture.patient} readOnly />
                                                        </div>

                                                        <div className="field   lg:col-4 md:col-8 col:4  p-0">
                                                            <label htmlFor="username2" className="label-input-sm mt-2">Tarif*</label>
                                                            <div className='m-0 flex flex-row align-items-center  '>
                                                                <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)' }} aria-describedby="username2-help" name='type' value={infoFacture.type} readOnly />
                                                                <ChangementTarif settarifCh={settarifCh} setrefreshData={props.changecharge} url={props.url} infoFacture={infoFacture} setinfoFacture={setinfoFacture} setBlockedPanel={setBlockedPanel} loadData={loadDataFact} ancientarif={infoFacture.type} examen={infoExamen} id_patient={props.data.id_patient} num_arriv={props.data.numero} date_arriv={props.data.date_arr} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='flex lg:flex-row md:flex-column justify-content-initial flex-column col-12 m-0 p-0' >
                                                        <div className="field   lg:col-4 md:col-6  col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm" style={{ color: infoFacture.type == 'L2' ? 'grey' : null }} >  P.en Charge(%)</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='pec' value={infoFacture.pec}
                                                                onChange={(e) => { calculeMis(totalMt, infoFacture.remise, e.target.value, e); }} disabled={infoFacture.type == 'L2' ? true : false} />
                                                        </div>
                                                        <div className="field   lg:col-4 md:col-6 ml-4 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">Remise(%)</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='remise' value={infoFacture.remise}
                                                                onChange={(e) => {
                                                                    calculeMis(totalMt, e.target.value, infoFacture.pec, e);
                                                                }} />
                                                        </div>
                                                        <div className="field   lg:col-4 md:col-6 ml-4 col:12 m-0 p-0">
                                                            <label htmlFor="username2" className="label-input-sm">Référence Carte</label>
                                                            <InputText id="username2" aria-describedby="username2-help" name='ref_carte' value={infoFacture.ref_carte}
                                                                onChange={(e) => {
                                                                    setinfoFacture({ ...infoFacture, ref_carte: e.target.value })
                                                                }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="field   lg:col-6 md:col-4 col:12 my-1 flex flex-column m-0 p-0">
                                                <div className="p-fluid px-4 formgrid grid ml-3">

                                                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                        <label htmlFor="username2" className="label-input-sm">Prescripteur*</label>
                                                        <div className='m-0 flex flex-row align-items-center  '>
                                                            <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)' }} aria-describedby="username2-help" name='code_presc' value={infoFacture.nom_presc} className={verfChamp.nom_presc ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} readOnly />
                                                            <ChoixPrescr url={props.url} infoFacture={infoFacture} setverfChamp={setverfChamp} verfChamp={verfChamp} setinfoFacture={setinfoFacture} />
                                                            {verfChamp.nom_presc ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                                        </div>
                                                    </div>

                                                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                                                        <label htmlFor="username2" className="label-input-sm mt-2">Client* </label>
                                                        <div className='m-0 flex flex-row align-items-center  '>
                                                            <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)' }} aria-describedby="username2-help" className={verfChamp.nom_cli ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='code_cli' value={infoFacture.nom_cli} readOnly />
                                                            <ChoixClient url={props.url} infoFacture={infoFacture} setverfChamp={setverfChamp} verfChamp={verfChamp} setinfoFacture={setinfoFacture} typeclient={infoFacture.type} />
                                                            {verfChamp.nom_cli ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                                        </div>
                                                    </div>
                                                </div>
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
                                    <div className="field   lg:col-8 md:col-12 col:12 my-1 flex flex-column">
                                        <Fieldset legend="Facturation" className='montant' style={{ backgroundColor: '#EEEEEE' }} >
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
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr />
                    </div>
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-success ' tooltip="Valider l'examen" style={{ cursor: 'pointer' }} label={chargeV.chupdate ? 'Veuillez attendez...' : 'Valider'}
                            onClick={() => {
                                setVisible(true)
                                // if ((infoFacture.pec == '0' || infoFacture.pec == '' || infoFacture.pec == null) && (infoFacture.remise == '0' || infoFacture.remise == '' || infoFacture.remise == null)) {
                                // onVerfeCh()

                                // } else {
                                //     onVerfeCh();
                                // }

                            }} />
                    </div>
                </BlockUI>
            </Dialog >
        </>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import ReactToPrint from 'react-to-print'
import { Dialog } from 'primereact/dialog';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios'
import "../../../../facture.css";
import moment from 'moment/moment';

export default function ImpressionFact(props) {

    const editorRef = useRef(null);
    let reportTemplateRef = useRef();



    const stylebtnRetourner = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 153 46 / 85%)', border: '1px solid rgb(211 152 47 / 63%)'
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


    const renderHeader = (name) => {
        return (
            <div>
                <center>
                    <h4>Fact</h4>
                </center>
            </div>
        );
    }
    /** Fin modal */

    const [blockedPanel, setBlockedPanel] = useState(true);

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


    //Declaration useSatate
    //Chargement de données
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [charge, setCharge] = useState(false);
    const [infoExamen, setinfoExamen] = useState([{ num_facture: '', patient: '', type: '', code_cli: '', pec: '', remise: '', code_presc: '' }]);
    const [infoFacture, setinfoFacture] = useState({
        num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
        reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
        code_cli: '', nom_cli: '', pec: '0', remise: '0', montantRestPresc: '0', montantRest: '0',
        code_presc: '', nom_presc: '',
        num_arriv: '', date_arriv: '',
        montant_brute: '0', montant_net: '0', status: '',
        montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0',net_pec:'vide',net_mtnet:'vide'
    });
    const [totalMt, settotalMt] = useState(0);
    const [aujourd, setaujourd] = useState(moment().format('LL'));

    const onVide = () => {
        setinfoFacture({
            num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
            reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
            code_cli: '', nom_cli: '', pec: '0', remise: '0',
            code_presc: '', nom_presc: '', montantRest: '0', montantRest: '0',
            num_arriv: '', date_arriv: '',
            montant_brute: '0', montant_net: '0', status: '',
            montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0',net_pec:'',
            net_mtnet:'',
        })
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
                   
                    setBlockedPanel(false);
                    setCharge(false);
                }
            );
    }

    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }

    //Get List numfacture et tarif
    const loadDataFact = async () => {
        let numf = (props.data.num_fact).split('/');
        let cmpltFact = numf[0] + '-' + numf[1] + '-' + numf[2];
        setBlockedPanel(true);
        await axios.get(props.url + `getInfoPatientFacture/${cmpltFact}`)
            .then(
                (result) => {
                   
                    let remises_ =  poucentage(result.data.montant_brute, result.data.remise);
                    let mtremises = result.data.montant_brute - remises_;
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
                        montant_remise: format(mtremises, 2, " "),
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
                        montantRest: format(result.data.reste, 2, " "),
                        net_pec:result.data.net_pec,
                        net_mtnet:result.data.net_mtnet
                    });
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

    return (
        <>
            <Button icon={PrimeIcons.PRINT} tooltip='Imprimer' className='p-buttom-sm p-1 mr-2 ' style={stylebtnRetourner} tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-7 md:col-10 col-11 p-0" onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <div className='recu-imprime' style={{ padding: '50px', border: '1px solid black' }} >
                        <div
                            className="facture w-100 h-100"
                            ref={(el) => (reportTemplateRef = el)}
                        >
                            <table
                                width="100%"
                                height="130"
                                border="0"
                                align="center"
                                class="Input1"
                            >
                                <tr class="Input1">
                                    <td width="317" height="23">
                                        <strong>RC:</strong>
                                        <br />
                                        <strong>STAT:</strong>
                                        <br />
                                        <strong>CIF:</strong> <br />
                                        <strong>NIF:</strong>
                                    </td>

                                    <td width="425">
                                        <p>Antananarivo,le {aujourd}</p>
                                        <p>&nbsp;</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="26" colspan="3">
                                        <table width="269" border="0" align="center">
                                            <tr>
                                                <td width="251">
                                                    <span class="Style4">FACTURE N° : {infoFacture.num_facture}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <p>&nbsp;</p>
                                    </td>
                                </tr>
                            </table>
                            <table width="99%" border="0" align="center" class="table">
                                <tr>
                                    <td class="table" width="26%">
                                        <strong>PATIENT(E):</strong>
                                    </td>
                                    <td colspan="2" class="table">
                                        {infoFacture.patient}
                                    </td>
                                </tr>
                                <tr>
                                    <td rowspan="4" class="table">
                                        <strong>PRISE EN CHARGE : </strong>
                                    </td>
                                    <td width="74%" rowspan="4" class="table">
                                        {infoFacture.nom_cli==null? '-' :infoFacture.nom_cli} ({infoFacture.pec}%)
                                    </td>
                                </tr>
                            </table>
                            <br />
                            <br />
                            <table width="99%" border="0" align="center" class="table">
                                <tr>
                                    <td class="table" width="84%">
                                        <span class="Style4">EXAMENS</span>
                                    </td>
                                    <td align="center" class="table" width="16%">
                                        <span class="Style4">MONTANT</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="input1" height="26">
                                        {infoExamen.map((element) => (
                                            <div>
                                                {element.lib_examen === null ||
                                                    element.lib_examen === "" ||
                                                    element.lib_examen === undefined ? (
                                                    <>vide</>
                                                ) : (
                                                    <>{element.lib_examen}</>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                    <td align="right" class="table" style={{ padding: "0px" }}>
                                        {infoExamen.map((element) => (
                                            <div style={{ width: "100%", borderTop: "0.3px solid black" , padding:'2px'}}>
                                                {element.montant === null ||
                                                    element.montant === "" ||
                                                    element.montant === undefined ? (
                                                    <>vide</>
                                                ) : (
                                                    <>{ format(element.montant,2,' ')}</>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                </tr>

                                <tr>
                                    <td height="26" class="Style3 table">
                                        <div align="right" class="Style5">
                                            TOTAL BRUT:
                                        </div>
                                    </td>
                                    <td align="right" class="table">
                                        {infoFacture.montant_brute}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="26" class="Style3 table">
                                        <div align="right" class="Style5">
                                            REMISE {infoFacture.remise}%:
                                        </div>
                                    </td>
                                    <td align="right" class="table">
                                        {infoFacture.montant_remise}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="26" class="Style3 table">
                                        <div align="right" class="Style5">
                                            MONTANT NET:
                                        </div>
                                    </td>
                                    <td align="right" class="table">
                                        {infoFacture.montant_net}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="28" class="Style3 table">
                                        <div align="right" class="Style5">
                                            PAYE PAR LE(LA)PATIENT(E):{" "}
                                        </div>
                                    </td>
                                    <td align="right" class="table">
                                        {infoFacture.montant_patient}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="28" class="Style3 table">
                                        <div align="right" class="Style5">
                                            MONTANT DE LA PRISE EN CHARGE:
                                        </div>
                                    </td>
                                    <td align="right" class="table">
                                        {infoFacture.montant_pech}
                                    </td>
                                </tr>
                            </table>
                            <br />
                            <br />
                            <table width="719" border="0" align="center">
                                <tr>
                                    <td width="428">
                                        Arrêté la présente facture à la somme de: <br />
                                        {infoFacture.montant_pech=='0.00'?infoFacture.net_mtnet :infoFacture.net_pec}  
                                    </td>
                                    <td width="199">&nbsp;</td>
                                    <td width="78">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="38">&nbsp;</td>
                                    <td>
                                        <div align="left">Pour le CRDT </div>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <center className='mt-3 '>
                        <ReactToPrint
                            trigger={() => <button className="p-button p-3" >Imprimer</button>}
                            content={() => reportTemplateRef}
                        />
                    </center>
                </BlockUI>
            </Dialog>

        </>
    )
}

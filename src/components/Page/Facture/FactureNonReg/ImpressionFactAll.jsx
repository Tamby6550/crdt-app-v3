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
import { NumberToLetter } from 'convertir-nombre-lettre';
import { Toast } from 'primereact/toast';

export default function ImpressionFact(props) {

    moment.locale('fr', {
        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact: true,
        weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[Aujourd’hui à] LT',
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'dans %s',
            past: 'il y a %s',
            s: 'quelques secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse: /PD|MD/,
        isPM: function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem: function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4  // Used to determine first week of the year.
        }
    });

    moment.locale('fr');


    const editorRef = useRef(null);
    let reportTemplateRef = useRef();



    const stylebtnRetourner = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 153 46 / 85%)', border: '1px solid rgb(211 152 47 / 63%)'
    };

    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    // console.log(props.data)
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
                    {blockedPanel ? <h2>Veuillez patienter pendant le chargement des données...</h2> : <h4>Facture</h4>}
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
    const [infoFacture, setinfoFacture] = useState([{
        num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
        reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
        code_cli: '', nom_cli: '', pec: '0', remise: '0', montantRestPresc: '0', montantRest: '0',
        code_presc: '', nom_presc: '',
        ref_carte: '',
        num_arriv: '', date_arriv: '',
        montant_brute: '0', montant_net: '0', status: '',
        montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0', net_pec: 'vide', net_mtnet: 'vide',
        rc: '', stat: '', cif: '', nif: '',
    }]);
    const [DataAllFactExamen, setDataAllFactExamen] = useState([
        {
            num_facture: "",
            date_facture: "",
            ref_carte: null,
            patient: "",
            type: "",
            nomreglement: "",
            montantreglementpat: "",
            nom_cli: "-",
            pec: "",
            remise: "0",
            montant_remise: "0.00",
            nom_presc: "",
            num_arriv: "",
            date_arriv: "",
            montant_brute: "",
            montant_net: "",
            montant_patient: "",
            montant_pech: "",
            montantRestPatient: "",
            montant_pec_regle: "",
            code_cli: "",
            status: "",
            montantRestPresc: "",
            montantRest: "",
            net_pec: "",
            net_mtnet: "",
            rc: null,
            stat: null,
            cif: null,
            nif: null,
            examenResult: [
                {
                    num_fact: "",
                    lib_examen: "",
                    code_tarif: "",
                    quantite: "",
                    montant: "",
                    date_examen: "",
                    type: "",
                    rejet: "",
                    num_arriv: "",
                    date_arriv: "",
                    cr_name: "",
                    date_exam: "",
                }
            ],
            totalMt: "",
        },
    ]);
    const [totalMt, settotalMt] = useState(0);
    const [aujourd, setaujourd] = useState(moment().format('LL'));

    const onVide = () => {
        setinfoFacture({
            num_facture: '', date_facture: '', patient: '', type: '', type_facture: '0',
            reglement_id: '0', nomreglement: '', montantreglementpat: '0', rib: '',
            code_cli: '', nom_cli: '', pec: '0', remise: '0',
            code_presc: '', nom_presc: '', montantRest: '0', montantRest: '0',
            num_arriv: '', date_arriv: '',
            ref_carte: '',
            montant_brute: '0', montant_net: '0', status: '',
            montant_patient: '0', montant_pech: '0', montant_remise: '0', montantRestPatient: '0', montant_pec_regle: '0', net_pec: '',
            net_mtnet: '', rc: '', stat: '', cif: '', nif: ''
        })
    }



    //Get List Examen
    const loadDataExamen = async (numero, date_ariv_) => {
        let dt = date_ariv_.split('/');
        let cmpltDate = dt[0] + '-' + dt[1] + '-' + dt[2];
        const response = await axios.get(props.url + `getPatientExamenFacture/${numero}&${cmpltDate}`);
        return {
            all: response.data.all,
            total: response.data.total,
        };
    };

    function poucentage(val, pourc) {
        let res = (val * pourc) / 100;
        res = val - res;
        return res;
    }


    //Get List numfacture et tarif
    const loadDataFact = async (num_fact_, date_arriv_) => {
        try {
            let numf = num_fact_.split('/');
            let cmpltFact = numf[0] + '-' + numf[1] + '-' + numf[2];

            const response = await axios.get(props.url + `getInfoPatientFacture/${cmpltFact}`);

            let remises_ = poucentage(response.data.montant_brute, response.data.remise);
            let mtremises = response.data.montant_brute - remises_;

            // Appel de loadDataExamen avec les paramètres appropriés
            const examenResult = await loadDataExamen(response.data.num_arriv, date_arriv_);

            const result = {
                num_facture: response.data.num_fact,
                date_facture: response.data.date_fact,
                ref_carte: response.data.ref_carte,
                patient: response.data.patient,
                type: response.data.type_client,
                nomreglement: response.data.reglemnt,
                montantreglementpat: format(response.data.montant_patient_regle, 2, " "),
                nom_cli: response.data.client,
                pec: response.data.pec,
                remise: response.data.remise,
                montant_remise: format(mtremises, 2, " "),
                nom_presc: response.data.presc,
                num_arriv: response.data.num_arriv,
                date_arriv: date_arriv_,
                montant_brute: format(response.data.montant_brute, 2, " "),
                montant_net: format(response.data.montant_net, 2, " "),
                montant_patient: format(response.data.montant_patient, 2, " "),
                montant_pech: format(response.data.montant_pec, 2, " "),
                montantRestPatient: format(response.data.reste_patient, 2, " "),
                montant_pec_regle: format(response.data.montant_pec_regle, 2, " "),
                code_cli: response.data.code_cli,
                status: response.data.status,
                montantRestPresc: format(response.data.reste_pec, 2, " "),
                montantRest: format(response.data.reste, 2, " "),
                net_pec: response.data.net_pec,
                net_mtnet: response.data.net_mtnet,
                rc: response.data.rc,
                stat: response.data.stat,
                cif: response.data.cif,
                nif: response.data.nif,
                examenResult: examenResult.all, // Stocker les résultats de loadDataExamen dans la constante result
                totalMt: examenResult.total, // Stocker le total de loadDataExamen dans la constante result
            };

            return result;
        } catch (error) {
            // Gérer les erreurs
            console.error(error);
            return null;
        }
    };

    const loadDataTest = async () => {
        const results = [];
        let i = 0;
        setBlockedPanel(true);
        let verf = 0;
        while (i < props.data.length) {
            const num_fact_ = props.data[i].num_fact;
            const date_arriv = props.data[i].date_arr;

            try {
                const result = await loadDataFact(num_fact_, date_arriv);
                results.push(result);
                notificationAction('info', (i + 1) + ' factures ont été récupérées avec succès. !', "");
                i++;
            } catch (error) {
                console.error(error);
                results = [];
                // Réinitialiser la boucle en cas d'erreur
                i = 0;
            }
        }

        if (i == props.data.length) {
            setBlockedPanel(false);
        }
        // Faites ce que vous voulez avec les résultats
        setDataAllFactExamen(results);
    };

    const chargementData = () => {
        setCharge(true);
        setinfoExamen([{ quantite: 'Chargement de données...' }]);
        setTimeout(() => {
            loadDataTest()
        }, 200)
    }

    function manisyLettre(nb) {
        let nombre = (format(nb, 2, "")).toString().split('.');
        let ren = 0;
        if (parseInt(nombre[1]) > 0) {
            ren = NumberToLetter(parseInt(nombre[0])) + ' Ariary ' + NumberToLetter(parseInt(nombre[1]))
        } else {
            ren = NumberToLetter(parseInt(nombre[0]))
        }
        let firstLetter = ren.charAt(0).toUpperCase();
        let nlettren = firstLetter + ren.slice(1);
        return nlettren
    }

    return (
        <>
            <Button icon={PrimeIcons.PRINT} label='Imprimer toutes les factures' tooltip='Imprimer toutes les factures' className='p-buttom-sm p-1 mr-2 ' style={stylebtnRetourner} tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargementData() }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-7 md:col-10 col-11 p-0" onHide={() => onHide('displayBasic2')}  >
                <BlockUI blocked={blockedPanel} template={<ProgressSpinner />}>
                    <Toast ref={toastTR} position="top-left" />
                    <div className='recu-imprime' style={{ padding: '50px', border: '1px solid black' }} >

                        <div
                            className="facture w-100 h-100"
                            style={{ position: 'relative' }}
                            ref={(el) => (reportTemplateRef = el)}
                        >

                            {/* Début Boucle  */}
                            {DataAllFactExamen.map((dt, i) => (

                                <div className='m-0 recuimprime-all' key={i}  >

                                    <div className='crdt co-12 ' style={{ position: 'absolute', alignItems: 'center', width: '100%' }}>
                                        <center>
                                            <h1 className='m-0' style={{ fontSize: '15em', color: 'rgb(0 0 0 / 0.6%)' }}>CRDT</h1>
                                        </center>
                                    </div>
                                    <table
                                        width="100%"
                                        height="130"
                                        border="0"
                                        align="center"
                                        class="Input1"
                                    >
                                        <tr class="Input1">
                                            <td width="317" height="23">
                                                <strong>RC: {dt.rc == null ? '' : dt.rc} </strong>
                                                <br />
                                                <strong>STAT: {dt.stat == null ? '' : dt.stat}</strong>
                                                <br />
                                                <strong>CIF: {dt.cif == null ? '' : dt.cif}</strong> <br />
                                                <strong>NIF: {dt.nif == null ? '' : dt.nif}</strong>
                                            </td>

                                            <td width="425">
                                                <p>Antananarivo,le {dt.date_facture}</p>
                                                <p>&nbsp;</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="26" colspan="3">
                                                <table width="269" border="0" align="center">
                                                    <tr>
                                                        <td width="251">
                                                            <span class="Style4">FACTURE N° : {dt.num_facture}</span>
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
                                                {dt.ref_carte === null ? dt.patient : dt.patient + ' ' + dt.ref_carte}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowspan="4" class="table">
                                                <strong>PRISE EN CHARGE : </strong>
                                            </td>
                                            <td width="74%" rowspan="4" class="table">
                                                {dt.nom_cli == null ? '-' : dt.nom_cli} ({dt.pec}%)
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
                                                {dt.examenResult.map((element) => (
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
                                                {dt.examenResult.map((element) => (
                                                    <div style={{ width: "100%", borderTop: "0.3px solid black", padding: '2px' }}>
                                                        {element.montant === null ||
                                                            element.montant === "" ||
                                                            element.montant === undefined ? (
                                                            <>vide</>
                                                        ) : (
                                                            <>{format(element.montant, 2, ' ')}</>
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
                                                {dt.montant_brute}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="26" class="Style3 table">
                                                <div align="right" class="Style5">
                                                    REMISE {dt.remise}%:
                                                </div>
                                            </td>
                                            <td align="right" class="table">
                                                {dt.montant_remise}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="26" class="Style3 table">
                                                <div align="right" class="Style5">
                                                    MONTANT NET:
                                                </div>
                                            </td>
                                            <td align="right" class="table">
                                                {dt.montant_net}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="28" class="Style3 table">
                                                <div align="right" class="Style5">
                                                    PAYE PAR LE(LA)PATIENT(E):{" "}
                                                </div>
                                            </td>
                                            <td align="right" class="table">
                                                {dt.montant_patient}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="28" class="Style3 table">
                                                <div align="right" class="Style5">
                                                    MONTANT DE LA PRISE EN CHARGE:
                                                </div>
                                            </td>
                                            <td align="right" class="table">
                                                {dt.montant_pech}
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                    <br />
                                    <table width="719" border="0" align="center">
                                        <tr>
                                            <td width="428">
                                                Arrêté la présente facture à la somme de: <br />
                                                <label style={{ fontWeight: '700' }}>/{dt.montant_pech == '0.00' ? manisyLettre(infoFacture.net_mtnet) : manisyLettre(infoFacture.net_pec)}/</label>

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
                            ))}

                            {/* Fin Boucle */}
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

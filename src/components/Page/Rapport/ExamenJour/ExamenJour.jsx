import React, { useState, useEffect } from "react";
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import moment from 'moment/moment';
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import ReactToPrint from 'react-to-print'
import { Dialog } from 'primereact/dialog';
import FormatF from "../../Facture/FormatF";

export default function ExamenJours(props) {

    const { format } = FormatF();
    const messagesParPage = 10;
    const [donne, setdonne] = useState({ date: '' })
    const [Charge, setCharge] = useState(false)

    const [DataAll, setDataall] = useState([{
        nom: "",
        num_arriv: "",
        date_arriv: "",
        date_examen: "",
        reglement: "",
        num_fact: "",
        montant_regl: "",
        examen: [
            {
                lib_examen: "",
                code_tarif: "",
            },
            {
                lib_examen: "",
                code_tarif: "",
            },
        ],
    }]);


    const [Total, setTotal] = useState({
        montant_chq: "",
        montant_esp: "",
        count: "",
    });

    const loadTotal = async () => {
        let date = moment(donne.date).format('DD-MM-YYYY');
        await axios.get(props.url + `getMtExamenJour/${date}`)
            .then(
                (result) => {
                    setTotal(result.data);
                    onHide('displayBasic2')

                    setTimeout(() => {
                        loadData(date);
                    }, 300)
                }
            );
    }

    const loadData = async (date) => {
        await axios.get(props.url + `getExamenJour/${date}`)
            .then(
                (result) => {
                    setDataall(result.data.Data);

                    setCharge(false);
                }
            )
            .catch((error) => {
                console.log(error);
                setCharge(false);
            })
    }
    //   const DataAll = [
    //     {
    //       nom: "Iandriminosolo",
    //       num_arriv: "001",
    //       date_arriv: "05/02/2023",
    //       date_examen: "05/02/2023",
    //       reglemnt: "-",
    //       num_fact: "23/02/0006",
    //       montant_regl: "0",
    //       examen: [
    //         {
    //           lib_examen: "AVANT BRAS",
    //           code_tarif: "Z15",
    //         },
    //         {
    //           lib_examen: "BRAS COUDE",
    //           code_tarif: "Z15",
    //         },
    //       ],
    //     },
    //     {
    //       nom: "Jean Frederick",
    //       num_arriv: "002",
    //       date_arriv: "05/02/2023",
    //       date_examen: "05/02/2023",
    //       reglemnt: "-",
    //       num_fact: "23/02/0005",
    //       montant_regl: "100 000",
    //       examen: [
    //         {
    //           lib_examen: "ELECTRO-CARDIO-GRAM",
    //           code_tarif: "Z15",
    //         },
    //         {
    //           lib_examen: "CEREBRAL",
    //           code_tarif: "Z125",
    //         },
    //       ],
    //     },
    //     {
    //       nom: "Miavaka",
    //       num_arriv: "004",
    //       date_arriv: "05/02/2023",
    //       date_examen: "05/02/2023",
    //       reglemnt: "-",
    //       num_fact: "23/02/0007",
    //       montant_regl: "250",
    //       examen: [
    //         {
    //           lib_examen: "ECHOGRAPHIE TESTICULAIRE",
    //           code_tarif: "K15",
    //         },
    //         {
    //           lib_examen: "RACHIS LOMBAIRE FP",
    //           code_tarif: "Z20",
    //         },
    //       ],
    //     },
    //   ];

    //   ------------------------Total--------------------
    //   const Total = {
    //     starts: "1",
    //     ends: "58",
    //     counts: "58",
    //     montant: "3 906 500",
    //   };

    function pourcentage(val, total) {
        var res = (val * 100) / total;
        return res;
    }
function nombreTable(data){
    let nb = 0;
    for (let index = 0; index < DataAll.length; index++) {
        const element = DataAll[index];
        nb+=element.examen.length;
        
    }
    return nb

}
    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(true);
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
    /** Fin modal */

    const recherche = () => {
        setCharge(true);
        setTimeout(() => {
            loadTotal();
        }, 200)
    }
    let nombreDePages = Math.ceil(DataAll.length / messagesParPage);

    return (
        <>
            <Dialog header={'RECETTE DU JOUR'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' >
                    <div className='flex flex-column justify-content-center'>
                        <center>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date </label>
                        </center>
                        <center>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '200px', fontWeight: 'bold' }} value={donne.date} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ date: e.target.value }) }} />
                        </center>
                        <center>
                            <Button icon={PrimeIcons.SEARCH} style={{ width: '150px', fontSize: '1.3em' }} className='p-button-sm p-button-secondary mt-3 p-2' label={'Reherche'} onClick={() => {
                                recherche()
                            }} />
                        </center>
                    </div>
                </div>
            </Dialog>

            {/* ------------------------------------------- */}
            <BlockUI blocked={Charge} template={<ProgressSpinner />}>
                <div className='grid h-full'>
                    <div className='col-12 pt-0' style={{ borderBottom: '1px solid #efefef' }} >
                        {displayBasic2 ? null :
                            <Button icon={PrimeIcons.SEARCH} tooltip='Recherche Facture' label='Recherche' className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); }} />
                        }
                    </div>
                    <div className="col-12 m-0 p-0">
                        <center className='mt-3 '>
                            <ReactToPrint trigger={() =>
                                <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ' label={'Imprimer'} tooltipOptions={{ position: 'top' }} />
                            } content={() => document.getElementById("scan")} />
                        </center>
                    </div>
                    <div className="col-12 p-0 m-0" id="scan">


                        {DataAll.length === 0 ? (
                            <div
                                style={{
                                    margin: "50px 0",
                                    fontSize: "2em",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Aucun element a afficher !
                            </div>
                        ) : (
                            Array.from({ length: nombreDePages }, (_, index) => {
                                const debut = index * messagesParPage;
                                const fin = debut + messagesParPage;
                                const pagededonnees = DataAll.slice(debut, fin);

                                return (
                                    <div key={index} className='m-0 p-0 rapportxxx'>                                       
                                     <span class="Style5" style={{ fontWeight: "bold" }}>CRDT</span>
                                        <table width="777" border="0" align="center">
                                            <tr>
                                                <td width="771">
                                                    <div align="center">
                                                        <strong>LISTE DES EXAMENS </strong> <strong> DU </strong>
                                                        {moment(donne.date).format('DD/MM/YYYY')}
                                                        <br />
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <table width="95%" border="0" align="center" class="table">
                                            <tr>
                                                <td width="2%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">
                                                            <div align="left" class="Style1">
                                                                <div align="center">N&deg; Arriv </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td width="5%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">
                                                            <div align="left" class="Style1">
                                                                <div align="center">Date arrive </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td width="5%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">
                                                            <div align="left" class="Style1">
                                                                <div align="center">N&deg; Facture </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td width="5%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">DATE_EXAMEN</div>
                                                    </div>
                                                </td>
                                                <td width="23%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">PATIENT</div>
                                                    </div>
                                                </td>
                                                <td width="27%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">EXAMEN</div>
                                                    </div>
                                                </td>
                                                <td width="9%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">CODE TARIF </div>
                                                    </div>
                                                </td>
                                                <td width="9%" class="table Style3">
                                                    <div align="center">
                                                        <strong>MODE REGLMT</strong>
                                                    </div>
                                                </td>
                                                <td width="8%" class="table Style3">
                                                    <div align="center">
                                                        <strong>MONTANT</strong>
                                                    </div>
                                                </td>
                                            </tr>
                                            {pagededonnees.map((el, i) => (
                                                <tr key={i}>
                                                    <td class="table Style3">
                                                        <div align="center">
                                                            <font size="1">{el.num_arriv}</font>
                                                        </div>
                                                    </td>
                                                    <td class="table Style3">
                                                        <div align="center">
                                                            <font size="1">{el.date_arriv}</font>
                                                        </div>
                                                    </td>
                                                    <td class="table Style3">
                                                        <div align="center">
                                                            <font size="1">{el.num_fact}</font>
                                                        </div>
                                                    </td>
                                                    <td height="30" class="table Style3">
                                                        <div align="center">
                                                            <font size="1">{el.date_examen}</font>
                                                        </div>
                                                    </td>
                                                    <td class="table Style3">
                                                        <div align="left">
                                                            <font size="1">{el.nom}</font>
                                                        </div>
                                                    </td>
                                                    <td class="table Style3" style={{ padding: "0px" }}>
                                                        {el.examen.map((ex, k) => <div key={k} align="left" style={{ borderBottom: k === el.examen.length - 1 ? `0px solid black` : `1px solid rgb(137 134 134)`, margin: "0px!important" }} >
                                                            <font size="1" style={{color:'#484848'}} >{ex.lib_examen}</font></div>)}
                                                    </td>
                                                    <td class="table Style3" style={{ padding: "0px" }}>
                                                        {el.examen.map((code, c) => <div key={c} align="left" style={{ borderBottom: c === el.examen.length - 1 ? `0px solid black` : `1px solid rgb(137 134 134)`, margin: "0px!important" }} >
                                                            <font size="1" style={{color:'#484848'}} >{code.code_tarif}</font>
                                                        </div>)}
                                                    </td>
                                                    <td class="table Style3">
                                                        <div align="left" style={{ textAlign: 'center' }}>
                                                            <font size="1">{el.reglement}</font>
                                                        </div>
                                                    </td>
                                                    <td class="table Style3">
                                                        <div align="right">
                                                            <font size="1">{format(el.montant_regl, 2, ' ')}</font>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {index === nombreDePages - 1 && (
                                                <tr>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>

                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b>TOTAL:</b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b>{Total.count}</b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align='right'>
                                                            <font size="1"  >
                                                                <b>{
                                                                    Total.montant_chq==""?format(parseFloat(Total.montant_esp), 2, ' ') :
                                                                    Total.montant_esp==""?  format(parseFloat(Total.montant_chq), 2, ' ') :
                                                                    Total.montant_chq=="" && Total.montant_esp==""? "0":
                                                                format(parseFloat(Total.montant_chq) + parseFloat(Total.montant_esp), 2, ' ')
                                                                }</b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {index === nombreDePages - 1 && 
                                            <>
                                                <tr>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b></b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b></b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <font size="1">
                                                            <b>ESPECE:</b>
                                                        </font>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align='right'>
                                                            <font size="1">
                                                                <b>{format(Total.montant_esp, 2, ' ')}</b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b></b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">
                                                                <b></b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        &nbsp;
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <font size="1">
                                                            <b>CHEQUE:</b>
                                                        </font>
                                                    </td>
                                                    <td height="22" class="table Style3">
                                                        <div align='right'>
                                                            <font size="1">
                                                                <b>{format(Total.montant_chq, 2, ' ')}</b>
                                                            </font>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>}
                                        </table>
                                        <div align="center">
                                            <font class="Style1 Style4">
                                                Page: {index + 1 + "/" + nombreDePages}
                                                {index === nombreDePages - 1 ? null : (
                                                    <div class="saut"></div>
                                                )}
                                            </font>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </BlockUI>
        </>
    );
}

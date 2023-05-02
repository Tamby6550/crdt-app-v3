import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import ReactToPrint from 'react-to-print'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import moment from 'moment/moment';

export default function FactureJour(props) {

    const messagesParPage = 19;


    const [donne, setdonne] = useState({ date: '' })
    const [Charge, setCharge] = useState(false)
    const [Dataall, setDataall] = useState([{
        date_examen: "",
        num_fact: "",
        client: "",
        patient: "",
        montant: "",
        reglemnt: "",
        montant_regl: "",
        type_facture: "",
        echo: "",
        mamo: "0",
        panno: "0",
        ecg: "0",
        produit: "0",
        radio: "0",
        scan: "0",
        observation: "",
    }]);

    const [Total, setTotal] = useState({
        starts: "",
        ends: "",
        counts: "",
        montant: "",
        montant_rglmt: "",
    });

    const loadTotal = async () => {
        let date = moment(donne.date).format('DD-MM-YYYY');
        await axios.get(props.url + `getMtFacturejour/${date}`)
            .then(
                (result) => {
                    setTotal(result.data);
                    onHide('displayBasic2')

                    setTimeout(() => {
                        loadData(result.data.starts, result.data.ends, date);
                    }, 200)
                }
            );
    }

    const loadData = async (starts, ends, date) => {
        await axios.get(props.url + `getFactureJour/${starts}&${ends}&${date}`)
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

    const recherche = () => {
        setCharge(true);
        setTimeout(() => {
            loadTotal();
        }, 200)
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

    let nombreDePages = Math.ceil(Dataall.length / messagesParPage);
    return (
        <>
            <Dialog header={'FACTURE DU JOUR'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
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
                <div className='grid'>
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


                        {Dataall.length === 0 ? <div style={{ margin: "50px 0", fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>Aucun element a afficher !</div> : Array.from({ length: nombreDePages }, (_, index) => {
                            const debut = index * messagesParPage;
                            const fin = debut + messagesParPage;
                            const pagededonnees = Dataall.slice(debut, fin);

                            return (
                                <div key={index} className='m-0 p-0 rapportxxx'>
                                    <span class="Style11">CRDT</span>
                                    <table
                                        border="0"
                                        style={{ display: "flex", justifyContent: "center" }}
                                    >
                                        <tr>
                                            <td width="309">
                                                <div align="center" style={{ textAlign: "center!important" }}>
                                                    <strong>FACTURES DU : {moment(donne.date).format('DD/MM/YYYY')}</strong>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <table width="98.5%" border="0" align="center" class="table">
                                        <tr>
                                            <td width="1%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">N° ARRIVE</span>
                                                </div>
                                            </td>
                                            <td width="4%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">DATE ARRIVE</span>
                                                </div>
                                            </td>
                                            <td width="4%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">NUMERO FACTURE</span>
                                                </div>
                                            </td>
                                            <td width="18%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        CLIENT
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="18%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        PATIENT
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="7%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        C.A TTC{" "}
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        ECHO
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        RADIO
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        MAMMO
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        PANO
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        ECG
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        SCAN
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="5%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        AUTRES
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="2%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        REG
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="8%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        MONTREG
                                                    </div>
                                                </div>
                                            </td>
                                           
                                        </tr>
                                        {pagededonnees.map((element, i) => (
                                            <tr key={i}>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.num_arriv}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.date_arriv}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.num_fact}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.client}</font>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <font size="1">{element.patient}</font>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.montant}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.echo}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.radio}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.mamo}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.panno}</font>
                                                    </div>
                                                </td>
                                                <td class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.ecg}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.scan}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">0</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="center">
                                                        <font size="1">{element.reglemnt}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{element.montant_regl}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="center">
                                                        <font size="1"></font>
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
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>TOTAL:</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Total.counts}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Total.montant}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>&nbsp;</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <font size="1">
                                                        <b> &nbsp;</b>
                                                    </font>
                                                </td>
                                                <td height="22" class="table Style">
                                                    &nbsp;
                                                </td>
                                                <td height="22" class="table Style">
                                                    &nbsp;
                                                </td>
                                                
                                               
                                                <td height="22" class="table Style"></td>
                                                <td height="22" class="table Style"></td>
                                                <td height="22" class="table Style"></td>
                                                <td height="22" class="table Style"></td>
                                                <td height="22" class="table Style">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Total.montant_rglmt}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                              
                                            </tr>
                                        )}
                                    </table>
                                    <div align="center">
                                        <font class="Style1" color="#000000">
                                            Page:{index + 1}/{nombreDePages}
                                        </font>
                                        <font class="Style1" color="#000000"></font>
                                    </div>
                                    {index === nombreDePages - 1 ? null : <div class="saut"></div>}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </BlockUI>
            {/* ------------------------------------------- */}

        </>
    )
}

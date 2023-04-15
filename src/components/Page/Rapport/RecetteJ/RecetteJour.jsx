import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import ReactToPrint from 'react-to-print'
import { Dialog } from 'primereact/dialog';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import moment from 'moment/moment';
import FormatF from "../../Facture/FormatF";

export default function Recettejour(props) {

    const messagesParPage = 19;
    const { format } = FormatF();


    const [donne, setdonne] = useState({ date: '' })
    const [Charge, setCharge] = useState(false)
    const [Dataall, setDataall] = useState([{
        id: "",
        date_reglmt: "",
        num_fact: "",
        patient: "",
        client: "",
        reglemnt: "",
        montant: "",
    }]);

    const [Total, setTotal] = useState({
        montant_chq: "",
        montant_esp: "",
        starts: "",
        ends: "",
        counts: "",
        montant: "",
    });

    const loadTotal = async () => {
        let date = moment(donne.date).format('DD-MM-YYYY');
        await axios.get(props.url + `getMtRecettejour/${date}`)
            .then(
                (result) => {
                    setTotal(result.data);
                    onHide('displayBasic2')

                    setTimeout(() => {
                        loadData(result.data.starts, result.data.ends, date);
                    }, 300)
                }
            );
    }

    const loadData = async (starts, ends, date) => {
        await axios.get(props.url + `getRecetteJour/${starts}&${ends}&${date}`)
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


                        {Dataall.length === 0 ? <div style={{ margin: "50px 0", fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>Aucun element a afficher !</div> : Array.from({ length: nombreDePages }, (_, index) => {
                            const debut = index * messagesParPage;
                            const fin = debut + messagesParPage;
                            const pagededonnees = Dataall.slice(debut, fin);

                            return (
                                <div key={index} className='m-0 p-0 rapportxxx'>
                                    <span class="Style11 Style5">
                                        <strong>CRDT</strong>
                                    </span>
                                    <table width="371" border="0" align="center">
                                        <tr>
                                            <td width="365">
                                                <div align="center">
                                                    <strong>
                                                        <span class="Style4">RECETTES DU : </span>
                                                        {moment(donne.date).format('DD/MM/YYYY')}
                                                    </strong>
                                                    <font> (Esp&egrave;ce/Ch&egrave;que)</font>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" border="0" align="center" class="table">
                                        <tr>
                                            <td width="2%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style3">N° ARRIV</span>
                                                </div>
                                            </td>
                                            <td width="6%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style3">DATE ARRIV</span>
                                                </div>
                                            </td>
                                            <td width="6%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style3">N° FACTURE</span>
                                                </div>
                                            </td>
                                            <td width="21%" class="Style3 table">
                                                <div align="left" class="Style1 Style3">
                                                    <div align="center">CLIENT</div>
                                                </div>
                                            </td>
                                            <td width="21%" class="Style3 table">
                                                <div align="left" class="Style1 Style3">
                                                    <div align="center">PATIENT</div>
                                                </div>
                                            </td>
                                            <td width="10%" class="Style3 table">
                                                <div align="left" class="Style1 Style3">
                                                    <div align="center">MODE REGLMT</div>
                                                </div>
                                            </td>
                                            <td width="10%" class="Style3 table">
                                                <div align="left" class="Style1 Style3">
                                                    <div align="center">MONTANT</div>
                                                </div>
                                            </td>
                                        </tr>
                                        {pagededonnees.map((el, i) => (
                                            <tr key={i}>
                                                <td height="22" class="table Style3">
                                                    <font size="1">{el.num_arriv}</font>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <font size="1">{el.date_arriv}</font>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <font size="1">{el.num_fact}</font>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="left">
                                                        <font size="1">{el.client}</font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="left">
                                                        <font size="1">{el.patient}</font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="left">
                                                        <font size="1">{el.reglemnt}</font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">{ el.montant==""? "0" : format(parseFloat(el.montant), 2, ' ')}</font>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {index === nombreDePages - 1 && <>
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
                                                            <b></b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{ Total.montant==""? "0" :  format(parseFloat(Total.montant), 2, ' ')}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                            </tr>
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
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>ESPECE</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{ Total.montant_esp==""? "0" :  format(parseFloat(Total.montant_esp), 2, ' ')}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                            </tr>
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
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>CHEQUE</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td height="22" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Total.montant_chq==""? "0" :  format(parseFloat(Total.montant_chq), 2, ' ')}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>}
                                    </table>
                                    <div align="center">
                                        <font class="Style1 Style4">
                                            {index + 1 + "/" + nombreDePages}
                                            {index === nombreDePages - 1 ? null : <div class="saut"></div>}
                                        </font>
                                    </div>
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

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

export default function JournalJour(props) {

    const messagesParPage = 17;

    function poucentage(val, pourc) {
        let res = (pourc * 100) / val;
        return (res).toFixed(2);
    }

    const [donne, setdonne] = useState({ date: '' })
    const [Charge, setCharge] = useState(false)
    const [Dataall, setDataall] = useState([{
        date_arriv: "",
        num_arriv: "",
        nom: "",
        type_patient: "",
        sexe: "",
        datenaiss: "",
        status_exam: "",
        status_fact: "",
        totalpat: "0",
        totalpec: "0",
        rpatient: "0",
        rclient: "0"
    }]);



    const loadData = async () => {
        await axios.get(props.url + `getJournalJour/${moment(donne.date).format('DD-MM-YYYY')}`)
            .then(
                (result) => {
                    onHide('displayBasic2');
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
            loadData();
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
            <Dialog header={'JOURNAL DU JOUR'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
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
                                                    <strong>JOURNAL DU : {moment(donne.date).format('DD/MM/YYYY')}</strong>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <table width="98.5%" border="0" align="center" class="table">
                                        <tr>
                                            <td width="4%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">DATE ARRIVE</span>
                                                </div>
                                            </td>
                                            <td width="3%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">N° ARRIVE</span>
                                                </div>
                                            </td>
                                            <td width="22%" class="Style3 table">
                                                <div align="center">
                                                    <span class="Style1 Style4">PATIENT</span>
                                                </div>
                                            </td>
                                            <td width="2%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        TYPE
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="2%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        SEXE
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="4%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        DATE NAISSANCE
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="10%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        STATUS EXAMEN
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="10%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        STATUS FACTURE
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="3%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        REG-PATIENT
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="3%" class="table">
                                                <div align="left" class="Style1">
                                                    <div align="center" class="Style4">
                                                        REG-CLIENT
                                                    </div>
                                                </div>
                                            </td>


                                        </tr>
                                        {pagededonnees.map((element, i) => (
                                            <tr key={i}>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.date_arriv}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.num_arriv}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "left" }}>
                                                    <font size="1">{element.nom}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.type_patient}</font>
                                                </td>
                                                <td height="24" class="table Style3" style={{ textAlign: "center" }}>
                                                    <font size="1">{element.sexe}</font>
                                                </td>
                                                <td height="24" class="table Style3" >
                                                    <div align="center">
                                                        <font size="1">{element.datenaiss}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="center">
                                                        <font size="1">{element.status_exam}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="center">
                                                        <font size="1">{element.status_fact}</font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                        {poucentage(element.totalpat, element.rpatient) == 'NaN' ? '-' : poucentage(element.totalpat, element.rpatient) + '%'}
                                                            </font>
                                                    </div>
                                                </td>
                                                <td height="24" class="table Style3">
                                                    <div align="right">
                                                        <font size="1">
                                                        {poucentage(element.totalpec, element.rclient) == 'NaN' ? '-' : poucentage(element.totalpec, element.rclient) + '%'}
                                                            </font>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}

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

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
import { ScrollPanel } from 'primereact/scrollpanel';
import ChoixClient from '../../Facture/PatientNonFact/ChoixClient';
import axios from 'axios';
import moment from 'moment/moment';

export default function StatClient(props) {

    const messagesParPage = 17;



    const [donne, setdonne] = useState({ code_cli: '', nom_cli: '', date_deb: '', date_fin: '' });
    const [verfChamp, setverfChamp] = useState({ nom_cli: false })
    const [Charge, setCharge] = useState(false);
    const [Total, setTotal] = useState({
        quantite: "",
        montant: "",
        starts: "",
        ends: "",
        counts: "",
    })
    const [DataAll, setDataAll] = useState({
        id: "",
        num_fact: "",
        lib_examen: "",
        patient: "",
        quantite: "",
        pu: "0",
        montant: "0",
        daty: "",
    });



    const loadTotal = async () => {
        await axios.post(props.url + `getMtClientStat`, {
            date_deb: moment(donne.date_deb).format('DD/MM/YYYY'),
            date_fin: moment(donne.date_fin).format('DD/MM/YYYY'),
            code_cli: donne.code_cli,
        })
            .then(
                (result) => {
                    setTotal(result.data);
                    onHide('displayBasic2')

                    setTimeout(() => {
                        loadData(result.data.starts, result.data.ends);
                    }, 300)
                }
            );
    }

    const loadData = async (starts, ends) => {
        await axios.post(props.url + `getClientStat`, {
            date_deb: moment(donne.date_deb).format('DD/MM/YYYY'),
            date_fin: moment(donne.date_fin).format('DD/MM/YYYY'),
            code_cli: donne.code_cli,
            starts: starts,
            ends: ends
        })
            .then(
                (result) => {
                    setDataAll(result.data.Data);
                    setCharge(false);
                }
            ).catch((error) => {
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



    let nombreDePages = Math.ceil(DataAll.length / messagesParPage);
    return (
        <>
            <Dialog header={'STAT CLIENT'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' >
                    <div className='flex flex-column justify-content-center'>
                        <div className='m-3'>
                            <label htmlFor="username2" className="label-input-sm mt-2" style={{ fontSize: '1.5em' }}>Client: </label>
                            <div className='m-0 flex flex-row align-items-center  '>
                                <InputText id="username2" style={{ backgroundColor: 'rgb(251 251 251)', height: '40px', borderRadius: '4px', width: '100%', fontWeight: 'bold' }} aria-describedby="username2-help" className={verfChamp.nom_cli ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} name='code_cli' value={donne.nom_cli} readOnly />
                                <ChoixClient url={props.url} infoFacture={donne} setverfChamp={setverfChamp} verfChamp={verfChamp} setinfoFacture={setdonne} typeclient={'a'} />

                            </div>
                        </div>
                        <div className='m-3 flex flex-column justify-content-center'>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date début : </label>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '50%', fontWeight: 'bold' }} value={donne.date_deb} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ ...donne, date_deb: e.target.value }) }} />
                        </div>
                        <div className='m-3 flex flex-column justify-content-center'>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date fin :</label>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '50%', fontWeight: 'bold' }} value={donne.date_fin} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ ...donne, date_fin: e.target.value }) }} />
                        </div>
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
                <ScrollPanel style={{ height: '600px' }}  >
                    <div className='grid'>
                        <div className='col-12 pt-3' style={{ borderBottom: '1px solid #efefef' }} >
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
                        <div className="col-12 p-0 m-0 pl-3" id="scan">

                            {DataAll.length === 0 ? (
                                <div
                                    style={{
                                        margin: "50px 0",
                                        fontSize: "3em",
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
                                        <div key={index} className='rapportxxx' >
                                            <span class="Style5" style={{ fontWeight: "bold" }}>CRDT</span>
                                            <table width="777" border="0" align="center">
                                                <tr>
                                                    <td width="771">
                                                        <div align="center">
                                                            <strong>STATISTIQUE DETAILLE DES EXAMENS DU </strong>
                                                            {donne.nom_cli}
                                                            <strong> POUR LA PERIODE DE </strong>
                                                            {moment(donne.date_deb).format('DD/MM/YYYY')}
                                                            <strong> au </strong>
                                                            {moment(donne.date_fin).format('DD/MM/YYYY')}
                                                            <br />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>

                                            <br />

                                            <table width="95%" border="0" align="center" class="table">
                                                <tr>
                                                    <td width="4%" class="Style3 table">
                                                        <div align="center">
                                                            <strong>N&deg;</strong>
                                                        </div>
                                                    </td>
                                                    <td width="1%" class="Style3 table">
                                                        <div align="center">
                                                            <span class="Style1 Style4">N° ARRIVE</span>
                                                        </div>
                                                    </td>
                                                    <td width="6%" class="Style3 table">
                                                        <div align="center">
                                                            <span class="Style1 Style4">DATE ARRIVE</span>
                                                        </div>
                                                    </td>
                                                    <td width="6%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">NUMFACT</div>
                                                        </div>
                                                    </td>
                                                    <td width="28%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">EXAMEN</div>
                                                        </div>
                                                    </td>
                                                    <td width="23%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">PATIENT</div>
                                                        </div>
                                                    </td>
                                                    <td width="9%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">QUANTITE</div>
                                                        </div>
                                                    </td>
                                                    <td width="9%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">PU</div>
                                                        </div>
                                                    </td>
                                                    <td width="12%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">MONTANT</div>
                                                        </div>
                                                    </td>
                                                    <td width="8%" class="Style3 table">
                                                        <div align="left" class="Style1">
                                                            <div align="center">DATE EXAM</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {pagededonnees.map((el, i) => (
                                                    <tr key={i}>
                                                        <td height="24" class="table Style3">
                                                            <div align="center">
                                                                <font size="1">{el.id}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="center">
                                                                <font size="1">{el.num_arriv}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="center">
                                                                <font size="1">{el.date_arriv}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="center">
                                                                <font size="1">{el.num_fact}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <font size="1">{el.lib_examen}</font>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <font size="1">{el.patient}</font>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="right">
                                                                <font size="1">{el.quantite}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="right">
                                                                <font size="1">{el.pu}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="right">
                                                                <font size="1">{el.montant}</font>
                                                            </div>
                                                        </td>
                                                        <td height="24" class="table Style3">
                                                            <div align="center">
                                                                <font size="1">{el.daty}</font>
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
                                                                    <b></b>
                                                                </font>
                                                            </div>
                                                        </td>
                                                        <td height="22" class="table Style3">
                                                            <div align="right">
                                                                <font size="1">
                                                                    <b>{Total.quantite}</b>
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
                                                                    <b>{Total.montant}</b>
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
                                                    </tr>
                                                )}
                                            </table>
                                            <div align="center">
                                                <font class="Style1 Style4">
                                                    Page:
                                                    {index + 1 + "/" + nombreDePages}
                                                    {index === nombreDePages - 1 ? null : (
                                                        <div class="saut"> </div>
                                                    )}
                                                </font>{" "}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </ScrollPanel>
            </BlockUI>
            {/* ------------------------------------------- */}

        </>
    )
}

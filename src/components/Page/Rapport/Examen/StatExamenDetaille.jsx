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
import { ScrollPanel } from 'primereact/scrollpanel'
import axios from 'axios';
import moment from 'moment/moment';

export default function StatExamen(props) {

    const messagesParPage = 19;


    const [donne, setdonne] = useState({ date_deb: '', date_fin: '' })
    const [Charge, setCharge] = useState(false)
    const [Examstat, setExamstat] = useState({
        starts: "",
        ends: "",
        counts: "",
        data: [{
            id: "",
            examen: "",
            count: "",
            montant: "0",
        }]
    });



    const loadData = async () => {
        await axios.post(props.url + `getStatDetailleExamen`,
            {
                date_deb: moment(donne.date_deb).format('DD/MM/YYYY'),
                date_fin: moment(donne.date_fin).format('DD/MM/YYYY')
            }
        )
            .then(
                (result) => {
                    setExamstat(result.data);
                    setCharge(false);
                    onHide('displayBasic2')
                }
            );
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



    let nombreDePages = Math.ceil(Examstat.data.length / messagesParPage);

    return (
        <>
            <Dialog header={'STAT EXAMEN DETAILLE'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' >
                    <div className='flex flex-column justify-content-center'>
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

                        {Examstat.data.length === 0 ? (
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
                                const pagededonnees = Examstat.data.slice(debut, fin);

                                return (
                                    <div key={index} className='rapportxxx' >
                                        <span class="Style6 Style7 " >
                                            <strong>CRDT</strong>
                                        </span>
                                        <table width="511" border="0" align="center">
                                            <tr>
                                                <td width="505">
                                                    <strong>STATISTIQUE DETAILLE DES EXAMENS du </strong>
                                                    {moment(donne.date_deb).format('DD/MM/YYYY')}
                                                    <strong> au </strong>
                                                    {moment(donne.date_fin).format('DD/MM/YYYY')}
                                                </td>
                                            </tr>
                                        </table>
                                        <table width="100%" border="0" align="center" class="table">
                                            <tr>
                                                <td width="5%" class="Style3 table">
                                                    <div align="center">
                                                        <strong>N&deg;</strong>
                                                    </div>
                                                </td>
                                                <td width="67%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">EXAMENS</div>
                                                    </div>
                                                </td>
                                                <td width="14%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">NOMBRES</div>
                                                    </div>
                                                </td>
                                                <td width="14%" class="Style3 table">
                                                    <div align="left" class="Style1">
                                                        <div align="center">MONTANTS</div>
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
                                                        <font size="1">{el.examen}</font>
                                                    </td>
                                                    <td height="24" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">{el.count}</font>
                                                        </div>
                                                    </td>
                                                    <td height="24" class="table Style3">
                                                        <div align="right">
                                                            <font size="1">{el.montant}</font>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                        <br />
                                        <div align="center">
                                            <font class="Style1 Style4">
                                                Page:{index + 1}/{nombreDePages}
                                            </font>{" "}
                                        </div>
                                        {index === nombreDePages - 1 ? null : <div class="saut"> </div>}
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

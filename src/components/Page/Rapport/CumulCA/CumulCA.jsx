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

export default function CumulCA(props) {

    const messagesParPage = 19;


    const [donne, setdonne] = useState({ date_deb: '', date_fin: '' })
    const [Charge, setCharge] = useState(false)
    const [DataAll, setDataAll] = useState({
        nombre: "",
        total: "",
        montant: "",
        data: [
            {
                type: "",
                mont: "",
                nombre: "",
                montant: "",
            }]
    });



    const loadData = async () => {
        await axios.post(props.url + `getCumulChiffre`,
            {
                date_deb: moment(donne.date_deb).format('DD/MM/YYYY'),
                date_fin: moment(donne.date_fin).format('DD/MM/YYYY')
            }
        )
            .then(
                (result) => {
                    setDataAll(result.data);
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


    function pourcentage(nombre, totaux) {
        const nb = nombre;
        const nnint = parseInt(nb);
        const total = totaux;
        const totalInt = parseInt(total);
        const valeur = (nnint * 100) / totalInt;
        return valeur.toFixed(2);
    }

    let nombreDePages = Math.ceil(DataAll.data.length / messagesParPage);


    return (
        <>
            <Dialog header={'CHIFFRE D\'AFFAIRE'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' >
                    <div className='flex flex-column justify-content-center'>
                        <div className='m-3'>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date début : </label>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '200px', fontWeight: 'bold' }} value={donne.date_deb} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ ...donne, date_deb: e.target.value }) }} />
                        </div>
                        <div className='m-3'>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date fin :</label>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '200px', fontWeight: 'bold' }} value={donne.date_fin} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ ...donne, date_fin: e.target.value }) }} />
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

                            {DataAll.data.length === 0 ? (
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
                                    const pagededonnees = DataAll.data.slice(debut, fin);

                                    return (
                                        <div key={index} className='rapportxxx' >
                                            <span class="Style2 Style3" style={{ fontWeight: "bold" }}>CRDT</span>
                                            <table width="396" border="0" align="center">
                                                <tr>
                                                    <td width="390">
                                                        <strong>CUMUL CHIFFRE D'AFFAIRE du </strong>
                                                        {moment(donne.date_deb).format('DD/MM/YYYY')}
                                                        <strong> au </strong>
                                                        {moment(donne.date_fin).format('DD/MM/YYYY')}
                                                    </td>
                                                </tr>
                                            </table>
                                            <br />
                                            <table
                                                class="table"
                                                width="934"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                            >
                                                <tr class="table">
                                                    <td width="220" align="left" class="table">
                                                        <div align="center" class="Style1">
                                                            TYPE
                                                        </div>
                                                    </td>
                                                    <td class="table" width="383" align="justify">
                                                        <div align="center" class="Style1">
                                                            % MONTANT
                                                        </div>
                                                    </td>

                                                    <td class="table" width="383" align="justify">
                                                        <div align="center" class="Style1">
                                                            MONTANT
                                                        </div>
                                                    </td>
                                                </tr>
                                                {pagededonnees.map((el, i) => (
                                                    <tr key={i}>
                                                        <td width="220" class="table" align="left">
                                                            <font size="1">{el.type}</font>
                                                        </td>

                                                        <td width="383" class="table" align="justify">
                                                            <div align="right">
                                                                <font size="1">
                                                                    {pourcentage(el.mont, DataAll.total)}
                                                                </font>
                                                            </div>
                                                        </td>

                                                        <td width="383" class="table" align="justify">
                                                            <div align="right">
                                                                <font size="1">{el.montant}</font>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {index === nombreDePages - 1 && (
                                                    <tr>
                                                        <td align="left" class="table">
                                                            <font size="1">
                                                                <strong>TOTAL:</strong>
                                                            </font>
                                                        </td>

                                                        <td class="table" align="justify">
                                                            <div align="right"></div>
                                                        </td>
                                                        <td class="table" align="justify">
                                                            <div align="right">
                                                                <font size="1">
                                                                    <b>{DataAll.montant}</b>
                                                                </font>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
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
                </ScrollPanel>
            </BlockUI>
            {/* ------------------------------------------- */}

        </>
    )
}

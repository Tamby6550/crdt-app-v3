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

export default function StatExamen(props) {

    const messagesParPage = 19;


    const [donne, setdonne] = useState({ date_deb: '', date_fin: '' })
    const [Charge, setCharge] = useState(false)
    const [Examstat, setExamstat] = useState({
        nombre: "",
        total: "",
        montant: "",
        data: [{
            type: "",
            mont: "",
            nombre: "",
            montant: "",
        }]
    });



    const loadData = async () => {
        await axios.post(props.url + `getStatExamen`,
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
            ).catch((error) => {
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

    function pourc(nombre, totaux) {
        const nb = nombre
        const nnint = parseInt(nb)
        const total = totaux
        const totalInt = parseInt(total)
        const valeur = nnint * 100 / totalInt
        return valeur.toFixed(2)
    }
    function format(valeur, decimal, separateur) {
        var deci = Math.round(
            Math.pow(10, decimal) * (Math.abs(valeur) - Math.floor(Math.abs(valeur)))
        );
        var val = Math.floor(Math.abs(valeur));
        if (decimal == 0 || deci == Math.pow(10, decimal)) {
            val = Math.floor(Math.abs(valeur));
            deci = 0;
        }
        var val_format = val + "";
        var nb = val_format.length;
        for (var i = 1; i < 4; i++) {
            if (val >= Math.pow(10, 3 * i)) {
                val_format =
                    val_format.substring(0, nb - 3 * i) +
                    separateur +
                    val_format.substring(nb - 3 * i);
            }
        }
        if (decimal > 0) {
            var decim = "";
            for (var j = 0; j < decimal - deci.toString().length; j++) {
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

    let nombreDePages = Math.ceil(Examstat.data.length / messagesParPage);

    return (
        <>
            <Dialog header={'STAT EXAMEN'} visible={displayBasic2} className="lg:col-3 md:col-3 col-8 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' >
                    <div className='flex flex-column justify-content-center'>
                        <div className='m-3  flex flex-column justify-content-center'>
                            <label htmlFor="username2" className="label-input-sm" style={{ fontSize: '1.5em' }}>Date début : </label>
                            <input id="username2" type={'date'} style={{ height: '40px', borderRadius: '4px', width: '50%', fontWeight: 'bold' }} value={donne.date_deb} aria-describedby="username2-help" className={"form-input-css-tamby"} name='nom' onChange={(e) => { setdonne({ ...donne, date_deb: e.target.value }) }} />
                        </div>
                        <div className='m-3  flex flex-column justify-content-center'>
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
                <div className='grid'>
                    <div className='col-12 pt-0' style={{ borderBottom: '1px solid #efefef' }} >
                        {displayBasic2 ? null :
                            <Button icon={PrimeIcons.SEARCH} tooltip='Recherche Facture' label='Recherche' className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); }} />
                        }
                    </div>
                    <div className="col-12 m-0 p-0">
                        <center className='mt-0 '>
                            <ReactToPrint trigger={() =>
                                <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ' label={'Imprimer'} tooltipOptions={{ position: 'top' }} />
                            } content={() => document.getElementById("scan")} />
                        </center>
                    </div>
                    <div className="col-12 p-0 m-0" id="scan">
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
                                    <div key={index} className='rapportxxx' style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <span class="Style11">CRDT</span>
                                        <table border="0"
                                            style={{ display: "flex", justifyContent: "center" }}>
                                            <tr>
                                                <td width="390">
                                                    <strong>STATISTIQUE PAR EXAMEN du </strong>
                                                    {moment(donne.date_deb).format('DD/MM/YYYY')}
                                                    <strong> au </strong>
                                                    {moment(donne.date_fin).format('DD/MM/YYYY')}
                                                </td>
                                            </tr>
                                        </table>
                                        <br />
                                        <table
                                            class="table"
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
                                                <td class="table" width="186" align="left">
                                                    <div align="center" class="Style1">
                                                        NOMBRE
                                                    </div>
                                                </td>
                                                <td class="table" width="141" align="left">
                                                    <div align="center" class="Style1">
                                                        {" "}
                                                        % NOMBRE
                                                    </div>
                                                </td>
                                                <td class="table" width="383" align="justify">
                                                    <div align="center" class="Style1">
                                                        MONTANT
                                                    </div>
                                                </td>
                                                <td class="table" width="383" align="justify">
                                                    <div align="center" class="Style1">
                                                        % MONTANT
                                                    </div>
                                                </td>
                                            </tr>
                                            {pagededonnees.map((el, i) => (
                                                <tr key={i}>
                                                    <td width="220" class="table" align="left">
                                                        <font size="1">{el.type}</font>
                                                    </td>
                                                    <td width="186" class="table" align="justify">
                                                        <div align="right">
                                                            <font size="1">
                                                                {" "}
                                                                {format(el.nombre, 0, " ")}
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td width="141" class="table" align="justify">
                                                        <div align="right">
                                                            <font size="1">
                                                                {" "}
                                                                {pourc(el.nombre, Examstat.nombre)}
                                                            </font>
                                                        </div>
                                                    </td>
                                                    <td width="383" class="table" align="justify">
                                                        <div align="right">
                                                            <font size="1">{el.montant}</font>
                                                        </div>
                                                    </td>
                                                    <td width="383" class="table" align="justify">
                                                        <div align="right">
                                                            <font size="1">{pourc(el.mont, Examstat.total)}</font>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {index === nombreDePages - 1 && <tr>
                                                <td align="left" class="table">
                                                    <font size="1">
                                                        <strong>TOTAL:</strong>
                                                    </font>
                                                </td>
                                                <td class="table" align="justify">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Examstat.nombre}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td class="table" align="justify">
                                                    <div align="right"></div>
                                                </td>
                                                <td class="table" align="justify">
                                                    <div align="right">
                                                        <font size="1">
                                                            <b>{Examstat.montant}</b>
                                                        </font>
                                                    </div>
                                                </td>
                                                <td class="table" align="justify">
                                                    <div align="right"></div>
                                                </td>
                                            </tr>}
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
                            })
                        )}
                    </div>
                </div>
            </BlockUI>
            {/* ------------------------------------------- */}

        </>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import ReactToPrint from 'react-to-print'
import { Dialog } from 'primereact/dialog';
import { NumberToLetter } from 'convertir-nombre-lettre';


export default function Impression(props) {

    const [Patient, setPatient] = useState([{ num_fact: '', reglement: '' }])

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


    function manisyLettre(nb) {
        let nombre = (nb).toString().split('.');
        let ren = 0;

        if (parseInt(nombre[1]) > 0) {
            ren = NumberToLetter(parseInt(nombre[0])) + ' Ariary ' + NumberToLetter(parseInt(nombre[1]))
        } else {
            ren = NumberToLetter(parseInt(nombre[0]))
        }
        let firstLetter = ren.charAt(0).toUpperCase();
        let nlettren = firstLetter + ren.slice(1);
        return nlettren;
    }

    const renderHeader = (name) => {
        return (
            <div>
                <center>
                    <h4>Récu</h4>
                </center>
            </div>
        );
    }
    /** Fin modal */

    return (
        <>
            <Button icon={PrimeIcons.PRINT} tooltip='Aperçu' className='p-buttom-sm p-1 mr-2 p-button-secondary ' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); }} />

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-5 col-5 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' style={{ padding: '50px', border: '1px solid black' }} >
                    <div id="scan" style={{ color: 'rgb(38 38 38)' }} >
                        <div className='crdt co-12' style={{ position: 'absolute', zIndex: '-1' }}>
                            <h1>CRDT</h1>
                            <h1>CRDT</h1>
                            <h1>CRDT</h1>
                            <h1>CRDT</h1>
                            <h1>CRDT</h1>
                            <h1>CRDT</h1>
                        </div>
                        <div className="flex justify-content-center formgrid grid w-100 " style={{ border: '2px solid white' }}>
                            <div className="field  col-12 flex flex-column align-items-center m-0 mb-5 p-0">

                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h3 className='m-2' >{("Reçu  reglement , date : " + props.data.date_reglement).toUpperCase()}</h3>
                                </div>
                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h3 className='m-2' style={{ fontWeight: 'bold' }} >{("Facture N° : ").toUpperCase()}<u>{props.data.num_fact}</u> </h3>
                                </div>
                            </div>
                            <div className="field  col-12 m-0 p-0" style={{ border: '1px solid white' }}>
                                <div className="field col-12 m-0 p-0 flex flex-row"  >
                                    <table width="60%" border="0" align="center" class="table">
                                        {props.data.type_rglmt == 'P' ?
                                            <tr>
                                                <td class="table-col" width="26%"><strong>PATIENT(E) :</strong></td>
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.patient}</label> </td>
                                            </tr>
                                            :
                                            <tr>
                                                <td class="table-col" width="26%"><strong>CLIENT(E) :</strong></td>
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.client}</label> </td>
                                            </tr>
                                        }
                                    </table>

                                </div>
                                <div className="field col-12 m-0 p-0 flex flex-row"  >
                                    <table width="60%" border="0" align="center" class="table">
                                        <tr>
                                            <td class="table-col" width="26%"><strong>REGLEMENT PAR :</strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em' }}>{props.data.reglement}</label> </td>
                                        </tr>
                                        <tr>
                                            <td class="table-col" width="26%"><strong>RIB :</strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em' }}>{props.data.rib}</label> </td>
                                        </tr>
                                        <tr>
                                            <td class="table-col" width="26%"><strong >MONTANT PAYE :</strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em', fontWeight: '600' }}>{props.format(props.data.montant, 2, ' ')} Ar</label></td>
                                        </tr>
                                        <tr>
                                            <td class="table-col" width="26%"><strong>MONTANT RESTE A PAYER :</strong></td>

                                            {props.data.type_rglmt == 'P' ?
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.format(props.restPat, 2, ' ')} Ar</label> </td>
                                                :
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.format(props.restClie, 2, ' ')} Ar</label> </td>
                                            }
                                        </tr>
                                    </table>
                                </div>
                                <center className='mt-3 p-2'>
                                    <label style={{ fontSize: '1.3em' }}>Arrêté la présente récu à la somme de:</label> <br />
                                    <label style={{ fontSize: '1.3em', fontWeight: '700' }}>
                                        /{manisyLettre(props.data.net)} /
                                        {/* {NumberToLetter(parseFloat(props.data.net).toFixed(0))} Ar  */}

                                    </label><br />

                                </center>
                                <center className='mt-5'>

                                    <label style={{ fontSize: '1.3em' }} >Pour le CRDT</label>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
                <center className='mt-3 '>
                    <ReactToPrint trigger={() =>
                        <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ' label={'Imprimer'} onClick={() => { console.log(props.data) }} tooltipOptions={{ position: 'top' }} />
                    } content={() => document.getElementById("scan")} />
                </center>
            </Dialog>

        </>
    )
}

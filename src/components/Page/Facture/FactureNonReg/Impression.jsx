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

            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-4 md:col-5 col-5 p-0" onHide={() => onHide('displayBasic2')}  >
                <div className='recu-imprime' style={{ padding: '20px', border: '1px solid black' }} >
                    <div id="scan" style={{ color: 'rgb(38 38 38)' }} >
                        <div className="flex justify-content-center formgrid grid w-100 " style={{ border: '2px solid white',position:'relative'}}>
                            <div className='crdt__ co-12 ' style={{ position: 'absolute',alignItems: 'center',paddingTop:'0%',paddingLeft:'0%',transform:'rotate(60deg)'}}>
                                {/* <h1 className='m-0 crdtfont' style={{ fontSize:'10em',color:'rgb(0 0 0 / 6%)' }}>CRDT</h1>
                                <h1 className='m-0 crdtfont' style={{ fontSize:'10em',color:'rgb(0 0 0 / 6%)' }}>CRDT</h1>
                                <h1 className='m-0 crdtfont' style={{ fontSize:'10em',color:'rgb(0 0 0 / 6%)' }}>CRDT</h1> */}
                            </div>
                            <div className="field  col-12 flex flex-column align-items-center m-0 mb-5 p-0" style={{ position:'relative', zIndex:'0'}}>

                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h1 className='m-1' >C.R.D.T.</h1>
                                    <h3 className='m-1' style={{ fontWeight: '500' }} >RCS: 2011B00436 - NIF : 5000434986  </h3>
                                </div>

                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h3 className='m-1' style={{ fontWeight: '500' }} >{("Reçu de règlement").toUpperCase()}</h3>
                                </div>
                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h3 className='m-1' style={{ fontWeight: '500' }} >{("Date : " + props.data.date_reglement).toUpperCase()}</h3>
                                </div>
                              
                                <div className="field col-12 m-0 p-0" style={{ border: '1px solid white', textAlign: 'center' }} >
                                    <h3 className='m-1' style={{ fontWeight: '500' }} >{("Facture N° : ").toUpperCase()}{props.data.num_fact} </h3>
                                </div>
                            </div>
                            <div className="field  col-12 m-0 p-0" style={{ border: '1px solid white' }}>
                                <div className="field col-12 m-0 p-0 flex flex-row"  >
                                    <table width="100%" border="0" align="center" class="table">
                                        {props.data.type_rglmt == 'P' ?
                                            <tr>
                                                <td class="table-col" width="26%"><strong>PATIENT(E) </strong></td>
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.patient}</label> </td>
                                            </tr>
                                            :
                                            <tr>
                                                <td class="table-col" width="26%"><strong>CLIENT(E) </strong></td>
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.client}</label> </td>
                                            </tr>
                                        }
                                    </table>

                                </div>
                                <div className="field col-12 m-0 p-0 flex flex-row"  >
                                    <table width="100%" border="0" align="center" class="table m-0">
                                        <tr>
                                            <td class="table-col" width="26%"><strong>REGLEMENT PAR </strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em' }}>{props.data.reglement}</label> </td>
                                        </tr>
                                        {/* <tr>
                                            <td class="table-col" width="26%"><strong>RIB :</strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em' }}>{props.data.rib}</label> </td>
                                        </tr> */}
                                        <tr>
                                            <td class="table-col" width="26%"><strong >MONTANT PAYE </strong></td>
                                            <td colspan="2" class="table-col" width="26%"> <label style={{ fontSize: '1.3em', fontWeight: '700' }}>{props.format(props.data.montant, 2, ' ')} Ar</label></td>
                                        </tr>
                                        {/* <tr>
                                            <td class="table-col" width="26%"><strong>MONTANT RESTE A PAYER :</strong></td>

                                            {props.data.type_rglmt == 'P' ?
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.format(props.restPat, 2, ' ')} Ar</label> </td>
                                                :
                                                <td colspan="2" class="table-col"> <label style={{ fontSize: '1.3em' }}>{props.format(props.restClie, 2, ' ')} Ar</label> </td>
                                            }
                                        </tr> */}
                                    </table>
                                </div>
                                <center className='mt-3 p-2'>
                                    <label style={{ fontSize: '1.3em' }}>Arrêté le présent récu à la somme de:</label> <br />
                                    <label style={{ fontSize: '1.3em', fontWeight: '500' }}>
                                        /{manisyLettre(props.data.net)} Ariary /
                                    </label><br />
                                </center>
                                {/* <center className='mt-2'>

                                    <label style={{ fontSize: '1.3em' }} >Pour le CRDT</label>
                                </center> */}
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

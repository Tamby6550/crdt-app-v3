import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { PrimeIcons } from 'primereact/api';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button'

export default function ModeReglement(props) {

  const [infoReglment, setinfoReglment] = useState({
    nom: '',
    desc: ''
  });
  const [charge, setcharge] = useState({ chajoute: false });


  const onVideInfo = () => {
    setinfoReglment({nom: '',
    desc: ''})
  }
  const onChangeValue = (e) => {
    setinfoReglment({ ...infoReglment, [e.target.name]: e.target.value })
  }

  //Affichage notification Toast primereact (del :7s )
  const toastTR = useRef(null);
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
  }


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

  const renderFooter = (name) => {
    return (
      <div>
        <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
      </div>
    );
  }
  const renderHeader = (name) => {
    return (
      <div>
        <h4 className='mb-1'>Nouveau Patient </h4>
        <hr />
      </div>
    );
  }
  /** Fin modal */


  const onSub = async () => { //Ajout de donnees vers Laravel
    setcharge({ chajoute: true });
    await axios.post(props.url + 'insertReglement', infoReglment)
        .then(res => {
            notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
            setcharge({ chajoute: false });
            setTimeout(() => {
                props.setrefresh(1);
                onVideInfo()
                onHide('displayBasic2');
            }, 900)
            // console.log(res.data.message)
        })
        .catch(err => {
            console.log(err);
            notificationAction('error', 'Erreur', err.data.message);//message avy @back
            setcharge({ chajoute: false });
        });
}

  return (
    <div>
      <Toast ref={toastTR} position="top-right" />
      <Button icon={PrimeIcons.PLUS} tooltip='Nouvelle Règlement' tooltipOptions={{ position: 'top' }} label='Nouvelle' className='mr-2 p-button-primary' onClick={() => { onClick('displayBasic2');  }} />
      <div className='grid'>
        <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-4 md:col-5 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
          <div className="p-1 style-modal-tamby" >
            <form className='flex flex-column justify-content-center'>
              <div className="field   lg:col-12 md:col-12 col:12 my-1 flex flex-column">
                <div className="p-fluid px-4 formgrid grid">      <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">

                  <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                    <label className="label-input-sm">Libellé</label>
                    <InputText id="username2" aria-describedby="username2-help" name='nom' value={infoReglment.nom} onChange={(e) => { onChangeValue(e) }} />
                  </div>
                  <div className='flex lg:flex-row md:flex-column justify-content-between flex-column col-12 p-0'>
                    <div className="field   lg:col-12 md:col-12 col:12 m-0 p-0">
                      <label htmlFor="username2" style={{ fontWeight: '500' }} className="label-input-sm">Status</label>
                      <InputTextarea rows={'10'} cols={'30'} name='desc' style={{ border: '1px solid grey', height: '50px' }} value={infoReglment.desc} onChange={(e) => { onChangeValue(e) }} />
                    </div>
                  </div>
                </div>
                </div>
              </div >

            </form>
            <div className='flex mt-3 mr-4 justify-content-end'>
              <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                if ( infoReglment.nom=='') {
                 alert('Verifier votre champ !');
                } else {
                  onSub();
                }
              }} />
            </div>
          </div>
        </Dialog>
      </div>
    </div>

  )
}

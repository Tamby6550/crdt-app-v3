
import React, { useRef, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast';
import axios from 'axios';
import ModeReglement from './ModeReglement';
import Modification from './Modification';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button'
import CryptoJS from 'crypto-js';

export default function SaisieReglement(props) {

  const secret= "tamby6550";
  const decrypt = () => {
      const virus = localStorage.getItem("virus");
      const decryptedData = CryptoJS.AES.decrypt(virus, secret);
      const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(dataString);
      return { data };
  }


  const [user, setuser] = useState('');
  useEffect(() => {
       setuser(decrypt().data.login)
   }, [decrypt().data.login]);

  const [infoReglment, setinfoReglment] = useState({
    nom: '',
    desc: ''
  });
  const [listReglement, setlistReglement] = useState([
    {
      reglement_id: "",
      libelle: "",
      description: "",
    }
  ]);
  const [charge, setCharge] = useState(false);
  const [refresh, setrefresh] = useState(0)

  //Affichage notification Toast primereact (del :7s )
  const toastTR = useRef(null);
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
  }
  const stylebtnDetele = {
    fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
  };

  const loadReglemnt = async () => {
    setCharge(true)
    await axios.get(props.url + `getAllReglementFact`)
      .then(
        (results) => {
          setrefresh(0);
          setlistReglement(results.data);
          setCharge(false)
        }
      );
  }

  useEffect(() => {
    loadReglemnt();
  }, [refresh])




  const header = (
    <div className='flex flex-row justify-content-between align-items-center m-0 '>
      <div className='my-0 ml-2 py-2 flex'>
        <ModeReglement url={props.url} setrefresh={setrefresh} />
      </div>
      <label >Liste des reglements</label>
      <label style={{visibility:'hidden'}}>Liste des Patients</label>
    </div>
  )

  const bodyBoutton = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        
          <Modification data={data} url={props.url} setrefresh={setrefresh} />
          <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
            onClick={() => {

              const accept = () => {
                axios.delete(props.url + `deleteReglementFact/${data.reglement_id}`)
                  .then(res => {
                    notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                    setrefresh(1)
                  })
                  .catch(err => {
                    console.log(err);
                    notificationAction('error', 'Suppression non reuissie !', 'Enregirement non supprimer !');
                  })
              }
              const reject = () => {
                return null;
              }
              confirmDialog({
                message: 'Voulez vous supprimer l\'enregistrement : ' + data.libelle,
                header: 'Suppression  ',
                icon: 'pi pi-exclamation-circle',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Ok',
                rejectLabel: 'Annuler',
                accept,
                reject
              });
            }} />
      
      </div>
    )
  }

if (decrypt().data.login=='admin') {
  return (
    <div className="card">
      <Toast ref={toastTR} position="top-right" />
      <ConfirmDialog></ConfirmDialog>
      <div className="p-fluid  formgrid grid">
        <div className="field px-4  lg:col-12 md:col-12 col:12 my-1 flex flex-column">
          <DataTable header={header} value={listReglement} scrollable scrollHeight="500px" loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun réglement "} style={{ fontSize: '0.98em' }} >
            <Column field='reglement_id' header={'Id'}></Column>
            <Column field={'libelle'} header={'Libellé'} ></Column>
            <Column field={'description'} header="Déscription"></Column>
            <Column header="Acction" body={bodyBoutton} align={'left'}></Column>

          </DataTable>
        </div>
      </div>
    </div>
  );
}
else{
  return(
    <center><h1>Spécial pour l'admin !</h1></center>
  );
}
}
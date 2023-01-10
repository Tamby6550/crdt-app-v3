import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Modifier from './Patient_Jour/Modifier'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import Recherche from './Patient_Jour/Recherche'
import { Tag } from 'primereact/tag';

export default function ExamenJour(props) {

  //Chargement de données
  const [charge, setCharge] = useState(false);
  const [refreshData, setrefreshData] = useState(0);
  const [listRegistre, setlistRegistre] = useState([{ numero: '', date_arr: '', id_patient: '', type_pat: '', verf_exam: '', nom: '', date_naiss: '', telephone: '' }]);
  const [infoRegistre, setinfoRegistre] = useState({ num_arriv: '', date_arriv: '', id_patient: '' });

  const onVide = () => {
    setinfoRegistre({ num_arriv: '', date_arriv: '', id_patient: '' })
  }


  /**Style css */
  const stylebtnRec = {
    fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgb(63 209 116)'
  };
  const stylebtnDetele = {
    fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
  };

  /**Style css */

  const toastTR = useRef(null);
  /*Notification Toast */
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
  }


  //Get List patient
  const loadData = async () => {
    onVide();
    await axios.get(props.url + `getListRegistre`)
      .then(
        (result) => {
          setrefreshData(0);
          setlistRegistre(result.data);
          setCharge(false);
        }
      );
  }

  useEffect(() => {
    setCharge(true);
    setlistRegistre([{ id_patient: 'Chargement de données...' }])
    setTimeout(() => {
      loadData();
    }, 200)
  }, [refreshData]);




  const header = (
    <div className='flex flex-row justify-content-between align-items-center m-0 '>
      <div className='my-0 ml-2 py-2 flex'>
        <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setinfoRegistre={setinfoRegistre} setlistRegistre={setlistRegistre} setrefreshData={setrefreshData} url={props.url} />
        {infoRegistre.date_arriv == "" && infoRegistre.id_patient == "" && infoRegistre.num_arriv == "" ? null : <label className='ml-5 mt-2'>Resultat de recherche ,   Date : <i style={{ fontWeight: '700' }}>"{infoRegistre.date_arriv}"</i>  , N° dans le jornal : <i style={{ fontWeight: '700' }}>"{(infoRegistre.num_arriv).toUpperCase()}"</i> , Id patient : <i style={{ fontWeight: '700' }}>"{(infoRegistre.id_patient).toUpperCase()}"</i>  </label>}
      </div>
      {infoRegistre.date_arriv != "" || infoRegistre.id_patient != "" || infoRegistre.num_arriv != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
        :
        < >
          <label >Journal d'entré  </label>
          <label style={{ visibility: 'hidden' }} >Liste patients du journal</label>
        </>
      }
    </div>
  )

  const bodyBoutton = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          <Modifier url={props.url} data={data} setrefreshData={setrefreshData} />
          {data.verf_exam == '0' ?
            <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
              onClick={() => {
                let dt=(data.date_arr).split('/');
                let cmpltDate=dt[0]+'-'+dt[1]+'-'+dt[2];

                const accept = () => {
                  axios.delete(props.url + `deleteRegistre/${data.numero}&${cmpltDate}`)
                    .then(res => {
                      notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                      setrefreshData(1)
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
                  message: 'Voulez vous supprimer le journal d\'arrivée , n° ' + data.numero+' , date : '+data.date_arr,
                  header: 'Suppression  ',
                  icon: 'pi pi-exclamation-circle',
                  acceptClassName: 'p-button-danger',
                  acceptLabel: 'Ok',
                  rejectLabel: 'Annuler',
                  accept,
                  reject
                });
              }} />
            :
            null
          }
        </div>
      </div>
    )
  }

  const bodyBouttonh = (data) => {
    return (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0  py-2'>
                <label htmlFor="">{data.date_arr} </label>
                {data.date_arrive == data.jourj ?
                    // <Tag className="mr-2 " icon={PrimeIcons.CHECK_SQUARE} severity={"success"}   ></Tag>
                    null
                    :
                    <Tag className="mr-2 " severity={"warning"}  icon={PrimeIcons.CLOCK} ></Tag>
                }
            </div>
        </div>
    )
}

  return (
    <>
      <Toast ref={toastTR} position="top-right" />
      <ConfirmDialog />

      <div className="flex flex-column justify-content-center">
        <DataTable header={header} value={listRegistre} loading={charge} responsiveLayout="scroll" scrollable scrollHeight="550px" className='bg-white' emptyMessage={"Aucun patient enregistré sur le journal "} >
          <Column field='numero' header="N° Arrivée" style={{ fontWeight: '700' }}></Column>
          <Column field={'date_arr'} header="Date Arrivée" body={bodyBouttonh} style={{ fontWeight: '600' }}></Column>
          <Column field={'id_patient'} header="Id Patient" style={{ fontWeight: '600' }}></Column>
          <Column field='nom' header="Nom"></Column>
          <Column field='date_naiss' header="Date_Naiss"></Column>
          <Column field='type_pat' header="Tarif"></Column>
          <Column header="Action" body={bodyBoutton} align={'left'}></Column>

        </DataTable>
      </div>
    </>
  )
}

import logo from './images/crdt.jpg';
import './App.css';
import Header from './components/Header/Header';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Route, Routes, useLocation } from 'react-router-dom';
import Patient from './components/Page/Patient'
import { BreadCrumb } from 'primereact/breadcrumb'
import Facture from './components/Page/Facture';
import Impression from './components/Page/Facture/Impression'
import Details from './components/Page/Facture/Details'
import Annulation from './components/Page/Facture/Annulation'
import Client from './components/Page/Client';
import Accueil from './components/Page/Accueil';
import Prescripteur from './components/Page/Prescripteur';

import Examen from './components/Page/Examen';
import PatientJour from './components/Page/Examen/PatientJour';
import ExamenJour from './components/Page/Examen/ExamenJour';
import SaisieReglement from './components/Page/Reglement/SaisieReglement';
import ModePaiment from './components/Page/Reglement/ModePaiment';

function App() {
  const url = "http://127.0.0.1:8000/api/";
  const { pathname } = useLocation();
  const bred = pathname.slice(1);
  const items = [
    { label: bred }
  ]
  const reglement = [
    { label: "Reglement" },
    { label: bred }
  ]
  const referentielss = [
    { label: "Référentiels" },
    { label: bred }
  ]
  const factures = [
    { label: "Facture" },
    { label: bred }
  ]
  const Home = { icon: 'pi pi-home' }
  return (
    <div className="App p-0" >
      <div className='grid p-0 mb-3' style={{ minWidth: "500px" }}>
        <div className='col-12 '>
          <div className='grid p-0'>
            <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0">
              <Card className=' custom-card-haut p-0 flex align-items-center justify-content-center'>
                <div className='flex justify-content-center pb-2'>
                  <img src={logo} className="w-full max-h-5rem" />
                </div>
              </Card>
        
            </div>
            <div className='lg:col-10 md:col-10 sm:col-9 col-9 pl-2 p-0'>
              <Card className='h-full custom-card-haut p-0 flex align-items-center justify-content-center'  >
                <div className='flex justify-content-center h-full w-full' >

                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='grid p-0'>
         
              <Header />
          
            <div className='lg:col-10 md:col-10 sm:col-9 col-9 pl-2 p-0'>
              <div className=''>
                <div className='col-12'>
                  <div className='grid'>
                    <div className='lg:col-9 sm:col-12 col-12'>

                      {bred === "mode_paiement" || bred === "saisie_reglement" ?
                        <BreadCrumb model={reglement} home={Home} className=" w-full" />
                        :
                        bred === "client" || bred === "examen" || bred === "patient" || bred === "prescripteur" ?
                          <BreadCrumb model={referentielss} home={Home} className=" w-full" />
                          :
                          bred === "ajout" || bred === "details" || bred === "impression" || bred === "annulation" ?
                            <BreadCrumb model={factures} home={Home} className=" w-full" />
                            :
                            <BreadCrumb model={items} home={Home} className=" w-full" />
                      }
                    </div>
                    <div className='lg:col-3 sm:col-12 col-12 pt-0 flex justify-content-end'>
                      <Button label='Deconnecter' icon='pi pi-power-off' className='p-button-primary'></Button>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <Routes>
                    <Route path='/facture' element={<Facture url={url} />} />
                    <Route path='/prescripteur' element={<Prescripteur url={url} />} />
                    <Route path='/client' element={<Client url={url} />} />
                    <Route path='/examen' element={<Examen url={url} />} />
                    <Route path='/patient' element={<Patient url={url} />} />
                    <Route path='/saisie_reglement' element={<SaisieReglement url={url} />} />
                    <Route path='/mode_paiement' element={<ModePaiment url={url} />} />
                    <Route path='/facture' element={<Facture url={url} />} />
                    <Route path='/details' element={<Details url={url} />} />
                    <Route path='/impression' element={<Impression url={url} />} />
                    <Route path='/annulation' element={<Annulation url={url} />} />
                    <Route path='/patient_jour' element={<PatientJour url={url} />} />
                    <Route path='/examen_jour' element={<ExamenJour url={url} />} />
                    <Route path='/' element={<Accueil url={url} />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;

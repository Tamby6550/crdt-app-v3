import logo from './images/crdt.jpg';
import './App.css';
import './table.css';
import './test.css';

import Header from './components/Header/Header';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Route, Routes, useLocation } from 'react-router-dom';
import Patient from './components/Page/Patient'
import { BreadCrumb } from 'primereact/breadcrumb'
import Facture from './components/Page/Facture';

import Client from './components/Page/Client';
import Accueil from './components/Page/Accueil';
import Prescripteur from './components/Page/Prescripteur';

import Examen from './components/Page/Examen';
import PatientJour from './components/Page/Examen/PatientJour';
import ExamenJour from './components/Page/Examen/ExamenJour';
import SaisieReglement from './components/Page/Reglement/SaisieReglement';
import ModePaiment from './components/Page/Reglement/ModePaiment';
import FactureJour from './components/Page/Rapport/FactureJ/FactureJour'
import StatExamen from './components/Page/Rapport/Examen/StatExamen';
import StatExamenDetaille from './components/Page/Rapport/Examen/StatExamenDetaille'
import VirementJour from './components/Page/Rapport/VirementJ/VirementJour';
import Recettejour from './components/Page/Rapport/RecetteJ/RecetteJour';
import Formulaire from './components/Page/TEST/Formulaire';
import StatCategorie from './components/Page/Rapport/Categorie/StatCategorie';
import CumulCA from './components/Page/Rapport/CumulCA/CumulCA';
import StatClient from './components/Page/Rapport/StatClient/StatClient';
import StatPrescripteur from './components/Page/Rapport/StatPrescripteur/StatPrescripteur';
import ReleveFacture from './components/Page/Rapport/ReleveFact/ReleveFacture';
import JournalJour from './components/Page/Rapport/JournalJ/JournalJour'; 
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
  const rapport = [
    { label: "Rapport" },
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
                          bred === "facture_jour" || bred === "recette_jour" || bred === "virement_jour" || bred === "stat_examen"|| bred === "stat_client" 
                          || bred === "stat_detail_examen" || bred === "stat_prescripteur" || bred === "stat_categorie" 
                          || bred === "cumul_chiffre_affaire" || bred === "releve_facture" ||bred === "journal_jour" ?
                            <BreadCrumb model={rapport} home={Home} className=" w-full" />
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
                    <Route path='/prescripteur' element={<Prescripteur url={url} />} />
                    <Route path='/client' element={<Client url={url} />} />
                    <Route path='/examen' element={<Examen url={url} />} />
                    <Route path='/patient' element={<Patient url={url} />} />
                    <Route path='/saisie_reglement' element={<SaisieReglement url={url} />} />
                    <Route path='/mode_paiement' element={<ModePaiment url={url} />} />
                    <Route path='/facture' element={<Facture url={url} />} />
                    <Route path='/patient_jour' element={<PatientJour url={url} />} />
                    <Route path='/examen_jour' element={<ExamenJour url={url} />} />
                    <Route path='/facture_jour' element={<FactureJour url={url} />} />
                    <Route path='/stat_examen' element={<StatExamen url={url} />} />
                    <Route path='/stat_detail_examen' element={<StatExamenDetaille url={url} />} />
                    <Route path='/virement_jour' element={<VirementJour url={url} />} />
                    <Route path='/recette_jour' element={<Recettejour url={url} />} />
                    <Route path='/stat_categorie' element={<StatCategorie url={url} />} />
                    <Route path='/cumul_chiffre_affaire' element={<CumulCA url={url} />} />
                    <Route path='/stat_client' element={<StatClient url={url} />} />
                    <Route path='/stat_prescripteur' element={<StatPrescripteur url={url} />} />
                    <Route path='/releve_facture' element={<ReleveFacture url={url} />} />
                    <Route path='/journal_jour' element={<JournalJour url={url} />} />
                    <Route path='/test' element={<Formulaire url={url} />} />
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

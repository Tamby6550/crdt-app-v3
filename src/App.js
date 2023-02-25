import logo from './images/crdt.png';
import logoH from './images/Capture.PNG';
import './App.css';
import './table.css';
import './test.css';
import React,{useState,useEffect,useRef} from 'react';
import { Dialog } from 'primereact/dialog';
import { PrimeIcons } from 'primereact/api';
import Header from './components/Header/Header';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Outlet, Route, Routes, useLocation,useNavigate } from 'react-router-dom';
import Patient from './components/Page/Patient'
import { BreadCrumb } from 'primereact/breadcrumb'
import Facture from './components/Page/Facture';
import * as Components  from './components/Login/Components'
import Client from './components/Page/Client';
import Accueil from './components/Page/Accueil';
import Prescripteur from './components/Page/Prescripteur';
import axios from 'axios';
import Examen from './components/Page/Examen';
import PatientJour from './components/Page/Examen/PatientJour';
import ExamenJour from './components/Page/Examen/ExamenJour';
import SaisieReglement from './components/Page/Reglement/SaisieReglement';
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
import Signin from './components/Login/Signin'
import useAuth from './components/Login/useAuth';
import CryptoJS from 'crypto-js';
import LogoutTimer from './components/Login/LogoutTimer';
import { Toast } from 'primereact/toast';
import ExamenJours from './components/Page/Rapport/ExamenJour/ExamenJour';
import InsertModel from './components/Page/ModelCR/InsertModel';
function App() {


    const { logout, isAuthenticated, secret } = useAuth();

    const handleLogout = () => {
        logout();
    };

   

    const [chmdp, setchmdp] = useState({an_mdp:'',user:'',nv_mdp:''});
    const [verfConfirm, setverfConfirm] = useState(false);
    const [chargementCH, setchargementCH] = useState(false);
    const [voirmdp, setvoirmdp] = useState(false);

    const onChargeDonneChMdp = (e) => {
        setchmdp({ ...chmdp,user:decrypt().data.login, [e.target.name]: e.target.value })
    }

    const decrypt = () => {

        const virus = localStorage.getItem("virus");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        
        return { data }
    }
    const navigate = useNavigate()

    // const [url, seturl] = useState('http://127.0.0.1:8000/api/') //pour php 7.4.33
    const [url, seturl] = useState('http://localhost:8000/') //pour php 5.5

    //Rehefa deployer, commentena refa en mode dev
    // const urlip=()=>{
    //     let ip = window.location.hostname;
    //     let urls ='http://'+ip+':3353/api/'
    //     seturl(urls);
    // }

    // useEffect(() => {
    //     urlip()
    // }, [navigate])
    

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
                 <h4 className='mb-1'>Modification mot de passe</h4>
                 <hr />
             </div>
         );
     }
     /** Fin modal */
     const toastTR = useRef(null);
     /*Notification Toast */
     const notificationAction = (etat, titre, message) => {
       toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
     }

     const changeMdp = async () => {
        setchargementCH(true)
        try {
            await axios.post(url + 'changemdp', chmdp).then(res => {
                console.log(res.data)
                notificationAction(res.data.etat, res.data.situation, res.data.message);      
                setchargementCH(false);
                if (res.data.etat=='success') {
                    onHide('displayBasic2');
                    setTimeout(() => {
                       alert('Vous allez rediriger vers la page login pour la modification de mot de passe')
                        logout();
                    }, 1000);
                }
            })
            .catch(err => {
                    setchargementCH(false)
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="App p-0" >
                        <Toast ref={toastTR} position="top-center" />

             <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-3 md:col-5 col-8 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <Components.Label >Ancien mot de passe </Components.Label>
                        <Components.Input type='password' placeholder='Ancien mot de passe'  name='an_mdp' onChange={onChargeDonneChMdp} />
                        <div className='mt-2'>
                            <Components.Label >Nouveau mot de passe </Components.Label>
                            <Components.Input type='password' placeholder='Nouveau mot de passe'  name='nv_mdp' onChange={onChargeDonneChMdp} />
                            <div className='m-0 p-0 flex ' style={{alignItems:'center'}} >
                            <Components.Input type={voirmdp? 'text' :'password'}  placeholder='Confirmer le mot de passe'  name='cof_mdp' onChange={onChargeDonneChMdp}  />
                            <Button icon={!voirmdp? PrimeIcons.EYE:PrimeIcons.EYE_SLASH} style={{height:'100%'}} className='p-button-secondary' onClick={()=>{setvoirmdp(!voirmdp)}} ></Button>
                            </div>
                          <center>
                             {verfConfirm ? <label id="username2-help" className="p-error block">Votre mot de passe n'est pas identique !</label> : null}
                            </center> 
                        </div>
                    </div>
                    <center>
                    <Button   label={chargementCH? '...' :'Sauvegarder la modification'} tooltipOptions={{position:'top'}} style={{fontWeight:'600',fontSize:'1em'}}  className=' p-button-primary ' 
                        onClick={() => {
                            if (chmdp.an_mdp=='' || chmdp.nv_mdp==''|| chmdp.cof_mdp=='') {
                                alert('Verifer votre champ !')
                            }else{
                                if (chmdp.nv_mdp!=chmdp.cof_mdp) {
                                    setverfConfirm(true)
                                }else{
                                    setverfConfirm(false);
                                    changeMdp();
                                }
                            }
                        }}  
                    /> 
                    </center>
                </div>
            </Dialog>
            {isAuthenticated ?
                <LogoutTimer logoutTime={600} onLogout={handleLogout} />
                :
                null
            }
            <Routes>
                <Route element={<div className='grid p-0 mb-3' style={{ minWidth: "500px" }}>
                    <div className='grid col-12 tete-logo flex justify-content-between h-3em ' style={{ alignItems: 'center',background:'linear-gradient(to right, rgb(241 232 206), rgb(255 254 251))',height: '100px' }} >
                        <div className='col-2 m-0'  >
                            <img src={logo} style={{width:'250px',height:'90px'}} />

                        </div>
                        <div className='col-10 p-0' >
                            <i>
                            <h3>1578x100</h3>
                            </i>
                            {/* <img src={logoH} className=" max-h-4rem flex m-2 headerimg" /> */}
                        </div>
                      

                    </div>
                    <div className='col-12 container-tamby'>
                        <div className='grid p-0 pl-1'>
                            <Header />
                            <div className='lg:col-10 md:col-10 sm:col-12 col-12 pl-2 p-0' style={{ color: '#0B0C28' }}>
                                <div className=''>
                                    <div className='col-12'>
                                        <div className='grid'>
                                            <div className='lg:col-8 sm:col-8 col-8'>

                                                {bred === "mode_paiement" || bred === "saisie_reglement" ?
                                                    <BreadCrumb model={reglement} home={Home} className=" w-full" />
                                                    :
                                                    bred === "client" || bred === "examen" || bred === "patient" || bred === "prescripteur" ?
                                                        <BreadCrumb model={referentielss} home={Home} className=" w-full" />
                                                        :
                                                        bred === "ajout" || bred === "details" || bred === "impression" || bred === "annulation" ?
                                                            <BreadCrumb model={factures} home={Home} className=" w-full" />
                                                            :
                                                            bred === "facture_jour" || bred === "recette_jour" || bred === "virement_jour" || bred === "stat_examen" || bred === "stat_client"
                                                                || bred === "stat_detail_examen" || bred === "stat_prescripteur" || bred === "stat_categorie"
                                                                || bred === "cumul_chiffre_affaire" || bred === "releve_facture"  ||bred === "examen_jour" || bred === "journal_jour" ?
                                                                <BreadCrumb model={rapport} home={Home} className=" w-full" />
                                                                :
                                                                <BreadCrumb model={items} home={Home} className=" w-full" />
                                                }
                                            </div>
                                            <div className='lg:col-4 sm:col-4 col-4 pt-0 flex justify-content-end ' style={{alignItems: 'baseline'}}  >
                                            <Button   label='Changer le mot de passe' tooltipOptions={{position:'top'}} style={{fontWeight:'600',fontSize:'1em'}}  className=' p-button-text ' onClick={() => { onClick('displayBasic2');  }}  >
                                           
                                           </Button>
                                                <Button tooltip='Déconnecter' label='Déconnecter' tooltipOptions={{ position: 'top' }} style={{ fontWeight: '600', fontSize: '1.1em' }} icon='pi pi-power-off' className='p-button-danger p-button-text mt-2 ' onClick={logout} >

                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <Outlet />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className='col-12 tete-logo flex justify-content-center h-2em'>
                            <small style={{color:'gray'}} >Copyright © 2023, Centre de RadioDiagnostic et de Thérapie design by tambyarimisaemit@gmail.com</small>
                        </footer>
                    </div>
                </div>
                }>
                    <Route path='/prescripteur' element={<Prescripteur url={url} />} />
                    <Route path='/client' element={<Client url={url} />} />
                    <Route path='/examen' element={<Examen url={url} />} />
                    <Route path='/patient' element={<Patient url={url} />} />
                    <Route path='/saisie_reglement' element={<SaisieReglement url={url} />} />
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
                    <Route path='/rapport_examen_jour' element={<ExamenJours url={url} />} />
                    <Route path='/modele_cr' element={<InsertModel url={url} />} />
                    <Route path='/test' element={<Formulaire url={url} />} />
                    <Route path='/acceuil' element={<Accueil url={url} />} />
                </Route>

                <Route path='/' element={<Signin url={url} />} />
            </Routes>
        </div>
    );
}

export default App;

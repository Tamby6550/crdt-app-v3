import React, { useState, useEffect, useRef } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import axios from 'axios';
import useAuth from './useAuth';
import CryptoJS from 'crypto-js';

// import * as Components from './Components';
import { Toast } from 'primereact/toast';


export default function Signin(props) {

    const { login, notif, chargement, inscriptionlogin } = useAuth();

    const [signIn, toggle] = React.useState(true);
    const [infoLogin, setinfoLogin] = useState({ info: 'crdtfact', login: '', password: '' });

    const [refreshData, setrefreshData] = useState(0);

    const [verfChamp, setverfChamp] = useState({ login: false, password: false })
    const onChargeDonne = (e) => {
        setinfoLogin({ ...infoLogin, [e.target.name]: e.target.value })
    }






    /*Notification Toast */
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    useEffect(() => {
        if (notif != 'Login ou mot de passe erronne , Merci de verifier' && notif !='') {
            notificationAction('success', 'Bievenue dans l\'APP CRDT', '');
        }else if(notif == 'Login ou mot de passe erronne , Merci de verifier') {
            notificationAction('warn', 'Login ou mot de passe erronne , Merci de verifier', '');
        }
    }, [notif])

    const onverfCh = () => {
        if (infoLogin.login == "") {
            setverfChamp({ login: true, password: false });
            alert('Verifier votre champ')
        }

        if (infoLogin.password == "") {
            setverfChamp({ login: false, password: true });
            alert('Verifier votre champ')
        }
        else {
            if (infoLogin.login != "" && infoLogin.password != "" ) {
                setverfChamp({ login: false, password: false });
                onSub();
            }
        }
    }

    //Login
    const onSub = () => {
        login(infoLogin, props.url)
    }

    return (
        <div className='flex flex-row justify-content-center  align-items-center m-0 w-full '>
            <Toast ref={toastTR} position="top-center" />
            <input type="text" placeholder='nom utilisateur' name='login' onChange={(e) => { onChargeDonne(e) }} />
            <input type="password" placeholder='mot de passe' name='password' onChange={(e) => { onChargeDonne(e) }} />
            <input type="button" value="Connexion"  onClick={() => { onverfCh() }} />
            {/* <Components.Container class='.login-page' >
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Création du compte</Components.Title>
                        <Components.Input type='text' className={verfChampIns.rm_nom ? "fform-invalid" : ''} placeholder='Nom utilisateur' style={{ marginBottom: '20px' }} name='rm_nom' onChange={(e) => { onChargeDonneInscription(e) }} />
                        {verfChampIns.rm_nom ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Input type='password' placeholder='Password' className={verfChampIns.motpasse ? "fform-invalid" : ''} name='rm_mdp' onChange={(e) => { onChargeDonneInscription(e) }} />
                        {verfChampIns.motpasse ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}

                        <Components.Label >Grade </Components.Label>
                        <Components.Select name='grad_id' onChange={(e) => { onChargeDonneInscription(e) }} className={verfChampIns.grad_id ? "fform-invalid" : ''} >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {grade.map((gr, index) => (
                                <Components.Option value={gr.grad_id} key={index} >{gr.grad_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChampIns.grad_id ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Label >Mention</Components.Label>
                        <Components.Select name='mention_nom' onChange={(e) => { onChargeDonneInscription(e) }} className={verfChampIns.mention ? "fform-invalid" : ''}  >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {mention.map((mt, index) => (
                                <Components.Option value={mt.mention_nom} key={index} >{mt.mention_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChampIns.mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Button onClick={() => { onverfChInscription() }}>{chargement ? '...' : 'Inscrire'}</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Login</Components.Title>

                        <Components.Label >Mention</Components.Label>
                        <Components.Select name='mention' onChange={(e) => { onChargeDonne(e) }} className={verfChamp.mention ? "fform-invalid" : ''}  >
                            <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                            {mention.map((mt, index) => (
                                <Components.Option value={mt.mention_nom} key={index} >{mt.mention_nom}</Components.Option>
                            ))}
                        </Components.Select>
                        {verfChamp.mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}

                        {verfadmin ? null :
                            <>
                                <Components.Label >Grade </Components.Label>
                                <Components.Select name='grad_id' onChange={(e) => { onChargeDonne(e) }} className={verfChamp.grad_id ? "fform-invalid" : ''} >
                                    <Components.Option value={''}  >{charge ? 'Chargement...' : ''}</Components.Option>
                                    {grade.map((gr, index) => (
                                        <Components.Option value={gr.grad_id} key={index} >{gr.grad_nom}</Components.Option>
                                    ))}
                                </Components.Select>
                                {verfChamp.grad_id ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </>
                        }
                        <Components.Label >Mot de passe </Components.Label>
                        <Components.Input type='password' placeholder='Password' className={verfChamp.motpasse ? "fform-invalid" : ''} name='motpasse' onChange={(e) => { onChargeDonne(e) }} />
                        {verfChamp.motpasse ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                        <Components.Button onClick={() => { onverfCh() }} className='chargement-login mt-5' > {chargement ? '...' : 'Connecter'} </Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Page d'inscription</Components.Title>
                            <Components.Paragraph>
                                Choississez vos informations
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)}>
                                Se connecter
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title style={{ color: '#546372', fontSize: '1.6em' }} >Application pour le suivi pédagogique</Components.Title>
                            <Components.Paragraph>
                                <img src={emit} alt="" width={"148px"} />
                            </Components.Paragraph>
                            <Components.GhostButton style={{ display: 'none' }} onClick={() => toggle(false)}>
                                S'inscrire
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container> */}
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import axios from 'axios';
import useAuth from './useAuth';
import CryptoJS from 'crypto-js';
import logo from '../../images/crdt.png';

import * as Components from './Components';
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
            <Components.Container class='.login-page' >
                

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Login</Components.Title>

                        <Components.Label >Nom utilisateur </Components.Label>
                        <Components.Input type='text' placeholder='Login' name='login' onChange={(e) => { onChargeDonne(e) }} />
                        <Components.Label >Mot de passe </Components.Label>
                        <Components.Input type='password' placeholder='Password'  name='password' onChange={(e) => { onChargeDonne(e) }} />
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
                            <Components.Title style={{ color: '#546372', fontSize: '1.6em' }} >Centre de RadioDiagnostic et de Thérapie</Components.Title>
                            <Components.Paragraph>
                                <img src={logo} alt="" width={"148px"} />
                            </Components.Paragraph>
                            <Components.GhostButton style={{ display: 'none' }} onClick={() => toggle(false)}>
                                S'inscrire
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>
        </div>
    );
}

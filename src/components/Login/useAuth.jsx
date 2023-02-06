import { useState, useEffect,useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const useAuth = () => {


    const secret= "tamby6550";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const [chargement, setchargement] = useState(false)
    const [notif, setnotif] = useState('');

    const [loginpass, setloginpass] = useState('lkmk')
    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data };
    }

    useEffect(() => {
        const token = localStorage.getItem('virus');
        if (token!=null) {
            console.log(decrypt().data.login)
                setIsAuthenticated(true);
                //Rehefa mbola conncté nefa te hiverina @/login ,tonga de dirigeny 
                if (pathname=='/') {
                    navigate('/acceuil');
                }else{
                    navigate(pathname);
                }
            
        } else {
            setIsAuthenticated(false);
            navigate('/');
        }
    }, [navigate]);

    const login = async (info, url) => {
        setchargement(true)
        try {
            await axios.post(url + 'login', info,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                }
            ).then(res => {
                setloginpass('res.data.login.password');
                if (res.data.login.login != 'Login ou mot de passe erronne , Merci de verifier' && res.data.login.password!="" ) {
                    setnotif(res.data.login.login)
                    setIsAuthenticated(true);
                    const infoRm=JSON.stringify(res.data.login);
                    const infocrypte=CryptoJS.AES.encrypt(infoRm,secret);
                    localStorage.setItem('virus', infocrypte.toString());

                    setTimeout(() => {
                        navigate('/acceuil');
                       
                    }, 500)
                }else{
                    setnotif(res.data.login.login);
                }
                setnotif('');

                setchargement(false)
            })
                .catch(err => {
                    console.log(err);
                });
            return 'ind';
        } catch (err) {
            console.error(err);
        }
    };
    const inscriptionlogin = async (info, url) => {
        setchargement(true)
        try {
            await axios.post(url + 'ajoutRmAssocier', info,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "X-API-KEY": "tamby"
                    },
                }
            ).then(res => {
                setnotif(res.data)
                setchargement(false)
            })
                .catch(err => {
                    console.log(err);
                });
            return 'ind';
        } catch (err) {
            setnotif({etat:'error',situation : 'Connexion',message:'Vérifier votre connexion !'});
            console.error(err);
        }
    };

    const logout = () => {
        navigate('/');
        localStorage.removeItem('token');
        localStorage.removeItem('virus');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login,notif,chargement, logout,secret,inscriptionlogin };
};

export default useAuth;
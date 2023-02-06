import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card';
import CryptoJS from 'crypto-js';
import useAuth from '../Login/useAuth';
import React from 'react'

export default function Accueil() {
    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {

        const virus = localStorage.getItem("virus");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        
        return { data }
    }
    return (
        <div className='grid h-full'>
            <div className='col-12 pt-0'>
                <h3 className='text-center m-0 text-surface-500'>Bienvenue ,
                    <strong>
                        CENTRE DE RADIODIAGNOSTIC ET DE THERAPIE , Rôle : {decrypt().data.login}
                    </strong>
                   
                </h3>
            </div>
            <div className="col-4">
                <Card ><p className='text-center'>Diagnostic</p></Card>
            </div>
            <div className="col-4">
                <Card ><p className='text-center'>Radio</p></Card>
            </div>
            <div className="col-4">
                <Card ><p className="text-center">Total</p></Card>
            </div>
            <div className='col-12 h-full'>
                <Card className='w-full h-full'>
                    <p className='text-center h-full'>Info</p>
                </Card>
            </div>
        </div>
    )
}

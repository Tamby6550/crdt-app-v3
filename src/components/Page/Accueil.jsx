import React, { useEffect, useState, useRef } from 'react'
import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card';
import CryptoJS from 'crypto-js';
import useAuth from '../Login/useAuth';
// import { Chart } from 'primereact/chart';

export default function Accueil(props) {
    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {

        const virus = localStorage.getItem("virus");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);

        return { data }
    }
    const [charge, setcharge] = useState(false)

    const [dtChart, setdtChart] = useState(['0', '0', '0']);
    const [chartData, schartData] = useState({
        labels: ['Tarif E', 'Tarif L1', 'Tarif L2'],
        datasets: [
            {
                data: dtChart,
                backgroundColor: [
                    "#FFA726",
                    "#42A5F5",
                    "#66BB6A",
                ],
                hoverBackgroundColor: [
                    "#FFB74D",
                    "#64B5F6",
                    "#81C784",
                ]
            }
        ]
    });
    // const loadData = async () => {
    //     setcharge(true);
    //     await axios.get(props.url + `getChartCategorie`)
    //         .then(
    //             (result) => {
    //                     schartData({
    //                         labels: ['Tarif E', 'Tarif L1', 'Tarif L2'],
    //                         datasets: [
    //                             {
    //                                 data: result.data.categorie,
    //                                 backgroundColor: [
    //                                     "#F55F5F",
    //                                     "#FCB358",
    //                                     "#00BB00",
    //                                 ],
    //                                 hoverBackgroundColor: [

    //                                     "#F23030",
    //                                     "#F28705",
    //                                     "#009900",
    //                                 ]
    //                             }
    //                         ]
    //                     })
    //                 setcharge(false);
    //             }
    //         )
    //         .catch((e) => {
    //             if (e.message == "Network Error") {
    //                 props.urlip()
    //             }
    //         })
    // }
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
                <Card className='pl-5 p-2' style={{color:'grey',fontSize:'1.2em'}} >
                    <div className='flex flex-row justify-content-between'>

                    <div className='flex flex-column ' style={{alignItems:'center',textAlign:'center'}}>
                        <label className='p-2' style={{fontWeight:'700',color:'#4bc54b'}}>Patient CRDT</label>
                        <label  style={{border:'1px solid grey',width:'100%'}} ></label>
                        <label className='p-2' htmlFor="">Total 1245</label>
                    </div>
                    <div className='flex flex-column'>
                        <h6>qklskd</h6>
                    </div>
                    </div>
                </Card>
            </div>
            <div className="col-4">
                <Card ><p className="text-center">Info 2</p></Card>
            </div>
            <div className="col-4">
                <Card ><p className="text-center">Info 3</p></Card>
            </div>
            <div className="col-6">
                <Card >
                    <p>Catégorie</p>
                    {/* {charge ? <h1>Chargement...</h1> :
                        <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '40%' }} />
                    } */}
                </Card>
            </div>
            <div className="col-6">
                <Card ><p className='text-center'>Radio</p></Card>
            </div>
            <div className="col-12">
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

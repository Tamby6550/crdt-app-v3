import React, { useEffect, useState, useRef } from 'react'
import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card';
import CryptoJS from 'crypto-js';
import useAuth from '../Login/useAuth';
import client from './svg/h2.svg'
import benefice from './svg/h3_1.svg'
import home from './svg/h0.svg';
import stock from './svg/h3.svg';
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
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
        <div className="mt-3 lg:px-8 md:px-5 sm:px-3">
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3 lg:px-3">
            <div
              style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
              className="surface-0 h-100  p-4 border-1 border-50 border-round-3xl"
            >
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className=" title-eleo  block text-800 font-medium mb-3">
                    Nombre clients
                  </span>
                  <div className="text-900 font-medium text-xl">1522</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center  border-round"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <img src={home} alt="Point de vente" />
                </div>
              </div>
              <span className="block text-800 font-medium mb-3">
                Actuellement
              </span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 lg:px-3">
            <div
              style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
              className="surface-0 h-100 p-4 border-1 border-50 border-round-3xl"
            >
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className=" title-eleo block text-800 font-medium mb-3">Nombre Patients</span>
                  <div className="text-900 font-medium text-xl">1522</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center border-round"
                  style={{ width: "4.5rem", height: "4.5rem" }}
                >
                  <img src={client} alt="Point de vente" />
                </div>
              </div>
              <span className="block text-800 font-medium mb-3">
                Actuellement
              </span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 lg:px-3">
            <div
              style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
              className="surface-0 h-100 p-4 border-1 border-50 border-round-3xl"
            >
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className=" title-eleo block text-800 font-medium mb-3">Total examens</span>
                  <div className="text-900 font-medium text-xl">1522</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center border-round"
                  style={{ width: "4.5rem", height: "4.5rem" }}
                >
                  <img src={stock} alt="Point de vente" />
                </div>
              </div>
              <span className="block text-800 font-medium mb-3">
                Actuellement
              </span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 lg:px-3">
            <div
              style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
              className="surface-0 h-100 p-4 border-1 border-50 border-round-3xl"
            >
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className=" title-eleo block text-800 font-medium mb-3">
                    Benéfice
                  </span>
                  <div className="text-900 font-medium text-xl">152000 Ar</div>
                </div>
                <div
                  className="flex align-items-center justify-content-center border-round"
                  style={{ width: "5rem", height: "5rem" }}
                >
                  <img src={benefice} alt="Point de vente" />
                </div>
              </div>
              <span className="block text-800 font-medium mb-3">
                Actuellement
              </span>
            </div>
          </div>
        </div>
        <div className="pt-5 pb-2">
          <div className="p-3 py-1 text-800 surface-ground h-4 w-25rem border-round-3xl">
            <h4>Localisation de toute les points de vente :</h4>
          </div>
        </div>
        <div className="grid align-items-center">
          <div className="lg:col-5 col-12 flex align-items-center gap-3">
            <p>Trier par :</p>
            <div>
              {/* <FilterMapComponentRg titre="Region" setselectRegion={setselectRegion} listRegion={listRegion} setlistRegion={setlistRegion} selectRegion={selectRegion} /> */}
            </div>
            <div>
              {/* <FilterMapComponentPv titre="Point de vente" listpv={listpv} setselectpv={setselectpv} selectpv={setselectpv} /> */}
            </div>
          </div>
          <div className="lg:col-6 col-12 flex gap-3">
            <div className="flex align-items-center gap-3">
              <p>Plage de dates :</p>
              <Calendar
                selectionMode="range"
                // value={date}
                // onChange={(e) => setDate(e.target.value)}
                placeholder="Choisir une plage de dates"
                readOnlyInput
              />
            </div>
            <div className="ml-auto align-self-center">
              <Button label="Exporter" severity="secondary" />
            </div>
          </div>
        </div>
  
        <div className="grid">
          {/* <div className="lg:col-6 md:col-12 col-12 mt-5">
            <h2 className="m-1 mb-3">Type de vin le plus vendu</h2>
            <Statistique1 data2={data2} selectRegion={selectRegion} selectpv={selectpv} />
          </div>
          <div className="lg:col-6 md:col-12 col-12 mt-5">
          <h2 className="m-1 mb-3" style={{textAlign:'center'}} >Nombre de bouteille vendu par type de vin</h2>
            <Statistique2 />
          </div> */}
        </div>
        {/* <h2 className="text-start mt-4 mb-3">
          Faire une prédiction de chiffre d'affaires dans :
        </h2>
        <div className="flex justify-content-start align-items-center gap-3 mt-3">
          <input 
            id="firstname6"
            type="number"
            name="raison"
            placeholder="Chercher une région "
            value={mois}
            onChange={(e) => setmois(e.target.value)}
            className=" w-10rem text-base mb-2 mt-1 text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
          />
          <p>mois</p>
        </div>
        <div className="flex justify-content-start my-3">
          <Button
            label="Prédire"
            icon=" "
            className="p-button-secondary px-3"
            onClick={() => predicition()}
          />
        </div>
        <h3 className="text-start my-3">Resultat : {result} </h3> */}
      </div>
    )
}

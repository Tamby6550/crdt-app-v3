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
import { Chart } from 'primereact/chart';
import axios from 'axios';
import Statistique from './Acceuil/Statistique';
import Statistique1 from './Acceuil/Statistique1';
import moment from 'moment/moment';
import { ProgressBar } from 'primereact/progressbar';

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

  const [stat, setstat] = useState({
    totalClient: "0", totalClientActif: "0", totalExamen: "0", totalPatient: "0", totalPatientActif: "0"
  })
  const [dtChart, setdtChart] = useState(['0', '0', '0']);
  const [dtChart2, setdtChart2] = useState(['0', '0', '0']);

  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const loadData = async () => {
    await axios.get(props.url + `getChartCategorie`)
      .then(
        (result) => {

          setdtChart(result.data.categorie)
          // setcharge(false);
          loadDatatype();
        }
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }
  const loadDatatype = async () => {
    await axios.get(props.url + `getRechercheType`)
      .then(
        (result) => {
          setdtChart2(result.data.categorie)
          setcharge(false);
        }
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }
  const loadDonne = async () => {
    setcharge(true);
    await axios.get(props.url + `getStatAcceuil`)
      .then(
        (result) => {

          setstat(result.data)
          loadData();
        }
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }

  function calculerPourcentage(valeur, total) {
    const pourcentage = (valeur / total) * 100;
    return pourcentage.toFixed(0);
  }

  const convertDate = (date) => {
    rechercheParDate(moment(date[0], 'YYYY-MM-DD').format('DD-MM-YYYY'), moment(date[1], 'YYYY-MM-DD').format('DD-MM-YYYY'));
  }
  const convertDateType = (date) => {
    rechercheParDateType(moment(date[0], 'YYYY-MM-DD').format('DD-MM-YYYY'), moment(date[1], 'YYYY-MM-DD').format('DD-MM-YYYY'));
  }

  const rechercheParDate = async (data1, data2) => {
    setcharge(true);
    await axios.get(props.url + `getRechercheChart/${data1}&${data2}`)
      .then(
        (result) => {
          setdtChart(result.data.categorie)
          setcharge(false);
        }
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }
  const rechercheParDateType = async (data1, data2) => {
    setcharge(true);
    await axios.get(props.url + `getRechercheChartType/${data1}&${data2}`)
      .then(
        (result) => {
          setdtChart2(result.data.categorie)
          setcharge(false);
        }
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }

  useEffect(() => {
    loadDonne();
  }, []);

  useEffect(() => {
    if (date !== null) {
      convertDate(date)
    }
   
  }, [date]);
  useEffect(() => {
    if (date2 !== null) {
      convertDateType(date2)
    }
   
  }, [date2]);


  const datet = new Date();
  const anneee = datet.getFullYear();

  return (
    <div className="mt-3 lg:px-8 md:px-5 sm:px-3">
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-6 lg:px-4">
          <div
            style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
            className="surface-0 h-100  p-4 border-1 border-50 border-round-3xl"
          >
            <div className="flex justify-content-between mb-3">
              <div>
                <span className=" title-eleo  block text-800 font-medium mb-3 acceuil-titre">
                  Clients
                </span>
                <div className="text-900 font-medium text-xl">{stat.totalClient}</div>
              </div>
              <div className="flex align-items-center justify-content-center  border-round" style={{ width: "3rem", height: "3rem" }}>
                <img src={home} alt="Point de vente" />
              </div>
            </div>
            <span className="block  font-medium mb-3 acceuil-actifs  ">
              <span className=' flex justify-content-between align-items-center' >
                <span>Actifs en {anneee}</span>
                <ProgressBar value={calculerPourcentage(stat.totalClientActif, stat.totalClient)} style={{ width: '60%', height: '10px' }} color='#A855F7' ></ProgressBar>
              </span>

            </span>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-6 lg:px-4">
          <div
            style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
            className="surface-0 h-100 p-4 border-1 border-50 border-round-3xl"
          >
            <div className="flex justify-content-between mb-3">
              <div>
                <span className=" title-eleo block text-800 font-medium mb-3">Nombre Patients</span>
                <div className="text-900 font-medium text-xl">{stat.totalPatient}</div>
              </div>
              <div
                className="flex align-items-center justify-content-center border-round"
                style={{ width: "4.5rem", height: "4.5rem" }}
              >
                <img src={client} alt="Point de vente" />
              </div>
            </div>
            <span className="block  font-medium mb-3 acceuil-actifs  ">
              <span className=' flex justify-content-between align-items-center' >
                <span>Actifs en {anneee}</span>
                <ProgressBar value={calculerPourcentage(stat.totalPatientActif, stat.totalPatient)} style={{ width: '60%', height: '10px' }} color='#F97316' ></ProgressBar>
              </span>

            </span>
          </div>
        </div>
        {/* <div className="col-12 md:col-6 lg:col-4 lg:px-4">
          <div
            style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}
            className="surface-0 h-100 p-4 border-1 border-50 border-round-3xl"
          >
            <div className="flex justify-content-between mb-3">
              <div>
                <span className=" title-eleo block text-800 font-medium mb-3">Total examens</span>
                <div className="text-900 font-medium text-xl">{stat.totalExamen}</div>
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
        </div> */}
        {/* <div className="col-12 md:col-6 lg:col-3 lg:px-3">
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
        </div> */}
      </div>
      <div className="pt-5 pb-2 flex flex-row justify-content-between">
        <div className="p-3 py-1 text-800 surface-ground h-4 w-25rem border-round-3xl">
          <h4>Statistique tarifs en {anneee} :</h4>
        </div>
        {/* <div className="p-3 py-1 text-800 surface-ground h-4 w-25rem border-round-3xl">
          <h4>Autre Statistique :</h4>
        </div> */}
      </div>
      <div className="grid align-items-center">
        <div className="lg:col-6 col-12 flex gap-3">
          <div className="flex align-items-center gap-3">
            <p>Recherche par dates :</p>
            <Calendar
              selectionMode="range"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Choisir une plage de dates"
              readOnlyInput
            />
          </div>
        </div>
        <div className="lg:col-6 col-12 flex gap-3">
          <div className="flex align-items-center gap-3">
            <p>Recherche par dates :</p>
            <Calendar
              selectionMode="range"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              placeholder="Choisir une plage de dates"
              readOnlyInput
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="lg:col-6 md:col-12 col-12 mt-5">
          <Statistique dtChart={dtChart} />
        </div>
        <div className="lg:col-6 md:col-12 col-12 mt-5">
          <Statistique1 dtChart={dtChart2} />
        </div>
      </div>

    </div>
  )
}

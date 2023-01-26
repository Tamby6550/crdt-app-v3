import React, { useRef, useState } from "react";
import BundledEditor from "../../service/EditorTiny/BundledEditor";

import Facture from "../Facture";
import ReactToPrint from "react-to-print";
import axios from "axios";
import "../../../facture.css";
export default function App() {
  const editorRef = useRef(null);
  let reportTemplateRef = useRef();
  const [content, setContent] = useState(null);
  const montant = {
    num_fact: "23/01/0012",
    montant_brute: "165000",
    remise: "0",
    montant_net: "165000",
    patient: "Test",
    montant_payer_patient: "165000",
    client: "-",
    prise_en_c: "0",
    montant_prise_en_c: "0",
  };

  const examens = [
    {
      num_fact: "23/01/0012",
      lib_examen: "ELECTRO-CARDIO-GRAM",
      code_tarif: "Z15",
      quantite: "1",
      montant: "55000",
      date_examen: "2023-01-07 20:54:17",
      type: "ECG",
      rejet: "0",
      num_arriv: "001",
      date_arriv: "2023-01-04 00:00:00",
      cr_name: "-",
      date_exam: "07/01/2023",
    },
    {
      num_fact: "23/01/0012",
      lib_examen: "ECHOGRAPHIE ABDOMINALE",
      code_tarif: "K15",
      quantite: "1",
      montant: "55000",
      date_examen: "2023-01-07 20:54:17",
      type: "ECHOGRAPHIE",
      rejet: "0",
      num_arriv: "001",
      date_arriv: "2023-01-04 00:00:00",
      cr_name: "04012023001ECHOGRAPHIE ABDOMINALE",
      date_exam: "07/01/2023",
    },
    {
      num_fact: "23/01/0012",
      lib_examen: "BASSIN 1 INC",
      code_tarif: "Z15",
      quantite: "1",
      montant: "55000",
      date_examen: "2023-01-07 20:54:17",
      type: "RADIOGRAPHIE",
      rejet: "0",
      num_arriv: "001",
      date_arriv: "2023-01-04 00:00:00",
      cr_name: "04012023001BASSIN 1 INC",
      date_exam: "07/01/2023",
    },
  ];

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      var myElement = document.getElementById("test");
      myElement.innerHTML = editorRef.current.getContent();

      setContent(editorRef.current.getContent());
    }
  };
  const save = () => {
    var myElement = document.getElementById("test");
    try {
      axios
        .post("http://127.0.0.1:5000/api/hello/test")
        .then((r) => console.log(r))
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  };
  var date = new Date();

  var jourSemaine = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  var jour = jourSemaine[date.getUTCDay()];

  var mois = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  var moisActuel = mois[date.getUTCMonth()];

  var jourDuMois = date.getUTCDate();
  var jourDuMoisFormatte = jourDuMois < 10 ? "0" + jourDuMois : jourDuMois;

  var annee = date.getUTCFullYear();

  console.log(jour + " " + jourDuMoisFormatte + " " + moisActuel + " " + annee);
  return (
    <div className="">

      <ReactToPrint
        trigger={() => <button className="p-button">Generer pdf</button>}
        content={() => reportTemplateRef}
      />

      <div
        className="facture w-100 h-100"
        ref={(el) => (reportTemplateRef = el)}
      >
        <table
          width="100%"
          height="130"
          border="0"
          align="center"
          class="Input1"
        >
          <tr class="Input1">
            <td width="317" height="23">
              <strong>RC:</strong>
              <br />
              <strong>STAT:</strong>
              <br />
              <strong>CIF:</strong> <br />
              <strong>NIF:</strong>
            </td>

            <td width="425">
              <p>Antananarivo,le {jour + " " + jourDuMoisFormatte + " " + moisActuel + " " + annee}</p>
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td height="26" colspan="3">
              <table width="269" border="0" align="center">
                <tr>
                  <td width="251">
                    <span class="Style4">FACTURE N° :{montant.num_fact}</span>
                  </td>
                </tr>
              </table>
              <p>&nbsp;</p>
            </td>
          </tr>
        </table>
        <table width="99%" border="0" align="center" class="table">
          <tr>
            <td class="table" width="26%">
              <strong>PATIENT(E):</strong>
            </td>
            <td colspan="2" class="table">
              {montant.patient}
            </td>
          </tr>
          <tr>
            <td rowspan="4" class="table">
              <strong>PRISE EN CHARGE : </strong>
            </td>
            <td width="74%" rowspan="4" class="table">
              {montant.client}({montant.prise_en_c}%)
            </td>
          </tr>
        </table>
        <br />
        <br />
        <table width="99%" border="0" align="center" class="table">
          <tr>
            <td class="table" width="84%">
              <span class="Style4">EXAMENS</span>
            </td>
            <td align="center" class="table" width="16%">
              <span class="Style4">MONTANT</span>
            </td>
          </tr>

          <tr>
            <td class="input1" height="26">
              {examens.map((element) => (
                <div>
                  {element.lib_examen === null ||
                    element.lib_examen === "" ||
                    element.lib_examen === undefined ? (
                    <>vide</>
                  ) : (
                    <>{element.lib_examen}</>
                  )}
                </div>
              ))}
            </td>
            <td align="right" class="table" style={{ padding: "0px" }}>
              {examens.map((element) => (
                <div style={{ width: "100%", borderTop: "0.3px solid black" }}>
                  {element.montant === null ||
                    element.montant === "" ||
                    element.montant === undefined ? (
                    <>vide</>
                  ) : (
                    <>{parseFloat(element.montant).toFixed(2)}</>
                  )}
                </div>
              ))}
            </td>
          </tr>

          <tr>
            <td height="26" class="Style3 table">
              <div align="right" class="Style5">
                TOTAL BRUT:
              </div>
            </td>
            <td align="right" class="table">
              {parseFloat(montant.montant_brute).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td height="26" class="Style3 table">
              <div align="right" class="Style5">
                REMISE :
              </div>
            </td>
            <td align="right" class="table">
              {parseFloat(montant.remise).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td height="26" class="Style3 table">
              <div align="right" class="Style5">
                MONTANT NET:
              </div>
            </td>
            <td align="right" class="table">
              {parseFloat(montant.montant_net).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td height="28" class="Style3 table">
              <div align="right" class="Style5">
                PAYE PAR LE(LA)PATIENT(E):{" "}
              </div>
            </td>
            <td align="right" class="table">
              {parseFloat(montant.montant_payer_patient).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td height="28" class="Style3 table">
              <div align="right" class="Style5">
                MONTANT DE LA PRISE EN CHARGE:
              </div>
            </td>
            <td align="right" class="table">
              {parseFloat(montant.montant_prise_en_c).toFixed(2)}
            </td>
          </tr>
        </table>
        <br />
        <br />
        <table width="719" border="0" align="center">
          <tr>
            <td width="428">
              Arrêté la présente facture à la somme de: <br />/
              {'NumberToLetter(montant.montant_brute)'} Ariary /
            </td>
            <td width="199">&nbsp;</td>
            <td width="78">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td height="38">&nbsp;</td>
            <td>
              <div align="left">Pour le CRDT </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

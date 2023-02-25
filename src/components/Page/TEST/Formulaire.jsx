import React, { useState, useEffect, useRef } from 'react'
import CRmodel from '../ModelCR/CRmodel'
import Datab from './Datab'
export default function Formulaire() {
  const { data } = Datab();
  function change() {
    const rows = data.split("\n"); // séparer les lignes
    const headers = rows[0].split(";"); // séparer les entêtes
    let query = "INSERT INTO table_name (";
    for (let i = 0; i < headers.length; i++) {
      query += headers[i];
      if (i < headers.length - 1) {
        query += ",";
      }
    }
    query += ") VALUES ";
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(";");
      query += "(";
      for (let j = 0; j < values.length; j++) {
        const value = values[j].replace(/'/g, "''"); // échapper les apostrophes
        query += "'" + value + "'";
        if (j < values.length - 1) {
          query += ",";
        }
      }
      query += ")";
      if (i < rows.length - 1) {
        query += ",";
      }
    }
    console.log(query);
  }
  return (
    <div className='text-center'>
      <button onClick={change} >ok</button>
    </div>
  )
}

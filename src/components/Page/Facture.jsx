import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import PatientNonFacture from './Facture/PatientNonFacture';
import FactureNonRegler from './Facture/FactureNonRegler';
import FactureRegler from './Facture/FactureRegler'

export default function Facture(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index) }} >
          <TabPanel header="Patient non facturé"   >
            <PatientNonFacture url={props.url} activeIndex={activeIndex} setActiveIndex={setActiveIndex}  />
          </TabPanel>
          <TabPanel header="Facture non reglée">

            <FactureNonRegler url={props.url} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="Facture réglée">
            <FactureRegler url={props.url} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

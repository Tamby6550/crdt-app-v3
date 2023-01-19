import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import FactureNon from './Facture/FactureNon';
import FactureEff from './Facture/FactureEff';
export default function Facture(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index) }} >
          <TabPanel header="Patient non facturé"   >
           <FactureNon  url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
          <TabPanel header="Facture non regler">
          
           <FactureEff  url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
          <TabPanel header="Facture régler">
          <h1>Hello</h1>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

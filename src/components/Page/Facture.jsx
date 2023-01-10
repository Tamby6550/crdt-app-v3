import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import FactureNon from './Facture/FactureNon';

export default function Facture(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index) }} >
          <TabPanel header="Liste Non Facturé"   >
           <FactureNon  url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
          <TabPanel header="Liste Facturé">
           <h1>dfgdf</h1>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import ExamenNonEff from './ExamenJour/ExamenNonEff';
import ExamenEff from './ExamenJour/ExamenEff';
import ExamenEffValide from './ExamenJour/ExamenEffValide';
export default function ExamenParPatient(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e)=>{ setActiveIndex(e.index) }} >
          <TabPanel header="Patient à examiner"   >
            <ExamenNonEff url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
          <TabPanel header="Patient en attente de validation">
            <ExamenEff url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
          <TabPanel header="Patient examiné">
            <ExamenEffValide url={props.url}  activeIndex={activeIndex} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import InsertModel from './InsertModel';

export default function ModelPage(props) {

  const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   console.log(activeIndex)
  // }, [activeIndex])
  
  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e)=>{ setActiveIndex(e.index) }} >
          <TabPanel header="AJOUT DE NOUVEAU MODELE DE CR"   >
            <InsertModel url={props.url}  activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="LISTE DES MODELES">
            <h1>hello</h1>
            {/* <ExamenEff url={props.url}  activeIndex={activeIndex} setActiveIndex={setActiveIndex} /> */}
          </TabPanel>
         
        </TabView>
      </div>
    </div>
  )
}

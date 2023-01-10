
import React, { useState, useEffect } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';

// import './BlockUIDemo.css';

export const BlockUIDemo = () => {

    const [blockedPanel, setBlockedPanel] = useState(false);
    const [blockedDocument, setBlockedDocument] = useState(false);

    useEffect(() => {
        if(blockedDocument) {
            setTimeout(() => {
                setBlockedDocument(false);
            }, 3000);
        }
    }, [blockedDocument])

    const blockDocument = () => {
        setBlockedDocument(true);
    }

    const blockPanel = () => {
        setBlockedPanel(true);
    }

    const unblockPanel = () => {
        setBlockedPanel(false);
    }

    return (
        <div className="blockui-demo">
            <div className="card">
                <h5>Document</h5>
                <BlockUI blocked={blockedDocument} fullScreen />

                <Button type="button" label="Block" onClick={blockDocument} />

                <h5>Panel</h5>
                <Button type="button" label="Block" onClick={blockPanel} />
                <Button type="button" label="Unblock" onClick={unblockPanel} />

                <BlockUI blocked={blockedPanel}>
                    <Panel header="Basic" style={{ marginTop: '20px',color:'black' }}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </Panel>
                </BlockUI>

                <BlockUI blocked={blockedPanel} template={ <ProgressSpinner /> }>
                    <Panel header="Template" style={{ marginTop: '20px' }}>
                        
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </Panel>
                </BlockUI>
            </div>
            
        </div>
    )
}
                 
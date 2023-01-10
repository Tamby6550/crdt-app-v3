import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card'
import React from 'react'

export default function Accueil() {
    return (
        <div className='grid h-full'>
            <div className='col-12 pt-0'>
                <h3 className='text-center m-0 text-surface-500'>Bienvenue dans CRDT-APP <span className={PrimeIcons.CLOUD}></span></h3>
            </div>
            <div className="col-4">
                <Card ><p className='text-center'>Diagnostic</p></Card>
            </div>
            <div className="col-4">
                <Card ><p className='text-center'>Radio</p></Card>
            </div>
            <div className="col-4">
                <Card ><p className="text-center">Total</p></Card>
            </div>
            <div className='col-12 h-full'>
                <Card className='w-full h-full'>
                    <p className='text-center h-full'>Info</p>
                </Card>
            </div>
        </div>
    )
}
